import React from 'react'

function ListCard({ movie: { title, vote_average, poster_path, original_language, release_date }, onRemoveFromWatchlist }) {
  return (
    <div className="list-card flex items-start gap-3">
      <div className="flex-shrink-0">
        <img
          src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './No-Poster.svg'}
          alt={title}
          className="w-16 h-auto rounded-lg"
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3>{title}</h3>

        <div className="content flex flex-row items-center gap-2">
          <div className="rating flex items-center gap-1">
            <img src="./star.svg" className="size-4 object-contain" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>

        {/* Remove button sits bottom-right */}
        <button
          onClick={onRemoveFromWatchlist}
          className="mt-auto ml-auto text-gradient"
        >
          <i className="fa-solid fa-check"></i>
        </button>
      </div>
    </div>
  )
}


export default ListCard