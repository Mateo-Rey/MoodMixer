import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const spotifyLogin = () => {
    window.open("http://127.0.0.1:5123/auth/login", "_self");
  }
  const spotifySearch = async () => {
    const encodedSearchQ = encodeURIComponent(searchQuery.trim())
    const query = `q=${encodedSearchQ}&type=${selectedSearchType}`
    const response = await fetch("http://localhost:5123/service/spotifySearch", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({query: query}),
      credentials: 'include'
    })
    const data = await response.json()
    console.log(data)
  }
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSearchType, setSelectedSearchType] = useState()
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      spotifySearch()
    }
  }
  console.log(searchQuery)
  return (
    <>
      {token ? (
       <>
       <h2>Add artists, tracks, and genres to the Music Mixer</h2>
       <div>
        <select value={selectedSearchType} onChange={(e) => setSelectedSearchType(e.target.value)}>
          <option value="artist">Artist</option>
          <option value="genre">Genre</option>
          <option value="track">Song</option>
        </select>
       
       <input onKeyDown={handleSearchKeyDown} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
       </div>
       </>
      ) : (
        <div>
          <button onClick={spotifyLogin}>
            Login
          </button>
        </div>
      )}
    </>
  );
}

export default App;