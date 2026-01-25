/**
 * Main Application Module
 * Coordinates all components and handles user interactions
 */

import YouTubePlayer from './youtube-api.js';
import FrameCapture from './frame-capture.js';
import CVDetection from './cv-detection.js';
import ExportHandler from './export.js';

class App {
    constructor() {
        this.youtubePlayer = new YouTubePlayer();
        this.frameCapture = null;
        this.cvDetection = new CVDetection();
        this.exportHandler = null;
        
        this.captureMode = 'manual';
        this.autoCapture = {
            intervalId: null,
            settings: {
                sceneThreshold: 30,
                boardFillThreshold: 75,
                captureInterval: 5,
                detectSceneChange: true,
                detectBoardFill: true,
                detectClearScreen: true
            }
        };

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing YouTube Frame Capture App...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }

    /**
     * Setup UI event listeners
     */
    setupUI() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Video URL input
        const videoUrlInput = document.getElementById('video-url-input');
        const loadVideoBtn = document.getElementById('load-video-btn');
        
        loadVideoBtn?.addEventListener('click', () => {
            const url = videoUrlInput?.value.trim();
            if (url) {
                this.loadVideo(url);
            }
        });

        videoUrlInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const url = videoUrlInput.value.trim();
                if (url) {
                    this.loadVideo(url);
                }
            }
        });

        // Capture mode selection
        const modeRadios = document.querySelectorAll('input[name="capture-mode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.switchCaptureMode(e.target.value));
        });

        // Manual capture button
        const manualCaptureBtn = document.getElementById('manual-capture-btn');
        manualCaptureBtn?.addEventListener('click', () => this.captureFrame());

        // Keyboard shortcut for capture (C key)
        document.addEventListener('keypress', (e) => {
            if (e.key === 'c' || e.key === 'C') {
                if (!e.target.matches('input, textarea')) {
                    this.captureFrame();
                }
            }
        });

        // Auto settings sliders
        this.setupSliders();

        // Gallery actions
        const clearAllBtn = document.getElementById('clear-all-btn');
        clearAllBtn?.addEventListener('click', () => this.clearAllFrames());

        const downloadAllBtn = document.getElementById('download-all-btn');
        downloadAllBtn?.addEventListener('click', () => this.downloadAllFrames());

        // Lightbox
        this.setupLightbox();

        // Load saved theme
        this.loadTheme();

        console.log('UI setup complete');
    }

    /**
     * Setup slider event listeners
     */
    setupSliders() {
        const sceneThreshold = document.getElementById('scene-threshold');
        const sceneThresholdValue = document.getElementById('scene-threshold-value');
        sceneThreshold?.addEventListener('input', (e) => {
            const value = e.target.value;
            sceneThresholdValue.textContent = `${value}%`;
            this.autoCapture.settings.sceneThreshold = parseInt(value);
        });

        const boardFillThreshold = document.getElementById('board-fill-threshold');
        const boardFillValue = document.getElementById('board-fill-value');
        boardFillThreshold?.addEventListener('input', (e) => {
            const value = e.target.value;
            boardFillValue.textContent = `${value}%`;
            this.autoCapture.settings.boardFillThreshold = parseInt(value);
        });

        const captureInterval = document.getElementById('capture-interval');
        const intervalValue = document.getElementById('interval-value');
        captureInterval?.addEventListener('input', (e) => {
            const value = e.target.value;
            intervalValue.textContent = `${value}s`;
            this.autoCapture.settings.captureInterval = parseInt(value);
        });

        // Checkboxes
        const detectSceneChange = document.getElementById('detect-scene-change');
        detectSceneChange?.addEventListener('change', (e) => {
            this.autoCapture.settings.detectSceneChange = e.target.checked;
        });

        const detectBoardFill = document.getElementById('detect-board-fill');
        detectBoardFill?.addEventListener('change', (e) => {
            this.autoCapture.settings.detectBoardFill = e.target.checked;
        });

        const detectClearScreen = document.getElementById('detect-clear-screen');
        detectClearScreen?.addEventListener('change', (e) => {
            this.autoCapture.settings.detectClearScreen = e.target.checked;
        });
    }

    /**
     * Setup lightbox functionality
     */
    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.querySelector('.lightbox-close');
        
        lightboxClose?.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        const lightboxDownload = document.getElementById('lightbox-download');
        const lightboxDelete = document.getElementById('lightbox-delete');

        lightboxDownload?.addEventListener('click', () => {
            const frameId = parseInt(lightbox.dataset.frameId);
            if (frameId) {
                this.exportHandler?.downloadFrame(frameId);
            }
        });

        lightboxDelete?.addEventListener('click', () => {
            const frameId = parseInt(lightbox.dataset.frameId);
            if (frameId) {
                this.deleteFrame(frameId);
                lightbox.style.display = 'none';
            }
        });
    }

    /**
     * Load a YouTube video
     * @param {string} url - YouTube video URL
     */
    loadVideo(url) {
        if (!YouTubePlayer.isValidYouTubeUrl(url)) {
            this.showNotification('Invalid YouTube URL', 'error');
            return;
        }

        const videoId = YouTubePlayer.extractVideoId(url);
        if (!videoId) {
            this.showNotification('Could not extract video ID', 'error');
            return;
        }

        this.showLoading('Loading video...');

        // Initialize player
        this.youtubePlayer.init(videoId, () => {
            // Hide placeholder, show player
            const placeholder = document.getElementById('video-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            const videoInfo = document.getElementById('video-info');
            if (videoInfo) {
                videoInfo.style.display = 'block';
            }

            // Initialize frame capture
            this.frameCapture = new FrameCapture(this.youtubePlayer);
            this.exportHandler = new ExportHandler(this.frameCapture);

            // Set up frame capture callback
            this.frameCapture.setOnFrameCaptured((frame) => {
                this.addFrameToGallery(frame);
                this.updateGalleryControls();
            });

            // Set up time update
            this.startTimeUpdate();

            this.hideLoading();
            this.showNotification('Video loaded successfully!', 'success');
        });
    }

    /**
     * Start updating video time display
     */
    startTimeUpdate() {
        setInterval(() => {
            if (this.youtubePlayer.isReady) {
                const currentTime = this.youtubePlayer.getCurrentTime();
                const duration = this.youtubePlayer.getDuration();

                const currentTimeEl = document.getElementById('current-time');
                const durationEl = document.getElementById('duration');

                if (currentTimeEl) {
                    currentTimeEl.textContent = this.youtubePlayer.formatTime(currentTime);
                }
                if (durationEl) {
                    durationEl.textContent = this.youtubePlayer.formatTime(duration);
                }
            }
        }, 1000);
    }

    /**
     * Switch capture mode
     * @param {string} mode - 'manual' or 'auto'
     */
    switchCaptureMode(mode) {
        this.captureMode = mode;
        const autoSettings = document.getElementById('auto-settings');

        if (mode === 'auto') {
            autoSettings.style.display = 'block';
            this.startAutoCapture();
            this.updateStatus('Auto capture active', 'active');
        } else {
            autoSettings.style.display = 'none';
            this.stopAutoCapture();
            this.updateStatus('Ready', 'ready');
        }
    }

    /**
     * Start automatic capture
     */
    startAutoCapture() {
        if (this.autoCapture.intervalId) {
            clearInterval(this.autoCapture.intervalId);
        }

        this.autoCapture.intervalId = setInterval(async () => {
            if (!this.youtubePlayer.isPlaying()) {
                return;
            }

            try {
                const currentFrameData = await this.youtubePlayer.getVideoScreenshot();
                let shouldCapture = false;
                let captureReason = '';

                // Scene change detection
                if (this.autoCapture.settings.detectSceneChange) {
                    const sceneResult = await this.cvDetection.detectSceneChange(
                        currentFrameData,
                        this.autoCapture.settings.sceneThreshold
                    );
                    if (sceneResult.detected) {
                        shouldCapture = true;
                        captureReason = 'Scene change';
                    }
                }

                // Board fill detection
                if (this.autoCapture.settings.detectBoardFill && !shouldCapture) {
                    const fillResult = await this.cvDetection.detectBoardFill(
                        currentFrameData,
                        this.autoCapture.settings.boardFillThreshold
                    );
                    if (fillResult.detected) {
                        shouldCapture = true;
                        captureReason = 'Board filled';
                    }
                }

                // Clear screen detection
                if (this.autoCapture.settings.detectClearScreen && !shouldCapture) {
                    const clearResult = await this.cvDetection.detectClearScreen(currentFrameData);
                    if (clearResult.detected) {
                        shouldCapture = true;
                        captureReason = 'Screen cleared';
                    }
                }

                if (shouldCapture) {
                    await this.captureFrame();
                    this.showNotification(`Auto captured: ${captureReason}`, 'success');
                }
            } catch (error) {
                console.error('Auto capture error:', error);
            }
        }, this.autoCapture.settings.captureInterval * 1000);
    }

    /**
     * Stop automatic capture
     */
    stopAutoCapture() {
        if (this.autoCapture.intervalId) {
            clearInterval(this.autoCapture.intervalId);
            this.autoCapture.intervalId = null;
        }
    }

    /**
     * Capture current frame
     */
    async captureFrame() {
        if (!this.frameCapture) {
            this.showNotification('Please load a video first', 'error');
            return;
        }

        if (!this.youtubePlayer.isReady) {
            this.showNotification('Video player not ready', 'error');
            return;
        }

        try {
            this.updateStatus('Capturing...', 'capturing');
            await this.frameCapture.captureCurrentFrame();
            this.updateStatus(this.captureMode === 'auto' ? 'Auto capture active' : 'Ready', 
                this.captureMode === 'auto' ? 'active' : 'ready');
        } catch (error) {
            console.error('Capture error:', error);
            this.showNotification('Error capturing frame', 'error');
            this.updateStatus('Error', 'ready');
        }
    }

    /**
     * Add frame to gallery
     * @param {Object} frame - Frame data
     */
    addFrameToGallery(frame) {
        const gallery = document.getElementById('frames-gallery');
        if (!gallery) return;

        // Remove empty gallery message
        const emptyGallery = gallery.querySelector('.empty-gallery');
        if (emptyGallery) {
            emptyGallery.remove();
        }

        // Create frame card
        const frameCard = document.createElement('div');
        frameCard.className = 'frame-card';
        frameCard.dataset.frameId = frame.id;

        frameCard.innerHTML = `
            <img src="${frame.imageData}" alt="Frame at ${frame.timestamp}">
            <div class="frame-info">
                <span class="frame-timestamp">${frame.timestamp}</span>
                <div class="frame-actions">
                    <button class="frame-btn view-btn">View</button>
                    <button class="frame-btn download-btn">Download</button>
                    <button class="frame-btn delete">Delete</button>
                </div>
            </div>
        `;

        // Add event listeners
        const viewBtn = frameCard.querySelector('.view-btn');
        viewBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.viewFrame(frame.id);
        });

        const downloadBtn = frameCard.querySelector('.download-btn');
        downloadBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.exportHandler?.downloadFrame(frame.id);
        });

        const deleteBtn = frameCard.querySelector('.delete');
        deleteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteFrame(frame.id);
        });

        frameCard.addEventListener('click', () => this.viewFrame(frame.id));

        // Add to gallery (prepend for newest first)
        gallery.insertBefore(frameCard, gallery.firstChild);

        // Update frame count
        const frameCount = document.getElementById('frame-count');
        if (frameCount) {
            frameCount.textContent = this.frameCapture.getFrameCount();
        }
    }

    /**
     * View frame in lightbox
     * @param {number} frameId - Frame ID
     */
    viewFrame(frameId) {
        const frame = this.frameCapture?.getFrameById(frameId);
        if (!frame) return;

        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTimestamp = document.getElementById('lightbox-timestamp');

        if (lightbox && lightboxImage && lightboxTimestamp) {
            lightbox.dataset.frameId = frameId;
            lightboxImage.src = frame.imageData;
            lightboxTimestamp.textContent = `Captured at ${frame.timestamp}`;
            lightbox.style.display = 'flex';
        }
    }

    /**
     * Delete a frame
     * @param {number} frameId - Frame ID
     */
    deleteFrame(frameId) {
        if (!this.frameCapture) return;

        const deleted = this.frameCapture.deleteFrame(frameId);
        if (deleted) {
            // Remove from gallery
            const frameCard = document.querySelector(`[data-frame-id="${frameId}"]`);
            if (frameCard) {
                frameCard.remove();
            }

            // Update count
            const frameCount = document.getElementById('frame-count');
            if (frameCount) {
                frameCount.textContent = this.frameCapture.getFrameCount();
            }

            // Show empty message if no frames
            const gallery = document.getElementById('frames-gallery');
            if (gallery && this.frameCapture.getFrameCount() === 0) {
                gallery.innerHTML = `
                    <div class="empty-gallery">
                        <span class="empty-icon">🖼️</span>
                        <p>No frames captured yet</p>
                        <p class="hint">Press 'C' or click Capture Frame</p>
                    </div>
                `;
            }

            this.updateGalleryControls();
            this.showNotification('Frame deleted', 'success');
        }
    }

    /**
     * Clear all frames
     */
    clearAllFrames() {
        if (!this.frameCapture) return;

        if (confirm('Are you sure you want to delete all frames?')) {
            this.frameCapture.clearAllFrames();

            const gallery = document.getElementById('frames-gallery');
            if (gallery) {
                gallery.innerHTML = `
                    <div class="empty-gallery">
                        <span class="empty-icon">🖼️</span>
                        <p>No frames captured yet</p>
                        <p class="hint">Press 'C' or click Capture Frame</p>
                    </div>
                `;
            }

            const frameCount = document.getElementById('frame-count');
            if (frameCount) {
                frameCount.textContent = '0';
            }

            this.updateGalleryControls();
            this.showNotification('All frames cleared', 'success');
        }
    }

    /**
     * Download all frames as ZIP
     */
    async downloadAllFrames() {
        if (!this.exportHandler) return;

        try {
            this.showLoading('Creating ZIP file...');
            await this.exportHandler.downloadAllAsZip();
            this.hideLoading();
            this.showNotification('Download started!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            this.hideLoading();
            this.showNotification('Error creating ZIP file', 'error');
        }
    }

    /**
     * Update gallery controls state
     */
    updateGalleryControls() {
        const clearAllBtn = document.getElementById('clear-all-btn');
        const downloadAllBtn = document.getElementById('download-all-btn');
        const hasFrames = this.frameCapture && this.frameCapture.getFrameCount() > 0;

        if (clearAllBtn) {
            clearAllBtn.disabled = !hasFrames;
        }
        if (downloadAllBtn) {
            downloadAllBtn.disabled = !hasFrames;
        }
    }

    /**
     * Update capture status
     * @param {string} text - Status text
     * @param {string} state - State class
     */
    updateStatus(text, state) {
        const statusText = document.getElementById('status-text');
        const statusDot = document.querySelector('.status-dot');

        if (statusText) {
            statusText.textContent = text;
        }
        if (statusDot) {
            statusDot.className = `status-dot ${state}`;
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    /**
     * Load saved theme
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    /**
     * Show notification
     * @param {string} message - Message to show
     * @param {string} type - Type of notification
     */
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    /**
     * Show loading overlay
     * @param {string} text - Loading text
     */
    showLoading(text = 'Processing...') {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');

        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        if (loadingText) {
            loadingText.textContent = text;
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Initialize app when document is ready
const app = new App();
