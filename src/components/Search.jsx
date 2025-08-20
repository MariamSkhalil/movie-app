import React from 'react'

function Search({searchedFor, setSearchedFor}) {
  return (
    <div className='search'> {/* The Search Form */}
        <div> {/*Container For The Elements of the form*/}
            <img src='search.svg' alt='search icon'/>
            <input 
            type='text' placeholder='Search through thousands of films'
            value={searchedFor} onChange={(e)=> setSearchedFor(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search