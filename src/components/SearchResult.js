import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import { FaStarOfLife } from 'react-icons/fa'



const SearchResult = ({ result }) => {
    const [expanded, setExpanded] =  useState(false)

    return (
        <div
            className={`result ${expanded && 'reminder'}`}
            onDoubleClick={() => setExpanded(!expanded)}
        >
            {expanded ? 
                <>
                    <p>score: {result.score}</p>
                    <h3>
                        <a href={result.doi ? `https://doi.org/${result.doi}` : result.url}>{result.title}</a>
                    </h3>
                    <p>Journal: {result.journal ? result.journal : (<i>Unknown journal</i>)}</p>
                    <p>Source: {result.source ? result.source : (<i>Unknown source</i>)}</p>
                    <p>Authors: {result.authors}</p>
                    <p><span style={{ background: '#807f7f', borderRadius: '5px', color: 'white', padding: '2px' }}>Abstract</span><span className="abstract" dangerouslySetInnerHTML={{ __html: result.raw }}/></p>
                </>
                :
                <>
                    <p>score: {result.score}</p>
                    <h3>
                        <a href={result.doi ? `https://doi.org/${result.doi}` : result.url}>{result.title}</a>
                    </h3>
                    <p>Journal: {result.journal ? result.journal : (<i>Unknown journal</i>)}</p>
                    <p>Source: {result.source ? result.source : (<i>Unknown source</i>)}</p>
                    <p>Authors: {result.authors}</p>
                    <span style={{ background: '#807f7f', borderRadius: '5px', color: 'white', padding:'2px' }}>Abstract Highlights : </span>
                    {result.abssents.map((sentence) => (
                        <div className={'abssent'}> <FaStarOfLife/> {sentence}</div>
                    ))}
                </>
            }
        </div>
    )
}

export default SearchResult