const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const baseUrl = "http://localhost:5000";

const urlMap = new Map();

function generateShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

app.post('/api/shorten', (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) return res.status(400).json({ error: "URL is required" });

  const shortCode = generateShortCode();
  const shortUrl = `${baseUrl}/${shortCode}`;
  const expiry = new Date(Date.now() + 30 * 60 * 1000); 

  urlMap.set(shortCode, {
    originalUrl,
    expiry
  });

  console.log(JSON.stringify({
    logID: "d4132c5a-3ede-4a55-a8d2-9c0f2d9bd19e",
    shortCode,
    originalUrl,
    expiry
  }));

  res.json({ shortUrl, expiry });
});

app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const entry = urlMap.get(shortCode);

  if (!entry) return res.status(404).send("Short URL not found");
  if (new Date() > entry.expiry) return res.status(410).send("Short URL expired");

  res.redirect(entry.originalUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
