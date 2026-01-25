/**
 * Export Module
 * Handles downloading and exporting captured frames
 */

class ExportHandler {
    constructor(frameCapture) {
        this.frameCapture = frameCapture;
    }

    /**
     * Download a single frame
     * @param {number} frameId - Frame ID to download
     * @param {string} format - Image format (png or jpg)
     */
    downloadFrame(frameId, format = 'png') {
        const frame = this.frameCapture.getFrameById(frameId);
        if (!frame) {
            console.error('Frame not found');
            return;
        }

        const filename = `frame_${frame.timestamp.replace(/:/g, '-')}.${format}`;
        this.downloadDataUrl(frame.imageData, filename);
    }

    /**
     * Download all frames as individual files
     * This triggers multiple downloads
     */
    async downloadAllFrames() {
        const frames = this.frameCapture.getAllFrames();
        
        if (frames.length === 0) {
            console.warn('No frames to download');
            return;
        }

        // Download frames one by one with a delay to avoid blocking
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            const filename = `frame_${String(i + 1).padStart(3, '0')}_${frame.timestamp.replace(/:/g, '-')}.png`;
            
            await new Promise(resolve => setTimeout(resolve, 100));
            this.downloadDataUrl(frame.imageData, filename);
        }
    }

    /**
     * Download all frames as a ZIP file
     * @returns {Promise<void>}
     */
    async downloadAllAsZip() {
        const frames = this.frameCapture.getAllFrames();
        
        if (frames.length === 0) {
            throw new Error('No frames to download');
        }

        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip library not loaded');
        }

        try {
            const zip = new JSZip();
            const framesFolder = zip.folder('frames');

            // Add each frame to the ZIP
            for (let i = 0; i < frames.length; i++) {
                const frame = frames[i];
                const filename = `frame_${String(i + 1).padStart(3, '0')}_${frame.timestamp.replace(/:/g, '-')}.png`;
                
                // Convert data URL to blob
                const base64Data = frame.imageData.split(',')[1];
                framesFolder.file(filename, base64Data, { base64: true });
            }

            // Add metadata JSON
            const metadata = {
                exportedAt: new Date().toISOString(),
                frameCount: frames.length,
                frames: frames.map((frame, index) => ({
                    filename: `frame_${String(index + 1).padStart(3, '0')}_${frame.timestamp.replace(/:/g, '-')}.png`,
                    timestamp: frame.timestamp,
                    time: frame.time,
                    capturedAt: frame.capturedAt
                }))
            };
            
            zip.file('metadata.json', JSON.stringify(metadata, null, 2));

            // Generate and download ZIP
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
            const filename = `youtube_frames_${timestamp}.zip`;
            
            this.downloadBlob(blob, filename);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error('Error creating ZIP:', error);
            throw error;
        }
    }

    /**
     * Export frames metadata as JSON
     */
    downloadMetadata() {
        const json = this.frameCapture.exportAsJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `frames_metadata_${timestamp}.json`;
        
        this.downloadBlob(blob, filename);
    }

    /**
     * Generate PDF with all frames (requires jsPDF)
     * @returns {Promise<void>}
     */
    async generatePDF() {
        throw new Error('PDF generation not implemented. Consider adding jsPDF library for this feature.');
    }

    /**
     * Download data URL as file
     * @param {string} dataUrl - Data URL
     * @param {string} filename - Filename
     */
    downloadDataUrl(dataUrl, filename) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Download blob as file
     * @param {Blob} blob - Blob data
     * @param {string} filename - Filename
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /**
     * Copy frame to clipboard
     * @param {number} frameId - Frame ID
     * @returns {Promise<void>}
     */
    async copyFrameToClipboard(frameId) {
        const frame = this.frameCapture.getFrameById(frameId);
        if (!frame) {
            throw new Error('Frame not found');
        }

        try {
            // Convert data URL to blob
            const response = await fetch(frame.imageData);
            const blob = await response.blob();
            
            // Copy to clipboard
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
            
            console.log('Frame copied to clipboard');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            throw error;
        }
    }

    /**
     * Share frame using Web Share API
     * @param {number} frameId - Frame ID
     * @returns {Promise<void>}
     */
    async shareFrame(frameId) {
        const frame = this.frameCapture.getFrameById(frameId);
        if (!frame) {
            throw new Error('Frame not found');
        }

        if (!navigator.share) {
            throw new Error('Web Share API not supported');
        }

        try {
            // Convert data URL to blob
            const response = await fetch(frame.imageData);
            const blob = await response.blob();
            const file = new File([blob], `frame_${frame.timestamp}.png`, { type: 'image/png' });

            await navigator.share({
                title: 'YouTube Frame Capture',
                text: `Frame captured at ${frame.timestamp}`,
                files: [file]
            });
        } catch (error) {
            console.error('Error sharing:', error);
            throw error;
        }
    }

    /**
     * Get export statistics
     * @returns {Object} Statistics
     */
    getExportStats() {
        const frames = this.frameCapture.getAllFrames();
        
        return {
            totalFrames: frames.length,
            storageSize: this.frameCapture.getStorageSizeFormatted(),
            firstFrame: frames[0]?.timestamp || 'N/A',
            lastFrame: frames[frames.length - 1]?.timestamp || 'N/A',
            estimatedZipSize: this.estimateZipSize()
        };
    }

    /**
     * Estimate ZIP file size
     * @returns {string} Estimated size
     */
    estimateZipSize() {
        const storageBytes = this.frameCapture.getStorageSize();
        // ZIP compression typically achieves 60-80% of original size for images
        const estimatedBytes = storageBytes * 0.7;
        
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = estimatedBytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `~${size.toFixed(2)} ${units[unitIndex]}`;
    }
}

export default ExportHandler;
