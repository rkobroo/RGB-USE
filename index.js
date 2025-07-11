const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static('.'));

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`RKO Downloader server running on http://0.0.0.0:${PORT}`);
});


let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar
    e.preventDefault();
    deferredPrompt = e;
});

document.getElementById('downloadAppButton').addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    } else {
        alert('Install option is not available. Please open in Chrome or supported browser.');
    }
});
