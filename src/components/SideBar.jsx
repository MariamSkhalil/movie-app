import React from 'react'
import ListCard from './ListCard'

function SideBar({ handleToggleShow, watchlist, handleRemoveFromWatchlist }) {
  return (
    <div className='sideBar open'>
      <div className='sideBarContent'>
        <h2 className='text-gradient'>WATCHLIST</h2>

        <ul>
            {watchlist.filter(item => item.watched === false).map((item, index)=>(
                <ListCard 
                key={item.movie.id || index}
                movie={item.movie} 
                onRemoveFromWatchlist={() =>handleRemoveFromWatchlist(item.movie.id)}/>
            ))}
        </ul>

        <button className='fixed bottom-0' onClick={handleToggleShow}>Close →</button>
      </div>
    </div>
  )
}


export default SideBar