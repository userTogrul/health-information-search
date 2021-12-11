import { useState, useEffect } from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';

const Search = ({ onSearch }) => {
    const [query, setQuery] = useState('')
    useEffect(() => {
        const getQuery = () => {
            const res = JSON.parse(localStorage.getItem('query'))

            if (res !== " ") {
                setQuery(res)
            }
            
        }

        getQuery()
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()

        if (!query) {
            alert('Please type into text field')
            return
        }
        localStorage.setItem('query', JSON.stringify(query))
        console.log(localStorage.getItem('query'))
        onSearch({query})
    }

    return (
        <form className="search-form" onSubmit={onSubmit}>
            <div className="form-control">
                <input type='text'
                    placeholder='Search about pandemics'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <button
                style={{ backgroundColor: 'deepblue' }} 
                className='btn' >
                {<FaSearch/>}
            </button>
        </form>
    )
}

export default Search