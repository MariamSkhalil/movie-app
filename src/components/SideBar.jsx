import React from 'react'
import ListCard from './ListCard'

function SideBar({ handleToggleShow, watchlist, handleRemoveFromWatchlist }) {
  const active = watchlist.filter(item => !item.watched)
  const finished = watchlist.filter(item => item.watched)
  return (
    // Overlay background
    <div 
      className="fixed inset-0 bg-transparent bg-opacity-50 z-40"
      onClick={handleToggleShow} // clicking overlay closes sidebar
    >
      {/* Stop clicks inside the sidebar from bubbling up to overlay */}
      <div className="sideBar open z-50" onClick={(e) => e.stopPropagation()}>
        <div className='sideBarContent h-screen overflow-y-auto p-4 '>
          <h2 className='text-gradient'>WATCHLIST</h2>

          {/* Active Watchlist */}
          <ul>
            {active.map((item, index) => (
              <ListCard 
                key={item.movie.id || index}
                movie={item.movie} 
                onRemoveFromWatchlist={() => handleRemoveFromWatchlist(item.movie.id)}
              />
            ))}
          </ul>

            {/* Finished Watchlist */}
            {finished.length > 0 && (
            <>
              <h3 className="text-gray-400 mb-2">Finished Watching</h3>
              <ul>
                {finished.map((item, index) => (
                  <ListCard 
                    key={item.movie.id || index}
                    movie={item.movie}
                    watched ={item.watched}
                    onRemoveFromWatchlist={() => handleRemoveFromWatchlist(item.movie.id)}
                  />
                ))}
              </ul>
            </>
          )}
          <button className='flex mb-auto' onClick={handleToggleShow}>
            Close →
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideBar
