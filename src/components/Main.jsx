import React from 'react'
import Search from './Search'
import Loading from './Loading'
import MovieCard from './MovieCard'
import ProgressBar from './ProgressBar'

function Main({searchedFor, setSearchedFor, trendingMovies, isLoading, errorMsg, movies, handleToggleShow, handleAddToWatchlist, watchlist}) {
  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <ProgressBar watchlist={watchlist} />
        <button type='button' onClick={handleToggleShow} className=" fixed right-8 text-gradient ">
                    <i class="fa-solid fa-list"></i>
        </button>
        <header>
          <img src='./hero-img.png' alt='Hero Banner'/> 
          <h1> Your Next <span className='text-gradient'>Favourite Film</span> Is Just A Click Away </h1>
          <Search searchedFor={searchedFor} setSearchedFor={setSearchedFor} />

        </header>

        {trendingMovies.length>0 && (
          <section className='trending'>
            <h2 className='mb-15'>Trending Movies</h2>
            
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
                <MovieCard 
                key={movie.id} 
                movie={movie} 
                onAddToWatchlist={() => handleAddToWatchlist(movie)}
                />
              ))}
          </ul>)
          }
        </section>

      </div>
    </main>
  )
}

export default Main