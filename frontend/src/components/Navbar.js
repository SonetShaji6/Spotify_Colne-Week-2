import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ onSearch, isDisabled }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="navbar">
      <input
        type="text"
        placeholder="Search for songs, artists, or albums..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        disabled={isDisabled} // Disable input if token is not available
      />
      <button onClick={handleSearch} className="search-button" disabled={isDisabled || !searchQuery.trim()}>
        Search
      </button>
    </nav>
  );
}

export default Navbar;
