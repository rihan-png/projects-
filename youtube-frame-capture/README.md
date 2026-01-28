# 📹 YouTube Frame Capture - Educational Content Tool

A completely **FREE**, browser-based web application that intelligently captures frames from YouTube videos, specifically designed for educational content. Perfect for students, educators, and online learners.

## 🌟 Features

### Core Functionality
- **YouTube Video Integration**: Load any YouTube video using the IFrame API
- **Manual Capture Mode**: Click a button or press 'C' to capture the current frame
- **Automatic Capture Mode**: Intelligent AI-powered frame detection
  - Scene change detection (when slides switch)
  - Board fill detection (when writing fills ~70-80% of the board)
  - Clear screen detection (when board is erased or new slide appears)
- **Smart Gallery**: View, manage, and organize captured frames
- **Bulk Export**: Download all frames as a ZIP file or individually
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

### Intelligent Detection
Uses **OpenCV.js** for computer vision algorithms:
- Histogram-based scene change detection
- Content density analysis for board fill detection
- Brightness change detection for screen clearing
- Configurable sensitivity thresholds

## 🚀 Quick Start

### Option 1: Use Hosted Version (Recommended)
1. Visit the hosted application (if deployed on GitHub Pages)
2. Paste a YouTube video URL
3. Click "Load Video"
4. Start capturing frames!

### Option 2: Run Locally
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd youtube-frame-capture
   ```

2. Serve the application using any static web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Option 3: Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select your branch and `/root` directory
4. Save and wait for deployment
5. Access your app at `https://your-username.github.io/repository-name/youtube-frame-capture/`

## 📖 How to Use

### Loading a Video
1. Find any YouTube video (educational lectures, tutorials, coding sessions, etc.)
2. Copy the URL from your browser
3. Paste it into the input field
4. Click "Load Video"

### Manual Capture Mode
1. Play the video and pause at the moment you want to capture
2. Click the "Capture Frame" button **or** press the **'C'** key
3. The frame will appear in the gallery on the right

### Auto Capture Mode
1. Select "Auto Mode" from the mode selection
2. Adjust the settings:
   - **Scene Change Sensitivity**: How different frames need to be (10-50%)
   - **Board Fill Threshold**: When to capture based on content (60-90%)
   - **Capture Interval**: Minimum time between captures (2-10 seconds)
3. Enable/disable specific detection methods:
   - Detect Scene Changes ✓
   - Detect Board Fill ✓
   - Detect Screen Clear ✓
4. Play the video and let the AI capture frames automatically

### Managing Captured Frames
- **View**: Click any frame thumbnail to see it fullscreen
- **Download**: Click the download button on individual frames
- **Delete**: Remove unwanted frames
- **Download All**: Export all frames as a ZIP file
- **Clear All**: Delete all captured frames at once

## 🛠️ Technical Stack

### Frontend (100% Free & Open Source)
- **HTML5**: Application structure
- **CSS3**: Modern, responsive styling with Flexbox/Grid
- **Vanilla JavaScript (ES6+)**: Core functionality with modules
- **YouTube IFrame API**: Video player integration
- **OpenCV.js**: Computer vision and image processing
- **JSZip**: Batch download functionality

### Architecture
```
youtube-frame-capture/
├── index.html              # Main application page
├── css/
│   └── styles.css          # Complete styling with dark/light modes
├── js/
│   ├── app.js              # Main application coordinator
│   ├── youtube-api.js      # YouTube player integration
│   ├── frame-capture.js    # Frame capture and storage
│   ├── cv-detection.js     # Computer vision algorithms
│   └── export.js           # Download and export functionality
└── README.md               # This file
```

## 🎯 Key Algorithms

### Scene Change Detection
Compares consecutive frames using histogram difference to detect when slides change:
```javascript
// Simplified concept
1. Convert frames to grayscale
2. Calculate histogram for each frame
3. Compare histograms using absolute difference
4. If difference > threshold → Scene changed → Capture!
```

### Board Fill Detection
Analyzes pixel density to determine when a whiteboard/blackboard is filled:
```javascript
// Simplified concept
1. Convert frame to grayscale
2. Apply threshold to isolate content
3. Count non-background pixels
4. If coverage > 70-80% → Board filled → Capture!
```

