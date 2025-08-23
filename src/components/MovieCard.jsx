import React, { useState } from 'react'

function MovieCard({movie :{title, vote_average, poster_path, original_language, release_date, overview}, onAddToWatchlist}) {
    const [showOverView, setShowOverView] =useState(false)
    const toggleOverView= ()=>{
        setShowOverView(!showOverView)
    }
  
    return (
    <div className='movie-card'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`: './No-Poster.svg'} alt={title} />
        
        <div className='mt-3'>
            <h3>{title}</h3>
            <div className='content'>

                <div className='rating'>
                    <img src='./star.svg'/>
                    <p>{vote_average ? vote_average.toFixed(1): 'N/A'}</p>
                </div>

                <span>•</span>
                <p className='lang'>{original_language}</p>

                <span>•</span>
                <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>

                <button onClick={toggleOverView} className="px-4 py-2 text-white ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                
            </div>
            {showOverView && (<p className='lang'>{overview}</p>)}

            <button 
                onClick={onAddToWatchlist} 
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
                + Add to Watchlist
            </button>
        </div>
    </div>
  )
}

export default MovieCard