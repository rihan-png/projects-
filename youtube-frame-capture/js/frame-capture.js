/**
 * Frame Capture Module
 * Handles capturing frames from YouTube video and storage
 */

class FrameCapture {
    constructor(youtubePlayer) {
        this.youtubePlayer = youtubePlayer;
        this.frames = [];
        this.onFrameCapturedCallback = null;
    }

    /**
     * Capture current frame from video
     * @returns {Promise<Object>} Captured frame data
     */
    async captureCurrentFrame() {
        try {
            const currentTime = this.youtubePlayer.getCurrentTime();
            const timestamp = this.youtubePlayer.formatTime(currentTime);
            
            // Get video screenshot
            const imageData = await this.youtubePlayer.getVideoScreenshot();
            
            const frameData = {
                id: Date.now(),
                timestamp: timestamp,
                time: currentTime,
                imageData: imageData,
                capturedAt: new Date().toISOString()
            };

            // Add to frames collection
            this.frames.push(frameData);

            // Trigger callback
            if (this.onFrameCapturedCallback) {
                this.onFrameCapturedCallback(frameData);
            }

            console.log(`Frame captured at ${timestamp}`);
            return frameData;
        } catch (error) {
            console.error('Error capturing frame:', error);
            throw error;
        }
    }

    /**
     * Set callback for when frame is captured
     * @param {Function} callback - Callback function
     */
    setOnFrameCaptured(callback) {
        this.onFrameCapturedCallback = callback;
    }

    /**
     * Get all captured frames
     * @returns {Array} Array of frame data
     */
    getAllFrames() {
        return this.frames;
    }

    /**
     * Get frame by ID
     * @param {number} id - Frame ID
     * @returns {Object|null} Frame data or null
     */
    getFrameById(id) {
        return this.frames.find(frame => frame.id === id) || null;
    }

    /**
     * Delete frame by ID
     * @param {number} id - Frame ID
     * @returns {boolean} True if deleted
     */
    deleteFrame(id) {
        const index = this.frames.findIndex(frame => frame.id === id);
        if (index !== -1) {
            this.frames.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Clear all frames
     */
    clearAllFrames() {
        this.frames = [];
    }

    /**
     * Get frame count
     * @returns {number} Number of frames
     */
    getFrameCount() {
        return this.frames.length;
    }

    /**
     * Check for duplicate frames using simple similarity check
     * @param {string} imageData - New image data
     * @param {number} threshold - Similarity threshold (0-1)
     * @returns {boolean} True if duplicate found
     */
    isDuplicate(imageData, threshold = 0.95) {
        // Simple check: compare with last few frames
        const recentFrames = this.frames.slice(-5);
        
        for (const frame of recentFrames) {
            // Simple comparison: exact match
            if (frame.imageData === imageData) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Enhance image (placeholder for future implementation)
     * @param {string} imageData - Image data URL
     * @returns {Promise<string>} Enhanced image data
     */
    async enhanceImage(imageData) {
        // Placeholder: In a full implementation, this would use
        // canvas manipulation or OpenCV.js for image enhancement
        return imageData;
    }

    /**
     * Export frames as JSON
     * @returns {string} JSON string
     */
    exportAsJSON() {
        return JSON.stringify({
            exportedAt: new Date().toISOString(),
            frameCount: this.frames.length,
            frames: this.frames.map(frame => ({
                id: frame.id,
                timestamp: frame.timestamp,
                time: frame.time,
                capturedAt: frame.capturedAt
            }))
        }, null, 2);
    }

    /**
     * Get storage size estimate in bytes
     * @returns {number} Estimated size
     */
    getStorageSize() {
        let size = 0;
        for (const frame of this.frames) {
            // Estimate base64 image size
            size += frame.imageData.length;
        }
        return size;
    }

    /**
     * Get storage size in human-readable format
     * @returns {string} Formatted size
     */
    getStorageSizeFormatted() {
        const bytes = this.getStorageSize();
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
}

export default FrameCapture;
