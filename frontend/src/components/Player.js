import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaCheckCircle, FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Player.css';

function Player({ currentTrack, onNext, onPrevious, onSearchClick }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (currentTrack?.preview_url) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentTrack.preview_url);
      }
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      alert('No preview available for this track.');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="player bg-secondary text-light d-flex flex-wrap align-items-center justify-content-between px-3 py-2 fixed-bottom">
      {/* Track Details */}
      <div className="d-flex align-items-center col-12 col-md-4 mb-2 mb-md-0">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
              className="img-fluid me-3"
              style={{ width: '60px', height: '60px', borderRadius: '5px' }}
            />
            <div className="text-truncate">
              <h5 className="mb-1 text-truncate">{currentTrack.name}</h5>
              <div className="marquee-container">
                <div className="marquee">
                  {currentTrack.artists.map((artist) => artist.name).join(', ')} - {currentTrack.album.name}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>No track selected</p>
        )}
      </div>

      {/* Controls */}
      <div className="d-flex align-items-center justify-content-center col-12 col-md-4 mb-2 mb-md-0">
        <button className="btn btn-outline-light me-2" onClick={onPrevious}>
          <FaStepBackward />
        </button>
        <button
          className={`btn btn-primary me-2 play-pause-btn ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayPause}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="btn btn-outline-light me-2" onClick={onNext}>
          <FaStepForward />
        </button>
      </div>

      {/* Volume & Search */}
      <div className="d-flex align-items-center col-12 col-md-4 justify-content-end">
        <button className="btn btn-outline-light me-2" onClick={onSearchClick}>
          <FaSearch />
        </button>
        <FaVolumeUp className="me-2" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="form-range"
          style={{ width: '100px' }}
        />
      </div>
    </div>
  );
}

export default Player;
