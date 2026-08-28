import './Search.css';

export default function Search({ onSearch }) {
  const handleSearch = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search songs, artists, albums..."
        className="search-input"
        onChange={handleSearch}
        autoFocus
      />
    </div>
  );
}
