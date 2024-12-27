import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Player from './Player';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function Home() {
  const [tracks, setTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isFetchingToken, setIsFetchingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [showScrollToSearch, setShowScrollToSearch] = useState(false);

  const searchBarRef = useRef(null); // Reference for the search bar

  const currentTrack = tracks[currentTrackIndex] || null;

  // Fetch Spotify token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsFetchingToken(true);

        const response = await fetch('http://localhost:5001/api/token', {
          method: 'POST',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch token');
        }

        setToken(data.access_token);
      } catch (err) {
        console.error('Error fetching token:', err);
        setError('Failed to fetch token. Please try again.');
      } finally {
        setIsFetchingToken(false);
      }
    };

    fetchToken();
  }, []);

  // Fetch homepage recommendations when token is ready
  useEffect(() => {
    if (!isFetchingToken && token) {
      fetchTracks();
    }
  }, [isFetchingToken, token]);

  // Fetch tracks based on search query or recommendations
  const fetchTracks = async (query = '', url = null) => {
    if (!token) {
      console.warn('Attempted to fetch tracks without a token');
      return;
    }

    try {
      setIsLoading(true);

      let endpoint;
      if (query) {
        endpoint = url || `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`;
      } else {
        endpoint = 'https://api.spotify.com/v1/browse/new-releases?limit=50';
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch tracks');
      }

      if (query) {
        const uniqueTracks = Array.from(new Map(data.tracks.items.map((t) => [t.id, t])).values());
        setTracks((prev) => (url ? [...prev, ...uniqueTracks] : uniqueTracks));
        setNextUrl(data.tracks.next || null);
      } else {
        const uniqueAlbums = Array.from(new Map(data.albums.items.map((a) => [a.id, a])).values());
        setRecommendations(uniqueAlbums);
      }

      setError('');
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setError(err.message || 'Error fetching tracks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setNextUrl(null);
    setTracks([]);
    if (query) {
      fetchTracks(query);
    } else {
      fetchTracks();
    }
  };

  // Handle infinite scroll and "Scroll to Search" button visibility
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (!nextUrl || isLoading) return;

    if (scrollHeight - scrollTop <= clientHeight + 50) {
      fetchTracks(searchQuery, nextUrl);
    }

    // Show the "Scroll to Search" button when near the bottom of the page
    setShowScrollToSearch(scrollHeight - scrollTop <= clientHeight + 100);
  };

  // Add scroll event listener
  useEffect(() => {
    if (searchQuery) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchQuery, nextUrl, isLoading]);

  // Scroll to the search bar
  const scrollToSearchBar = () => {
    searchBarRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle track selection
  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index);
  };

  // Handle next/previous track
  const handleNextTrack = () => {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePreviousTrack = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };
  
  const handleSearchClick = () => {
    // Check if the search input reference exists and focus on it
    if (searchBarRef.current) {
      searchBarRef.current.focus(); // Focus the search input field
      
      searchBarRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll the search input into view
    }
  };
  
  return (
    <div className="home bg-dark text-light d-flex flex-column min-vh-100">
      {/* Navbar */}
      <div ref={searchBarRef}>
        <Navbar onSearch={handleSearch} isDisabled={isFetchingToken} />
      </div>

      {/* Main Content */}
      <div className="container my-4 flex-grow-1">
        {isFetchingToken ? (
          <p className="text-center">Fetching Spotify token...</p>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : searchQuery ? (
          <>
            <h1 className="text-center mb-4">Search Results</h1>
            <div className="row">
              {tracks.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className="col-sm-6 col-md-4 col-lg-3 mb-4"
                  onClick={() => handleTrackClick(index)}
                >
                  <div className="card track-card bg-secondary text-light h-100">
                    <img
                      src={track.album.images[0]?.url || 'placeholder.jpg'}
                      alt={track.name}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{track.name}</h5>
                      <p className="card-text text-truncate">
                        {track.artists.map((artist) => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center mb-4">Recommended Music</h1>
            <div className="row">
              {recommendations.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="col-sm-6 col-md-4 col-lg-3 mb-4"
                >
                  <div className="card track-card bg-secondary text-light h-100">
                    <img
                      src={item.images[0]?.url || 'placeholder.jpg'}
                      alt={item.name}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{item.name}</h5>
                      <p className="card-text text-truncate">
                        {item.artists.map((artist) => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Scroll to Search Button */}
      {showScrollToSearch && (
        <button
          onClick={scrollToSearchBar}
          className="btn btn-primary position-fixed bottom-0 end-0 m-3"
        >
          Scroll to Search
        </button>
      )}

      {/* Fixed Bottom Player */}
      <Player
        currentTrack={currentTrack}
        onNext={handleNextTrack}
        onPrevious={handlePreviousTrack}
        onSearchClick={handleSearchClick}
      />
    </div>
  );
}

export default Home;
