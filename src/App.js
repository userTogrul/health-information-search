import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'


import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Search from './components/Search'
import SearchResults from './components/SearchResults'
import SearchResult from './components/SearchResult'


function App() {
  const [showSearch, setShowSearch] = useState(true)
  const [searchResults, setSearchResults] = useState('')
  const [loading, setLoading] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)

  // brackets argument in useEffect prevents recursive calls
  useEffect(() => {
    const getTime = async() => {
      const timeFromServer = await fetchTime()
      console.log("Current time in server : ", timeFromServer.time)
      const query = JSON.parse(localStorage.getItem('query'))
      if (query) {
        console.log(query)
        onSearch({ query })
      }
    }

    getTime()
  }, [])

  //get time from api
  const fetchTime = async () => {
    const res = await fetch('/api/time')
    const data = await res.json()

    return data
  }

  //fetch search results
  const fetchSearchResults = async (query) => {
    const res = await fetch('/api/results',{
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(query),
    })
    const data = await res.json()
    return data
  }

  //get search results
  const onSearch = async (query) => {
    setLoading(true)
    const searchResultsFormServer = await fetchSearchResults(query)
    setLoading(false)
    setSearchResults(searchResultsFormServer.results)
  }

  //get search results for landing pages
  const onLandSearch = (query) => {
    if (query === "") {
      setOpenSearch(true)
      localStorage.setItem('query', JSON.stringify(query))
      setSearchResults("")
    } else {
      localStorage.setItem('query', JSON.stringify(query))
      setOpenSearch(false)
      onSearch({ query })
    }
  }

  return (
    <Router>
      <div className="container">
        <Header 
          onSearch={() => setShowSearch(!showSearch)}
          showSearch={showSearch} />
        <Route
        exact
        path='/'>
          <div className="welcome">
            <h1>Welcome</h1>
            <h2>A health information search platform aimed at claim verification based on existing scientific research</h2>
            <div>
              <div>Based CORD-19 open research dataset</div> 
              <div><Link style={{fontWeight: '700', textDecoration: 'none', listStyle: 'none'}} to={'/search'} onClick={() => onLandSearch("")}>Start your own search</Link>  or pick one of the example search queries:</div>
            </div>
            <div>
              <div><Link to={'/search'} onClick={() => onLandSearch('Mass masking reduces COVID-19 transmission rates.')}>Mass masking reduces COVID-19 transmission rates.</Link></div>
              <div><Link to={'/search'} onClick={() => onLandSearch('Older age is a positive predictor of mortality in COVID-19.')}>Older age is a positive predictor of mortality in COVID-19.</Link></div>
              <div><Link to={'/search'} onClick={() => onLandSearch('The coronavirus cannot thrive in warmer climates.')}>The coronavirus cannot thrive in warmer climates.</Link></div>
              <div><Link to={'/search'} onClick={() => onLandSearch('Health care workers working with COVID-19 have an increased risk for mental illness.')}>Health care workers working with COVID-19 have an increased risk for mental illness.</Link></div>
              <div><Link to={'/search'} onClick={() => onLandSearch('Incubation period for Covid-19.')}>Incubation period for Covid-19.</Link></div>
              <div><Link to={'/search'} onClick={() => onLandSearch('Vitamin C cures coronavirus.')}>Vitamin C cures coronavirus.</Link></div>
              <div><Link to={'/search'} onClick={() => onLandSearch('Covid vaccines are harmful.')}>Covid vaccines are harmful.</Link></div>
            </div>
          </div>
        </Route>
        <Route 
        path='/search'
        exact
        render={(props) => (
          <>
            {showSearch && <Search onSearch={onSearch} />}
            {
              loading ? <div style={{ textAlign: "center", padding: "200px" }}><FaSpinner icon="spinner" className="spinner" /> Searching, please wait</div> :
                (searchResults.length > 0 ? (
                    <SearchResults
                      results={searchResults}
                    />
                  ) : (
                    <div style={{ textAlign: "center", padding: "200px" }}>{openSearch ? 'Start searching now!' : 'No results found for your query :('}</div>
                  )
                )
            }
          </>
        )} />

        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  )
}

export default App;
