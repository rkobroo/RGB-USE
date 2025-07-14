/*******************************
 * Popup Modal Functionality
 *******************************/

// [Previous popup modal code remains unchanged]
window.addEventListener('load', function() {
    setTimeout(showPopup, 500); // Small delay for smooth loading
});

function showPopup() {
    const modal = document.getElementById('popupModal');
    const popupInput = document.getElementById('popupInput');

    modal.style.display = 'block';

    // Auto-close after 5 seconds
    setTimeout(() => {
        closePopup();
    }, 5000);

    // Try to read clipboard automatically
    readClipboard();
}

function closePopup() {
    const modal = document.getElementById('popupModal');
    modal.classList.add('closing');

    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
    }, 300);
}

// Clipboard functionality
async function readClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        const popupInput = document.getElementById('popupInput');

        if (text && (text.includes('http://') || text.includes('https://') || text.includes('www.'))) {
            popupInput.value = text;
            popupInput.style.border = '2px solid #4CAF50';
            popupInput.style.background = 'rgba(76, 175, 80, 0.1)';
        }
    } catch (err) {
        console.log('Clipboard access not available or denied');
    }
}

// Event listeners for popup
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closePopup');
    const pasteBtn = document.getElementById('pasteBtn');
    const searchBtn = document.getElementById('searchBtn');
    const popupInput = document.getElementById('popupInput');
    const modal = document.getElementById('popupModal');

    closeBtn.addEventListener('click', closePopup);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePopup();
        }
    });

    pasteBtn.addEventListener('click', async function() {
        try {
            const text = await navigator.clipboard.readText();
            popupInput.value = text;
            popupInput.focus();
        } catch (err) {
            popupInput.focus();
            alert('Please paste the URL manually using Ctrl+V');
        }
    });

    searchBtn.addEventListener('click', function() {
        const url = popupInput.value.trim();
        if (url) {
            document.getElementById('inputUrl').value = url;
            closePopup();
            setTimeout(() => {
                document.getElementById('downloadBtn').click();
            }, 500);
        } else {
            alert('Please enter a URL first');
        }
    });

    popupInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
});

/*******************************
 * Configuration for Colors
 *******************************/

const formatColors = {
    greenFormats: ["17", "18", "22"],
    blueFormats: ["139", "140", "141", "249", "250", "251", "599", "600"],
    defaultColor: "#9e0cf2"
};

/*******************************
 * Utility Functions
 *******************************/

// [Previous utility functions (getBackgroundColor, debounce, getYouTubeVideoIds, sanitizeContent, updateElement, getParameterByName) remain unchanged]

/*******************************
 * AJAX Request with Retry Logic
 *******************************/

// [Previous makeRequest and getErrorMessage functions remain unchanged]

/*******************************
 * Event Handlers
 *******************************/

// [Previous download button event listener remains unchanged]

/*******************************
 * Response Handlers
 *******************************/

function handleSuccessResponse(data, inputUrl) {
    const container = document.getElementById("container");
    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.opacity = "0";
        setTimeout(() => {
            loading.style.display = "none";
        }, 300);
    }

    if (container) {
        container.style.display = "block";
        setTimeout(() => {
            container.classList.add("show");
        }, 10);
    }

    if (data.data) {
        const videoData = data.data;

        const thumbnailUrl = videoData.thumbnail;
        const downloadUrls = videoData.downloads.map(download => download.url);
        const videoSource = videoData.source;
        const videoId = getYouTubeVideoIds(videoSource);
        const thumbnailUrlFinal = videoId 
            ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
            : videoData.thumbnail;

        const videoHtml = `
            <video style='background: black url(${thumbnailUrlFinal}) center center/cover no-repeat; width:100%; height:500px; border-radius:20px;' 
                   poster='${thumbnailUrlFinal}' controls playsinline>
                <source src='${videoData.downloads[5]?.url || ''}' type='video/mp4'>
                ${Array.isArray(downloadUrls) ? downloadUrls.map(url => `<source src='${url}' type='video/mp4'>`).join('') : ''}
                <source src='https://vkrdownloader.xyz/server/dl.php?vkr=${encodeURIComponent(inputUrl)}' type='video/mp4'>
            </video>`;
        const YTvideoHtml = `
            <video style='background: black url(${thumbnailUrlFinal}) center center/cover no-repeat; width:100%; height:500px; border-radius:20px;' 
                   poster='${thumbnailUrlFinal}' controls playsinline>
                <source src='https://vkrdownloader.xyz/server/redirect.php?vkr=https://youtu.be/${videoId}' type='video/mp4'>
                <source src='https://vkrdownloader.xyz/server/dl.php?vkr=${inputUrl}' type='video/mp4'>
                ${downloadUrls.map(url => `<source src='${url}' type='video/mp4'>`).join('')}
            </video>`;
        const titleHtml = videoData.title ? `<h3>${sanitizeContent(videoData.title)}</h3>` : "";
        const descriptionHtml = videoData.description ? `<h4><details><summary>View Description</summary>${sanitizeContent(videoData.description)}</details></h4>` : "";
        const durationHtml = videoData.size ? `<h5>${sanitizeContent(videoData.size)}</h5>` : "";

        if (videoId) {
            updateElement("thumb", YTvideoHtml);
        } else {
            updateElement("thumb", videoHtml);
        }
        updateElement("title", titleHtml);
        updateElement("description", descriptionHtml);
        updateElement("duration", durationHtml);

        // Pass description to generateDownloadButtons
        generateDownloadButtons(data, inputUrl, videoData.description);
    } else {
        displayError("Issue: Unable to retrieve the download link. Please check the URL and contact us on Social Media @himalpaudel112.");
        document.getElementById("loading").style.display = "none";
    }
}

