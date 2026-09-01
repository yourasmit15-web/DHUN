import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SongList from './components/SongList';
import Player from './components/Player';
import Playlists from './components/Playlists';
import Search from './components/Search';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [playlists, setPlaylists] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const audioRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${API_URL}/songs`);
      const data = await response.json();
      setSongs(data.songs);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_URL}/playlists`);
      const data = await response.json();
      setPlaylists(data.playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const installApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🎵 DHUN</h1>
          <p className="tagline">Free Music - No Subscription</p>
        </div>
        <div className="header-actions">
          {installPrompt && (
            <button className="install-btn" onClick={installApp}>
              ⬇️ Install App
            </button>
          )}
          <button
            className="search-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            🔍 Search
          </button>
        </div>
      </header>

      {showSearch && (
        <Search onSearch={handleSearch} />
      )}

      <nav className="nav-tabs">
        <button 
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => { setActiveTab('home'); setShowSearch(false); }}
        >
          🏠 Home
        </button>
        <button 
          className={`nav-btn ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => { setActiveTab('playlists'); setShowSearch(false); }}
        >
          📋 Playlists
        </button>
      </nav>

      <main className="app-main">
        {showSearch && searchResults.length > 0 && (
          <div className="search-results">
            <h2>Search Results</h2>
            <SongList 
              songs={searchResults} 
              onSongClick={playSong}
              apiUrl={API_URL}
            />
          </div>
        )}

        {!showSearch && activeTab === 'home' && (
          <div className="home-tab">
            <h2>🎶 All Songs - FREE Access</h2>
            <SongList 
              songs={songs} 
              onSongClick={playSong}
              apiUrl={API_URL}
            />
          </div>
        )}

        {activeTab === 'playlists' && (
          <Playlists 
            playlists={playlists}
            songs={songs}
            onPlaylistUpdate={fetchPlaylists}
            onSongClick={playSong}
          />
        )}
      </main>

      {currentSong && (
        <Player 
          song={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          audioRef={audioRef}
          apiUrl={API_URL}
        />
      )}
    </div>
  );
}

export default App;
