const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for dark theme
app.get('/dark', (req, res) => {
    res.sendFile(path.join(__dirname, 'dark.html'));
});

// Route for share handler
app.get('/share-handler', (req, res) => {
    res.sendFile(path.join(__dirname, 'share-handler.html'));
});

// Route for VKrDownloader paths
app.get('/VKrDownloader', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/VKrDownloader/dark.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dark.html'));
});

// Ensure service worker and manifest are served correctly
app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sw.js'));
});

app.get('/manifest.webmanifest', (req, res) => {
    res.sendFile(path.join(__dirname, 'manifest.webmanifest'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`RKO Downloader server running on http://0.0.0.0:${PORT}`);
});
