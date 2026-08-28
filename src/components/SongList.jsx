import './SongList.css';

export default function SongList({ songs, onSongClick }) {
  return (
    <div className="song-list">
      {songs.map((song) => (
        <div key={song.id} className="song-card" onClick={() => onSongClick(song)}>
          <img src={song.cover} alt={song.title} className="song-cover" />
          <div className="song-info">
            <h3 className="song-title">{song.title}</h3>
            <p className="song-artist">{song.artist}</p>
            <p className="song-album">{song.album}</p>
            <p className="song-duration">⏱️ {song.duration}</p>
          </div>
          <button className="play-btn">▶ Play</button>
        </div>
      ))}
    </div>
  );
}
