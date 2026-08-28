import './Player.css';

export default function Player({ song, isPlaying, onTogglePlay, audioRef }) {
  return (
    <div className="player">
      <div className="player-content">
        <img src={song.cover} alt={song.title} className="player-cover" />
        <div className="player-info">
          <h4>{song.title}</h4>
          <p>{song.artist}</p>
        </div>
        <button className="player-play-btn" onClick={onTogglePlay}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>
      <audio 
        ref={audioRef}
        src={song.url}
        onEnded={() => onTogglePlay()}
        autoPlay={isPlaying}
      />
    </div>
  );
}
