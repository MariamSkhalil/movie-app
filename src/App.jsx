import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateWatchlistCount } from './appwrite'
import Main from './components/Main'
import SideBar from './components/SideBar'

const API_BASE_URL= 'https://api.themoviedb.org/3'
const API_KEY= import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS={
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchedFor, setSearchedFor]= useState('')
  const [errorMsg, setErrorMsg]= useState('')
  const [movies, setMovies]= useState([])
  const [isLoading, setIsLoading]= useState(false) //Since loading from API can take time, you need to show the user it's loading
  const [debouncedSearchedFor, setDebouncedSearchedFor]= useState('')
  const [trendingMovies, setTrendingMovies]= useState([])
  const [showSidebar , setShowSidebar]= useState(false)
  //localStorage.clear()
  const [watchlist, setWatchlist]= useState(()=>{
    //load from LOCAL STORAGE at first load
    const saved= localStorage.getItem("watchlist")
    return saved ? JSON.parse(saved): [] 
  })

  function handleToggleShow(){
    setShowSidebar(!showSidebar)
    //console.log('button pressed', !showSidebar)
  }

  function handleAddToWatchlist(movie) {
  // avoid duplicates correctly
  if (!watchlist.find(item => item.movie.id === movie.id)) {
    setWatchlist([...watchlist, { movie, watched: false }])
    updateWatchlistCount(movie)
  }
}

function handleRemoveFromWatchlist(movieID) {
  setWatchlist(prev =>
    prev.map(item =>
      item.movie.id === movieID
        ? { ...item, watched: !item.watched }
        : item
    )
  )
}

  //Persist to Local Storage whenever watchlist changes
  useEffect(()=>{
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`Key: ${key}, Value: ${value}`);
    }
  }, [watchlist])

  //utilise debouncing so the api isnt called for each letter typed into the search form (too many api req) 
  //but after the user hasnt typed for 500ms
  useDebounce(()=>setDebouncedSearchedFor(searchedFor), 500, [searchedFor]) 

  const fetchMovies = async (query='') => {
    setIsLoading(true)
    setErrorMsg('')

    try {
      const endpoint= query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`  //Phase1: connect to API to get searched for movie
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc` //Phase1: connect to API to get all movies

      const response= await fetch(endpoint, API_OPTIONS)

      if (!response.ok){ //if failed to connect due to lack of authorization, connection failure, etc
        throw new Error('Failed to fetch movies')
      }

      const data= await response.json() //Phase2: fetch data

      if(data.Response=='False'){ //IN CASE OF FAILURE AT FETCHING DATA
        setErrorMsg(data.Error || 'Failed to fetch movies')
        setMovies([])
        return
      }
      setMovies(data.results || []) //Phase3: show the data results

      /*if(query && data.results.length>0){
        await updateSearchCount(query, data.results[0])
      }*/
      
    } catch (error) {
      console.error(`Error fetching: ${error}`)
      setErrorMsg('Error fetctching movies. Please try again later.')
    }finally{
      setIsLoading(false)
    }
  }

  const fetchTrendingMovies = async()=>{
    try {
      const movies= await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`)     
    }

  }

  useEffect(()=>{
    fetchMovies(debouncedSearchedFor)
  }, [debouncedSearchedFor])

  useEffect(()=>{
    fetchTrendingMovies()
  },[])

  return (
    <>
      <Main searchedFor={searchedFor} setSearchedFor={setSearchedFor} errorMsg={errorMsg} watchlist={watchlist} trendingMovies={trendingMovies} isLoading={isLoading} movies={movies} handleToggleShow={handleToggleShow} handleAddToWatchlist={handleAddToWatchlist} />
      {showSidebar && <SideBar handleToggleShow={handleToggleShow} watchlist={watchlist} handleRemoveFromWatchlist={handleRemoveFromWatchlist}/>}
    </>
  )
}

export default App