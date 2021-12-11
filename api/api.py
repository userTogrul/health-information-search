import warnings
from transformers import AutoTokenizer, AutoModel
import numpy
import torch
import time
from flask import Flask, request, url_for, flash, redirect
import os
#path to local jdk
os.environ["JAVA_HOME"] = "C:/Program Files/Java/jdk-11.0.11"
from pyserini.search import pysearch
warnings.simplefilter(action='ignore', category=FutureWarning)

app = Flask(__name__, static_folder='../build', static_url_path='/')

#LOAD BASE INFO

#scibert extractor
def extract_scibert(text, tokenizer, model):
    text_ids = torch.tensor([tokenizer.encode(text, add_special_tokens=True)])
    text_words = tokenizer.convert_ids_to_tokens(text_ids[0])[1:-1]

    n_chunks = int(numpy.ceil(float(text_ids.size(1))/510))
    states = []

    for ci in range(n_chunks):
        text_ids_ = text_ids[0, 1+ci*510:1+(ci+1)*510]
        text_ids_ = torch.cat([text_ids[0, 0].unsqueeze(0), text_ids_])
        if text_ids[0, -1] != text_ids[0, -1]:
            text_ids_ = torch.cat([text_ids_, text_ids[0, -1].unsqueeze(0)])

        with torch.no_grad():
            state = model(text_ids_.unsqueeze(0))[0]
            state = state[:, 1:-1, :]
        states.append(state)

    state = torch.cat(states, axis=1)
    return text_ids, text_words, state[0]

#function for cosine sim
def cross_match(state1, state2):
    state1 = state1 / torch.sqrt((state1 ** 2).sum(1, keepdims=True))
    state2 = state2 / torch.sqrt((state2 ** 2).sum(1, keepdims=True))
    sim = (state1.unsqueeze(1) * state2.unsqueeze(0)).sum(-1)
    return sim

#function for highlighting paragraphs


def highlight_paragraph(ptext, rel_words, max_win=10):
    para = ""
    extracted_sentences = []
    prev_idx = 0
    for jj in rel_words:

        if prev_idx > jj:
            continue

        found_start = False
        for kk in range(jj, prev_idx-1, -1):
            try:
                if ptext[kk] == "." and (ptext[kk+1][0].isupper() or ptext[kk+1][0] == '['):
                    sent_start = kk
                    found_start = True
                    break
            except IndexError:
                continue

        if not found_start:
            sent_start = prev_idx-1

        found_end = False
        for kk in range(jj, len(ptext)-1):
            try:
                if ptext[kk] == "." and (ptext[kk+1][0].isupper() or ptext[kk+1][0] == '['):
                    sent_end = kk
                    found_end = True
                    break
            except IndexError:
                continue

        if not found_end:
            if kk >= len(ptext) - 2:
                sent_end = len(ptext)
            else:
                sent_end = jj

        para = para + " "
        para = para + " ".join(ptext[prev_idx:sent_start+1])
        para = para + " <font color='blue'>"
        para = para + " ".join(ptext[sent_start+1:sent_end])
        extracted_sentences.append(
            (" ".join(ptext[sent_start+1:sent_end])).replace(" ##", ""))
        para = para + "</font> "
        prev_idx = sent_end

    if prev_idx < len(ptext):
        para = para + " ".join(ptext[prev_idx:])

    return para, extracted_sentences

tokenizer = AutoTokenizer.from_pretrained('monologg/biobert_v1.1_pubmed', do_lower_case=False)
model = AutoModel.from_pretrained("../datasets/sci_bert_model")
searcher = pysearch.SimpleSearcher('../datasets/lucene-index-cord19-abstract-2020-07-16/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/results', methods=['GET', 'POST'])
def results():
    query = ''

    if request.method == 'POST':
        query = request.json['query']
    
    hits = searcher.search(query, 10)


    results = []
    rank = 0

    query_ids, query_words, query_state = extract_scibert(query, tokenizer, model)

    #generate object to send
    for hit in hits:
        doc_abstract = hit.lucene_document.get('abstract')
        abstract_state = extract_scibert(doc_abstract, tokenizer, model)
        sim_score = cross_match(query_state, abstract_state[-1])
        sim_score = sim_score.data.numpy()
        # Select the two highest scoring words in the paragraph
        rel_words = numpy.sort(numpy.argsort(sim_score.max(0))[-2:][::-1])
        p_tokens = abstract_state[1]
        #get final result
        doc_abstract, extracted_sentences = highlight_paragraph(p_tokens, rel_words)
        doc_abstract = doc_abstract.replace(" ##", "")
        result = {
            'rank': rank,
            'docid': hit.docid,
            'score': hit.score,
            'title': hit.lucene_document.get('title'),
            'doi': hit.lucene_document.get('doi'),
            'url': hit.lucene_document.get('url'),
            'authors': hit.lucene_document.get('authors'),
            'sources': hit.lucene_document.get('source_x'),
            'journal': hit.lucene_document.get('journal'),
            'raw': doc_abstract,
            'abssents': extracted_sentences
        }
        results.append(result)
        rank += 1
    
    return {
        "results":  results  
    }

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}
