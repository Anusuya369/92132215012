import React, { useState } from 'react';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) return alert("Please enter a URL");

    const res = await fetch('http://localhost:5000/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl })
    });

    const data = await res.json();
    setShortUrl(data.shortUrl);
    setExpiry(new Date(data.expiry).toLocaleString());
  };

  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter full URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <div className="result">
          <p><strong>Short URL:</strong> <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          <p><strong>Expires at:</strong> {expiry}</p>
        </div>
      )}
    </div>
  );
}

export default App;

