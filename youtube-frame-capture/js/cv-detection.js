/**
 * Computer Vision Detection Module
 * Implements scene change, board fill, and clear screen detection
 * Uses OpenCV.js for image processing
 */

class CVDetection {
    constructor() {
        this.previousFrame = null;
        this.isOpenCVReady = false;
        this.initOpenCV();
    }

    /**
     * Initialize OpenCV.js
     */
    initOpenCV() {
        // Check if OpenCV is loaded
        if (typeof cv !== 'undefined') {
            cv['onRuntimeInitialized'] = () => {
                this.isOpenCVReady = true;
                console.log('OpenCV.js is ready');
            };
        } else {
            console.warn('OpenCV.js not loaded, detection features will be limited');
        }
    }

    /**
     * Wait for OpenCV to be ready
     * @returns {Promise<void>}
     */
    async waitForOpenCV() {
        if (this.isOpenCVReady) return;
        
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.isOpenCVReady) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }

    /**
     * Convert image data URL to OpenCV Mat
     * @param {string} imageDataUrl - Image data URL
     * @returns {Promise<cv.Mat>} OpenCV Mat object
     */
    async imageDataToMat(imageDataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    if (this.isOpenCVReady && typeof cv !== 'undefined') {
                        const mat = cv.imread(canvas);
                        resolve(mat);
                    } else {
                        // Return canvas ImageData as fallback
                        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
                    }
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = reject;
            img.src = imageDataUrl;
        });
    }

    /**
     * Detect scene change between two frames
     * @param {string} currentFrameData - Current frame image data
     * @param {number} threshold - Detection threshold (0-100)
     * @returns {Promise<Object>} Detection result
     */
    async detectSceneChange(currentFrameData, threshold = 30) {
        try {
            if (!this.previousFrame) {
                this.previousFrame = currentFrameData;
                return { detected: false, difference: 0, reason: 'First frame' };
            }

            // Simple comparison using histogram difference
            const difference = await this.compareFrames(this.previousFrame, currentFrameData);
            const detected = difference > threshold;

            if (detected) {
                console.log(`Scene change detected: ${difference.toFixed(2)}% difference`);
            }

            this.previousFrame = currentFrameData;

            return {
                detected: detected,
                difference: difference,
                reason: detected ? 'Significant scene change' : 'Scene stable'
            };
        } catch (error) {
            console.error('Error in scene change detection:', error);
            return { detected: false, difference: 0, reason: 'Error' };
        }
    }

    /**
     * Compare two frames and return difference percentage
     * @param {string} frame1Data - First frame
     * @param {string} frame2Data - Second frame
     * @returns {Promise<number>} Difference percentage
     */
    async compareFrames(frame1Data, frame2Data) {
        try {
            if (this.isOpenCVReady && typeof cv !== 'undefined') {
                return await this.compareFramesWithOpenCV(frame1Data, frame2Data);
            } else {
                return await this.compareFramesSimple(frame1Data, frame2Data);
            }
        } catch (error) {
            console.error('Error comparing frames:', error);
            return 0;
        }
    }

    /**
     * Compare frames using OpenCV
     * @param {string} frame1Data - First frame
     * @param {string} frame2Data - Second frame
     * @returns {Promise<number>} Difference percentage
     */
    async compareFramesWithOpenCV(frame1Data, frame2Data) {
        try {
            const mat1 = await this.imageDataToMat(frame1Data);
            const mat2 = await this.imageDataToMat(frame2Data);

            // Convert to grayscale
            const gray1 = new cv.Mat();
            const gray2 = new cv.Mat();
            cv.cvtColor(mat1, gray1, cv.COLOR_RGBA2GRAY);
            cv.cvtColor(mat2, gray2, cv.COLOR_RGBA2GRAY);

            // Calculate absolute difference
            const diff = new cv.Mat();
            cv.absdiff(gray1, gray2, diff);

            // Calculate mean difference
            const mean = cv.mean(diff);
            const difference = (mean[0] / 255) * 100;

            // Clean up
            mat1.delete();
            mat2.delete();
            gray1.delete();
            gray2.delete();
            diff.delete();

            return difference;
        } catch (error) {
            console.error('OpenCV comparison error:', error);
            return 0;
        }
    }

    /**
     * Simple frame comparison without OpenCV
     * @param {string} frame1Data - First frame
     * @param {string} frame2Data - Second frame
     * @returns {Promise<number>} Difference percentage
     */
    async compareFramesSimple(frame1Data, frame2Data) {
        // Simple hash comparison
        if (frame1Data === frame2Data) {
            return 0;
        }

        // Sample-based comparison
        const samples1 = this.sampleImageData(frame1Data);
        const samples2 = this.sampleImageData(frame2Data);

        let diffCount = 0;
        const totalSamples = Math.min(samples1.length, samples2.length);

        for (let i = 0; i < totalSamples; i++) {
            if (Math.abs(samples1[i] - samples2[i]) > 30) {
                diffCount++;
            }
        }

        return (diffCount / totalSamples) * 100;
    }

    /**
     * Sample image data for quick comparison
     * @param {string} imageDataUrl - Image data URL
     * @returns {Array<number>} Sample values
     */
    sampleImageData(imageDataUrl) {
        // Extract a few characters from the base64 data as a simple hash
        const data = imageDataUrl.split(',')[1] || imageDataUrl;
        const samples = [];
        const step = Math.floor(data.length / 100);

        for (let i = 0; i < data.length; i += step) {
            samples.push(data.charCodeAt(i));
        }

        return samples;
    }

    /**
     * Detect board fill level
     * @param {string} frameData - Frame image data
     * @param {number} threshold - Fill threshold (60-90)
     * @returns {Promise<Object>} Detection result
     */
    async detectBoardFill(frameData, threshold = 75) {
        try {
            const fillPercentage = await this.calculateContentDensity(frameData);
            const detected = fillPercentage >= threshold;

            if (detected) {
                console.log(`Board fill detected: ${fillPercentage.toFixed(2)}%`);
            }

            return {
                detected: detected,
                fillPercentage: fillPercentage,
                reason: detected ? 'Board is filled' : 'Board not full'
            };
        } catch (error) {
            console.error('Error in board fill detection:', error);
            return { detected: false, fillPercentage: 0, reason: 'Error' };
        }
    }

    /**
     * Calculate content density of a frame
     * @param {string} frameData - Frame image data
     * @returns {Promise<number>} Density percentage
     */
    async calculateContentDensity(frameData) {
        try {
            if (this.isOpenCVReady && typeof cv !== 'undefined') {
                return await this.calculateDensityWithOpenCV(frameData);
            } else {
                return await this.calculateDensitySimple(frameData);
            }
        } catch (error) {
            console.error('Error calculating density:', error);
            return 0;
        }
    }

    /**
     * Calculate density using OpenCV
     * @param {string} frameData - Frame image data
     * @returns {Promise<number>} Density percentage
     */
    async calculateDensityWithOpenCV(frameData) {
        try {
            const mat = await this.imageDataToMat(frameData);
            const gray = new cv.Mat();
            cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

            // Apply threshold to detect content
            const binary = new cv.Mat();
            cv.threshold(gray, binary, 200, 255, cv.THRESH_BINARY_INV);

            // Count non-zero pixels
            const nonZero = cv.countNonZero(binary);
            const total = binary.rows * binary.cols;
            const density = (nonZero / total) * 100;

            // Clean up
            mat.delete();
            gray.delete();
            binary.delete();

            return density;
        } catch (error) {
            console.error('OpenCV density calculation error:', error);
            return 0;
        }
    }

    /**
     * Simple density calculation
     * @param {string} frameData - Frame image data
     * @returns {Promise<number>} Density percentage
     */
    async calculateDensitySimple(frameData) {
        // Simplified estimation based on data size
        const dataLength = frameData.length;
        const baseLength = 10000; // Approximate base64 length for empty frame
        
        if (dataLength <= baseLength) {
            return 0;
        }

        // Rough estimation
        const density = Math.min(((dataLength - baseLength) / baseLength) * 50, 100);
        return density;
    }

    /**
     * Detect clear screen event
     * @param {string} currentFrameData - Current frame
     * @returns {Promise<Object>} Detection result
     */
    async detectClearScreen(currentFrameData) {
        try {
            if (!this.previousFrame) {
                return { detected: false, reason: 'No previous frame' };
            }

            const prevDensity = await this.calculateContentDensity(this.previousFrame);
            const currDensity = await this.calculateContentDensity(currentFrameData);

            const densityDrop = prevDensity - currDensity;
            const detected = densityDrop > 40 && prevDensity > 50;

            if (detected) {
                console.log(`Clear screen detected: density dropped from ${prevDensity.toFixed(2)}% to ${currDensity.toFixed(2)}%`);
            }

            return {
                detected: detected,
                densityDrop: densityDrop,
                previousDensity: prevDensity,
                currentDensity: currDensity,
                reason: detected ? 'Screen cleared' : 'No clear detected'
            };
        } catch (error) {
            console.error('Error in clear screen detection:', error);
            return { detected: false, reason: 'Error' };
        }
    }

    /**
     * Reset detection state
     */
    reset() {
        this.previousFrame = null;
    }

    /**
     * Get OpenCV status
     * @returns {boolean} True if ready
     */
    isReady() {
        return this.isOpenCVReady;
    }
}

export default CVDetection;
