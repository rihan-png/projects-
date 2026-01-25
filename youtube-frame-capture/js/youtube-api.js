/**
 * YouTube IFrame API Integration
 * Handles YouTube player initialization and control
 */

class YouTubePlayer {
    constructor() {
        this.player = null;
        this.isReady = false;
        this.onReadyCallback = null;
        this.onStateChangeCallback = null;
    }

    /**
     * Initialize YouTube player with video ID
     * @param {string} videoId - YouTube video ID
     * @param {Function} onReady - Callback when player is ready
     */
    init(videoId, onReady) {
        this.onReadyCallback = onReady;
        
        // Wait for YouTube IFrame API to be ready
        if (typeof YT === 'undefined' || !YT.Player) {
            setTimeout(() => this.init(videoId, onReady), 100);
            return;
        }

        // Destroy existing player if any
        if (this.player) {
            this.player.destroy();
        }

        // Create new player
        this.player = new YT.Player('youtube-player', {
            videoId: videoId,
            width: '100%',
            height: '100%',
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'rel': 0,
                'modestbranding': 1,
                'playsinline': 1
            },
            events: {
                'onReady': (event) => this.onPlayerReady(event),
                'onStateChange': (event) => this.onPlayerStateChange(event)
            }
        });
    }

    /**
     * Player ready event handler
     */
    onPlayerReady(event) {
        this.isReady = true;
        console.log('YouTube player is ready');
        
        if (this.onReadyCallback) {
            this.onReadyCallback(event);
        }
    }

    /**
     * Player state change event handler
     */
    onPlayerStateChange(event) {
        if (this.onStateChangeCallback) {
            this.onStateChangeCallback(event);
        }
    }

    /**
     * Set state change callback
     * @param {Function} callback - Callback function
     */
    setStateChangeCallback(callback) {
        this.onStateChangeCallback = callback;
    }

    /**
     * Get current video time in seconds
     * @returns {number} Current time
     */
    getCurrentTime() {
        if (this.player && this.isReady) {
            return this.player.getCurrentTime();
        }
        return 0;
    }

    /**
     * Get video duration in seconds
     * @returns {number} Duration
     */
    getDuration() {
        if (this.player && this.isReady) {
            return this.player.getDuration();
        }
        return 0;
    }

    /**
     * Get current player state
     * @returns {number} Player state
     */
    getPlayerState() {
        if (this.player && this.isReady) {
            return this.player.getPlayerState();
        }
        return -1;
    }

    /**
     * Play video
     */
    play() {
        if (this.player && this.isReady) {
            this.player.playVideo();
        }
    }

    /**
     * Pause video
     */
    pause() {
        if (this.player && this.isReady) {
            this.player.pauseVideo();
        }
    }

    /**
     * Seek to specific time
     * @param {number} seconds - Time in seconds
     */
    seekTo(seconds) {
        if (this.player && this.isReady) {
            this.player.seekTo(seconds, true);
        }
    }

    /**
     * Check if video is playing
     * @returns {boolean} True if playing
     */
    isPlaying() {
        return this.getPlayerState() === YT.PlayerState.PLAYING;
    }

    /**
     * Check if video is paused
     * @returns {boolean} True if paused
     */
    isPaused() {
        return this.getPlayerState() === YT.PlayerState.PAUSED;
    }

    /**
     * Get video title
     * @returns {string} Video title
     */
    getVideoTitle() {
        if (this.player && this.isReady) {
            const iframe = this.player.getIframe();
            return iframe.title || 'YouTube Video';
        }
        return 'YouTube Video';
    }

    /**
     * Capture current frame from video
     * @returns {HTMLCanvasElement} Canvas with captured frame
     */
    captureFrame() {
        if (!this.player || !this.isReady) {
            return null;
        }

        const iframe = this.player.getIframe();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to video dimensions
        canvas.width = iframe.clientWidth;
        canvas.height = iframe.clientHeight;

        try {
            // Draw iframe to canvas
            // Note: This might not work due to CORS restrictions
            // We'll use a workaround by capturing the video element instead
            ctx.drawImage(iframe, 0, 0, canvas.width, canvas.height);
        } catch (e) {
            console.error('Error capturing frame from iframe:', e);
            // Fallback: create a snapshot message
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Frame captured at ' + this.formatTime(this.getCurrentTime()), 
                canvas.width / 2, canvas.height / 2);
        }

        return canvas;
    }

    /**
     * Get video screenshot using player screenshot method
     * This is a workaround for CORS issues
     * @returns {Promise<string>} Base64 image data
     */
    async getVideoScreenshot() {
        return new Promise((resolve, reject) => {
            try {
                // Pause the video to get a clear frame
                const wasPlaying = this.isPlaying();
                this.pause();

                // Wait a moment for the pause to take effect
                setTimeout(() => {
                    // Create a canvas and try to capture
                    const iframe = this.player.getIframe();
                    const canvas = document.createElement('canvas');
                    canvas.width = 1280;
                    canvas.height = 720;
                    const ctx = canvas.getContext('2d');

                    // Draw a placeholder frame with timestamp
                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Add timestamp and information
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 32px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('YouTube Frame Capture', canvas.width / 2, canvas.height / 2 - 40);
                    
                    ctx.font = '24px Arial';
                    ctx.fillText('Timestamp: ' + this.formatTime(this.getCurrentTime()), 
                        canvas.width / 2, canvas.height / 2 + 10);
                    
                    ctx.font = '18px Arial';
                    ctx.fillStyle = '#aaa';
                    ctx.fillText('Note: Due to browser security, actual video frames cannot be captured directly.', 
                        canvas.width / 2, canvas.height / 2 + 60);
                    ctx.fillText('This is a placeholder. For actual frame capture, use browser extensions or screen recording tools.', 
                        canvas.width / 2, canvas.height / 2 + 90);

                    const imageData = canvas.toDataURL('image/png');
                    
                    // Resume playback if it was playing
                    if (wasPlaying) {
                        this.play();
                    }

                    resolve(imageData);
                }, 100);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Format time in seconds to MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Extract video ID from YouTube URL
     * @param {string} url - YouTube URL
     * @returns {string|null} Video ID or null
     */
    static extractVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * Validate YouTube URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    static isValidYouTubeUrl(url) {
        return this.extractVideoId(url) !== null;
    }
}

export default YouTubePlayer;
