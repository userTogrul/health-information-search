# Search engine for health information
Course Project from Web Information Retrieval course at Tsinghua University about searching and classifying the results of the queries about healthcare or medical information.

## Introduction

Today, the usage of search engines became a crucial part of our daily life.  People are searching about a variety of topics that are also of paramount importance and even critical for life. One of the striking examples of such topics is public health information. In 2015, one in every 20 searches was about health on Google search engine [[1]](#1). Search Engines can describe the primary informational needs of the Online Health Information Seekers regarding well-established disease symptoms and remedies[[1]](#1). However, there is a specific query type called  Multi-Perspective Consumer Health Information in which there are multiple supporting and opposing views where there is a need for balance. For example, given the query "Can Sun exposure lead to skin cancer?" there is no single correct answer. In addition, search engines face the filter bubble effect which means they can be biased to the party with more views of a specific stance[[2]](#2). Consequently, search engine users can face lots of claims and the spread of disinformation.  However, information retrieval methods with collective intelligence can address the issues. The typical fact-checking pipeline should consider real-world claims, select evidence sentences that can support or refute the claim and predict the veracity based on the evidence. Also, such a pipeline should not be bounded to the collection with already available personal validations such as Wikipedia. A dataset for fack-checking was proposed for NLP tasks which contains claims from the digital journalism project[[3]](#3). LSTM and CNN-based methods were proposed to automatically identify debates from posts about complementary and alternative medicine (CAM) in the online health community[[4]](#4). But they focused only on a specific community and controversial topics were biased by the prevalence of the therapies in the population and amongst forum members. The reproducibility of existing stance detection methods on health-related online news articles was analyzed in [[5]](#5). The authors also used BERT pre-trained language model[[6]](#6).As disinformation is even more observant around the recent COVID-19 pandemic, I decided to build a search engine that can be used for claim verification by extracting evidence sentences from existing scientific articles and papers. I got motivation from a need for a search engine based on controversial public healthcare topics by a close family friend who survived cancer. The proposed search engine implements abstract and title-based search by highlighting evidence sentences.

Please see the [paper](./health_information_search_paper.pdf) for more details.

### How to run

[Link](https://drive.google.com/file/d/1U9gSyNN_nc3-kJqVjxs7jAkux4R9_Xsz/view?usp=sharing) for the index of CORD-19. The index and pretrained model of SciBERT should be located in `datasets` folder after downloading.
A python virtual environment folder should be created inside `api` folder.

Run in termial:
* `yarn start` for front-end server
* `yarn start-api` for back-end server

## References

<a id="1">[[1]](https://blog.google/products/search/health-info-knowledge-graph/)</a> 
P. Ramaswami, “A remedy for your health-related questions: health
info in the knowledge graph,” Feb 2015. 

<a id="2">[[2]](https://doi.org/10.1145/3209978.3210143)</a> 
M. Jang and J. Allan, “Explaining controversy on social media via stance
summarization,” in The 41st International ACM SIGIR Conference on
Research amp; Development in Information Retrieval, ser. SIGIR ’18.
New York, NY, USA: Association for Computing Machinery, 2018, p.
1221–1224 

<a id="3">[[3]](https://www.aclweb.org/anthology/N16-1138)</a> 
W. Ferreira and A. Vlachos, “Emergent: a novel data-set for stance
classification,” in Proceedings of the 2016 Conference of the North
American Chapter of the Association for Computational Linguistics:
Human Language Technologies. San Diego, California: Association for
Computational Linguistics, Jun. 2016, pp. 1163–1168.

<a id="4">[[4]](https://doi.org/10.1145/3041021.3055134)</a> 
S. Zhang, L. Qiu, F. Chen, W. Zhang, Y. Yu, and N. Elhadad, “We make
choices we think are going to save us: Debate and stance identification
for online breast cancer cam discussions,” in Proceedings of the 26th
International Conference on World Wide Web Companion, ser. WWW ’17
Companion. Republic and Canton of Geneva, CHE: International World
Wide Web Conferences Steering Committee, 2017, p. 1073–1081.

<a id="5">[[5]](http://dx.doi.org/10.1007/978-3-030-28577-7_4)</a> 
S. Ghosh, P. Singhania, S. Singh, K. Rudra, and S. Ghosh, “Stance
detection in web and social media: A comparative study,” Experimental
IR Meets Multilinguality, Multimodality, and Interaction, p. 75–87, 2019.

<a id="6">[6]</a> 
J. Devlin, M.-W. Chang, K. Lee, and K. Toutanova, “Bert: Pre-training of
deep bidirectional transformers for language understanding,” 2019.