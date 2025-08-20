import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/search'
import Loading from './components/Loading'
import MovieCard from './components/MovieCard'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const API_BASE_URL= 'https://api.themoviedb.org/3'
const API_KEY= import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS={
  method: 'GET',
  headers: {
    accept: 'application/jason',
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

      if(query && data.results.length>0){
        await updateSearchCount(query, data.results[0])
      }
      
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
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          {/*<button className='py-2.5 px-5 text-sm font-medium text-indigo-500 focus:outline-none bg-transparent rounded hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
            <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
            </svg>
          </button>*/}
          <img src='./hero-img.png' alt='Hero Banner'/> 
          <h1> Your Next <span className='text-gradient'>Favourite Film</span> Is Just A Click Away </h1>
          <Search searchedFor={searchedFor} setSearchedFor={setSearchedFor} />

        </header>

        {trendingMovies.length>0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            
            <ul>
              {trendingMovies.map((movie, index)=>(
                <li key={movie.$id}>
                  <p>{index +1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>

          </section>
        )}

        <section className='all-movies'>
          <h2 className='mt-10'>All Movies</h2>

          {isLoading ? //first we load 
          ( <Loading/> )
          :errorMsg ? //either get an ERROR
          (<p className='text-red-500'>{errorMsg}</p>)
          :(<ul> {/*or we get RESULTS*/}
              {movies.map((movie)=>(
                <MovieCard key={movie.id} movie={movie}/>
              ))}
          </ul>)
          }
        </section>

      </div>
    </main>
  )
}

export default App