import SearchResult from './SearchResult'

const Tasks = ({ results }) => {
    return (
        <>
            {results.map((result, index) => (
                <SearchResult key={index} result={result} />
            ))}
        </>
    )
}

export default Tasks