async function forceDownload(url, filename) {
    console.log('Force download called:', url, filename);

    showDownloadFeedback('Starting download...');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            window.URL.revokeObjectURL(downloadUrl);
        }, 1000);

        showDownloadFeedback('Download completed successfully! 🎉');
    } catch (error) {
        console.error('Download error:', error);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        link.setAttribute('target', '_self');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showDownloadFeedback('Download initiated via fallback method');
    }
}

function showDownloadFeedback(message) {
    let feedback = document.getElementById('downloadFeedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'downloadFeedback';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            border: 2px solid #ff0000;
            animation: rgbBorder 2s linear infinite;
            max-width: 300px;
            word-wrap: break-word;
        `;
        document.body.appendChild(feedback);
    }

    feedback.textContent = message;
    feedback.style.opacity = '1';
    feedback.style.display = 'block';
    feedback.style.transform = 'translateX(0)';

    if (message.includes('success') || message.includes('completed') || message.includes('🎉')) {
        feedback.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (message.includes('error') || message.includes('failed')) {
        feedback.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    } else {
        feedback.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }

    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 300);
    }, 4000);
}

/**
 * Generate download buttons with dynamic colors and labels.
 * @param {Object} videoData - The video data from the server.
 * @param {string} inputUrl - The original input URL.
 * @param {string} description - The video description for filename.
 */
function generateDownloadButtons(videoData, inputUrl, description) {
    const downloadContainer = document.getElementById("download");
    downloadContainer.innerHTML = "";

    if (videoData.data) {
        const downloads = videoData.data.downloads;
        const videoSource = videoData.data.source;

        const videoId = getYouTubeVideoIds(videoSource);
        if (videoId) {
            const qualities = [
                { quality: "mp3", label: "🎵 Audio MP3", color: "#ff6b6b" },
                { quality: "360", label: "📱 360p Video", color: "#4ecdc4" },
                { quality: "720", label: "💻 720p HD", color: "#45b7d1" },
                { quality: "1080", label: "📺 1080p Full HD", color: "#96ceb4" }
            ];

            qualities.forEach(item => {
                const downloadUrl = `https://vkrdownloader.xyz/server/dl.php?q=${encodeURIComponent(item.quality)}&vkr=${encodeURIComponent(videoSource)}`;
                // Sanitize description and append quality/timestamp
                const sanitizedDescription = (description || 'video').replace(/[<>:"/\\|?*]+/g, '').substring(0, 50).trim() || 'video';
                const timestamp = Date.now();
                const filename = `${sanitizedDescription}_${item.quality}_${timestamp}.${item.quality === 'mp3' ? 'mp3' : 'mp4'}`;

                const button = document.createElement('button');
                button.className = 'dlbtns';
                button.style.cssText = `background: ${item.color}; width: 100%; padding: 12px; border-radius: 8px; border: none; color: white; font-weight: bold; cursor: pointer; margin: 5px 0;`;
                button.innerHTML = item.label;

                button.addEventListener('mouseover', function() {
                    this.style.opacity = '0.8';
                });

                button.addEventListener('mouseout', function() {
                    this.style.opacity = '1';
                });

                button.addEventListener('click', async function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    this.disabled = true;
                    this.style.opacity = '0.6';
                    this.innerHTML = '⏳ Downloading...';

                    try {
                        showDownloadFeedback('Preparing download...');

                        const response = await fetch(downloadUrl);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const blob = await response.blob();
                        const objectUrl = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = objectUrl;
                        link.download = filename;
                        link.style.display = 'none';

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        setTimeout(() => {
                            window.URL.revokeObjectURL(objectUrl);
                        }, 1000);

                        showDownloadFeedback(`${item.label} downloaded successfully! 🎉`);
                        this.innerHTML = '✅ Downloaded';
                        this.style.background = '#4CAF50';
                    } catch (error) {
                        console.error('Download error:', error);

                        const link = document.createElement("a");
                        link.href = downloadUrl;
                        link.download = filename;
                        link.style.display = 'none';
                        link.setAttribute('target', '_self');

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        showDownloadFeedback(`${item.label} download started via fallback`);
                        this.innerHTML = '📥 Downloaded';
                    } finally {
                        setTimeout(() => {
                            this.disabled = false;
                            this.style.opacity = '1';
                            this.innerHTML = item.label;
                            this.style.background = item.color;
                        }, 3000);
                    }
                });

                downloadContainer.appendChild(button);
            });
        }

        downloads.forEach(download => {
            if (download && download.url) {
                const downloadUrl = download.url;
                const itag = getParameterByName("itag", downloadUrl);
                const bgColor = getBackgroundColor(itag);
                const videoExt = download.format_id;
                const videoSize = download.size;
                // Sanitize description and append format details
                const sanitizedDescription = (description || 'video').replace(/[<>:"/\\|?*]+/g, '').substring(0, 50).trim() || 'video';
                const timestamp = Date.now();
                const filename = `${sanitizedDescription}_${videoExt}_${videoSize}_${timestamp}.mp4`;

                downloadContainer.innerHTML += `
                    <button class='dlbtns' style='background:${bgColor}' 
                            onclick='forceDownload("${downloadUrl}", "${filename}")'>
                        ${sanitizeContent(videoExt)} - ${sanitizeContent(videoSize)}
                    </button>`;
            }
        });
    } else {
        displayError("No download links found or data structure is incorrect.");
        document.getElementById("loading").style.display = "none";
    }

    if (downloadContainer.innerHTML.trim() === "") {
        displayError("Server Down due to Too Many Requests. Please contact us on Social Media @himalpaudel112.");
        document.getElementById("container").style.display = "none";
        // window.location.href = `https://vkrdownloader.xyz/download.php?vkr=${encodeURIComponent(inputUrl)}`;
    }
}
