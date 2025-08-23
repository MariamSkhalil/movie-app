import React from 'react'

function ProgressBar({watchlist}) {
    const total= watchlist.length
    const watched= watchlist.filter(m=> m.watched).length
    const percentage= total> 0 ? (watched/total) * 100 : 0
  return (
    <div className="w-64 bg-gray-200 h-3 rounded mb-4">
      <div 
        className="bg-gradient h-3 rounded transition-all" 
        style={{ width: `${percentage}%` }}
      />
      <p className="text-sm text-center mt-1 text-white">
        {watched} / {total} films watched
      </p>
    </div>
  )
}

export default ProgressBar