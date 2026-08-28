import { useState } from 'react';
import './Playlists.css';

export default function Playlists({ playlists, songs, onPlaylistUpdate, onSongClick }) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const response = await fetch(`${API_URL}/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName, description: 'My playlist' })
      });
      const data = await response.json();
      if (data.success) {
        setNewPlaylistName('');
        setShowCreateForm(false);
        onPlaylistUpdate();
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await fetch(`${API_URL}/playlists/${playlistId}`, {
        method: 'DELETE'
      });
      onPlaylistUpdate();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  return (
    <div className="playlists-container">
      <div className="playlists-header">
        <h2>📋 My Playlists - UNLIMITED & FREE</h2>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          + Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <input
            type="text"
            placeholder="Playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button onClick={createPlaylist}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </div>
      )}

      <div className="playlists-list">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            songs={songs}
            onDelete={() => deletePlaylist(playlist.id)}
            onSongClick={onSongClick}
          />
        ))}
      </div>
    </div>
  );
}

function PlaylistCard({ playlist, songs, onDelete, onSongClick }) {
  const [expanded, setExpanded] = useState(false);
  const playlistSongs = playlist.songs.map(songId => songs.find(s => s.id === songId)).filter(Boolean);

  return (
    <div className="playlist-card">
      <div className="playlist-header">
        <div>
          <h3>{playlist.name}</h3>
          <p>{playlistSongs.length} songs</p>
        </div>
        <div className="playlist-actions">
          <button 
            className="expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▼' : '▶'}
          </button>
          <button 
            className="delete-btn"
            onClick={onDelete}
          >
            🗑️
          </button>
        </div>
      </div>

      {expanded && (
        <div className="playlist-songs">
          {playlistSongs.length === 0 ? (
            <p className="empty-message">No songs yet</p>
          ) : (
            playlistSongs.map((song) => (
              <div key={song.id} className="playlist-song" onClick={() => onSongClick(song)}>
                <span>{song.title} - {song.artist}</span>
                <span className="duration">{song.duration}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