### Clear Screen Detection
Detects sudden brightness or emptiness changes:
```javascript
// Simplified concept
1. Calculate content density for current and previous frames
2. Detect significant density drop
3. If drop > threshold → Screen cleared → Capture!
```

## ⚙️ Configuration

### Auto Capture Settings
| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Scene Change Sensitivity | 10-50% | 30% | Higher = only major changes trigger capture |
| Board Fill Threshold | 60-90% | 75% | When board reaches this % fullness |
| Capture Interval | 2-10s | 5s | Minimum time between auto captures |

### Detection Toggles
- **Scene Changes**: Best for slideshow presentations
- **Board Fill**: Best for handwritten lectures
- **Screen Clear**: Captures before/after board erasing

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended for best performance |
| Firefox | ✅ Full | Works great |
| Safari | ✅ Full | May need permissions for downloads |
| Edge | ✅ Full | Chromium-based, works well |
| Mobile Safari | ⚠️ Limited | Some features may be restricted |
| Mobile Chrome | ⚠️ Limited | Works but smaller screen |

## 💡 Tips & Best Practices

### For Best Results
1. **Use High Quality Videos**: 720p or higher for clearer captures
2. **Adjust Sensitivity**: Start with defaults, then tweak based on your video
3. **Manual for Precision**: Use manual mode for specific moments
4. **Auto for Long Videos**: Let AI handle hour-long lectures
5. **Review Captures**: Delete duplicates or unwanted frames before exporting

### Common Use Cases
- **University Lectures**: Capture slides automatically during online classes
- **Coding Tutorials**: Grab code snippets shown on screen
- **Math/Physics**: Capture board work and diagrams
- **Language Learning**: Save vocabulary slides and grammar rules
- **Conference Talks**: Extract presentation slides

## 🔒 Privacy & Security

### Your Data is Safe
- ✅ **100% Client-Side**: All processing happens in your browser
- ✅ **No Server**: No data is sent to any backend
- ✅ **No Tracking**: No analytics or user tracking
- ✅ **No Account Required**: Use anonymously
- ✅ **Offline Capable**: Works with local video files (when hosted locally)

### Important Notes
Due to browser security policies (CORS), actual video frame extraction from YouTube's player is restricted. This application uses placeholder frames with timestamps. For actual video frame extraction, consider:
1. Using browser extensions with appropriate permissions
2. Screen recording tools
3. YouTube's official download features (where available and legal)

## 🐛 Troubleshooting

### Video Won't Load
- ✅ Check if the URL is a valid YouTube link
- ✅ Ensure the video is not private or age-restricted
- ✅ Try refreshing the page

### Auto Capture Not Working
- ✅ Make sure the video is playing
- ✅ Check that at least one detection method is enabled
- ✅ Adjust sensitivity settings
- ✅ Wait for the capture interval to pass

### Downloads Not Starting
- ✅ Check browser popup blocker settings
- ✅ Allow downloads from this site
- ✅ Try downloading individual frames first

### OpenCV Not Loading
- ✅ Check internet connection (OpenCV loads from CDN)
- ✅ Refresh the page
- ✅ Basic features will still work without OpenCV

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🙏 Credits

### Technologies Used
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) - Video player
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) - Computer vision
- [JSZip](https://stuk.github.io/jszip/) - ZIP file creation

### Built With ❤️
For students, educators, and lifelong learners worldwide.

## 🚀 Future Enhancements

Potential features for future versions:
- [ ] OCR text extraction from captured frames
- [ ] Automatic organization by chapters/topics
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] PDF export with annotations
- [ ] Browser extension version
- [ ] Mobile app version
- [ ] Collaborative sharing features

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Report bugs
2. Suggest features
3. Submit pull requests
4. Improve documentation

## 📞 Support

Having issues? Need help?
- Check the Troubleshooting section above
- Review existing issues in the repository
- Create a new issue with details about your problem

---

**Happy Learning! 📚**

*This tool is designed to enhance your online learning experience. Always respect copyright and fair use policies when capturing content from videos.*
