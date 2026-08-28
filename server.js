import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock Music Database - NO SUBSCRIPTION REQUIRED
const mockSongs = [
  {
    id: 1,
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    album: 'Nocturnal',
    duration: '3:45',
    genre: 'Electronic',
    cover: 'https://via.placeholder.com/200?text=Midnight+Dreams',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Summer Vibes',
    artist: 'Sunny Beats',
    album: 'Tropica',
    duration: '4:12',
    genre: 'Pop',
    cover: 'https://via.placeholder.com/200?text=Summer+Vibes',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Jazz Evening',
    artist: 'Blue Notes',
    album: 'Smooth Sessions',
    duration: '5:20',
    genre: 'Jazz',
    cover: 'https://via.placeholder.com/200?text=Jazz+Evening',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 4,
    title: 'Electric Soul',
    artist: 'Neon Pulse',
    album: 'Digital Heart',
    duration: '3:55',
    genre: 'Electronic',
    cover: 'https://via.placeholder.com/200?text=Electric+Soul',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 5,
    title: 'Nature Calls',
    artist: 'Forest Whispers',
    album: 'Earth',
    duration: '4:30',
    genre: 'Ambient',
    cover: 'https://via.placeholder.com/200?text=Nature+Calls',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

// Mock Playlists Database
let playlists = [
  {
    id: 1,
    name: 'Workout Mix',
    description: 'High energy tracks',
    songs: [1, 4],
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Chill Vibes',
    description: 'Relaxation time',
    songs: [3, 5],
    createdAt: new Date()
  }
];

let playlistIdCounter = 3;

// Routes

// Get all songs - NO SUBSCRIPTION REQUIRED
app.get('/api/songs', (req, res) => {
  res.json({
    success: true,
    message: '🎵 All songs available - NO SUBSCRIPTION REQUIRED',
    songs: mockSongs,
    totalSongs: mockSongs.length
  });
});

// Get song by ID
app.get('/api/songs/:id', (req, res) => {
  const song = mockSongs.find(s => s.id === parseInt(req.params.id));
  if (!song) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }
  res.json({ success: true, song });
});

// Search songs
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  if (!query) {
    return res.json({ success: false, message: 'Search query required' });
  }
  
  const results = mockSongs.filter(song =>
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query)
  );
  
  res.json({
    success: true,
    message: `Found ${results.length} song(s)`,
    results
  });
});

// Get all playlists - FREE
app.get('/api/playlists', (req, res) => {
  res.json({
    success: true,
    message: '📋 All playlists available - FREE',
    playlists: playlists
  });
});

// Create new playlist - FREE
app.post('/api/playlists', (req, res) => {
  const { name, description, songs } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'Playlist name required' });
  }
  
  const newPlaylist = {
    id: playlistIdCounter++,
    name,
    description: description || '',
    songs: songs || [],
    createdAt: new Date()
  };
  
  playlists.push(newPlaylist);
  res.status(201).json({
    success: true,
    message: '✅ Playlist created - NO SUBSCRIPTION NEEDED',
    playlist: newPlaylist
  });
});

// Add song to playlist - FREE
app.post('/api/playlists/:id/songs', (req, res) => {
  const playlistId = parseInt(req.params.id);
  const { songId } = req.body;
  
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }
  
  if (!mockSongs.find(s => s.id === songId)) {
    return res.status(404).json({ success: false, message: 'Song not found' });
  }
  
  if (playlist.songs.includes(songId)) {
    return res.status(400).json({ success: false, message: 'Song already in playlist' });
  }
  
  playlist.songs.push(songId);
  res.json({
    success: true,
    message: '✅ Song added - UNLIMITED ADDITIONS',
    playlist
  });
});

// Remove song from playlist - FREE
app.delete('/api/playlists/:id/songs/:songId', (req, res) => {
  const playlistId = parseInt(req.params.id);
  const songId = parseInt(req.params.songId);
  
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }
  
  playlist.songs = playlist.songs.filter(s => s !== songId);
  res.json({
    success: true,
    message: '✅ Song removed',
    playlist
  });
});

// Delete playlist - FREE
app.delete('/api/playlists/:id', (req, res) => {
  const playlistId = parseInt(req.params.id);
  playlists = playlists.filter(p => p.id !== playlistId);
  
  res.json({
    success: true,
    message: '✅ Playlist deleted - FULL ACCESS'
  });
});

// Get playlist details with full song data
app.get('/api/playlists/:id', (req, res) => {
  const playlist = playlists.find(p => p.id === parseInt(req.params.id));
  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found' });
  }
  
  const songs = playlist.songs.map(songId => mockSongs.find(s => s.id === songId));
  
  res.json({
    success: true,
    playlist: {
      ...playlist,
      songs
    }
  });
});

// Features status - ALL FREE
app.get('/api/features', (req, res) => {
  res.json({
    success: true,
    message: 'DHUN - NO SUBSCRIPTION REQUIRED',
    features: {
      unlimitedSongStreaming: true,
      unlimitedPlaylists: true,
      offlineDownload: false,
      adFree: true,
      highQualityAudio: true,
      customization: true,
      familyPlan: false,
      pricing: 'COMPLETELY FREE'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🎵 DHUN Server is running - NO SUBSCRIPTION NEEDED',
    status: 'online'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 DHUN Server running on port ${PORT}`);
  console.log('✨ NO SUBSCRIPTION REQUIRED - COMPLETELY FREE');
});
