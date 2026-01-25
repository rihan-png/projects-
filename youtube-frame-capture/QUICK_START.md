# Quick Start Guide - YouTube Frame Capture

## 5-Minute Setup

### Step 1: Access the Application

**Option A - Use Hosted Version (Easiest)**
```
Visit: https://rihan-png.github.io/projects-/youtube-frame-capture/
```

**Option B - Run Locally**
```bash
# Clone repository
git clone https://github.com/rihan-png/projects-.git
cd projects-/youtube-frame-capture

# Start local server
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

---

## Step 2: Load a Video (30 seconds)

1. **Find a YouTube video**
   - Example: Any educational lecture or tutorial
   - Copy the URL from your browser

2. **Paste the URL**
   - Click on the input field at the top
   - Paste your YouTube URL
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

3. **Click "Load Video"**
   - Video will load in a few seconds
   - Player appears with controls

---

## Step 3: Capture Frames

### Manual Capture (Simplest)

1. **Play the video**
2. **Pause at the moment you want to capture**
3. **Click "Capture Frame" button** OR **Press 'C' key**
4. Frame appears in the gallery on the right! 🎉

### Auto Capture (For Long Videos)

1. **Click "Auto Mode" radio button**
2. **Settings panel appears below**
3. **Adjust settings** (optional):
   - Scene Change Sensitivity: 30% (default)
   - Board Fill Threshold: 75% (default)
   - Capture Interval: 5 seconds (default)
4. **Play the video**
5. **Sit back and relax** - AI captures frames automatically! 🤖

---

## Step 4: Manage Your Captures

### View a Frame
- Click any thumbnail in the gallery
- Frame opens in fullscreen lightbox
- Click X or outside to close

### Download a Frame
- Click "Download" button on any frame
- Frame saves to your Downloads folder
- Filename includes timestamp

### Download All Frames
1. Click "Download All" button (top right)
2. All frames packaged into a ZIP file
3. Includes metadata.json with timestamps
4. One-click download! 📦

### Delete Frames
- Click "Delete" on individual frames
- OR click "Clear All" to remove everything

---

## Step 5: Customize Experience

### Toggle Theme
- Click 🌙/☀️ icon (top right)
- Switches between Dark/Light mode
- Preference saved automatically

### Adjust Auto Settings
- **Scene Change Sensitivity** (10-50%)
  - Lower = More captures (sensitive)
  - Higher = Fewer captures (only major changes)
  
- **Board Fill Threshold** (60-90%)
  - Lower = Capture earlier
  - Higher = Wait until board is fuller
  
- **Capture Interval** (2-10 seconds)
  - Minimum time between auto captures
  - Prevents duplicate frames

---

## Real-World Examples

### Example 1: University Lecture
```
Scenario: 1-hour calculus lecture with slides

Setup:
- Mode: Auto
- Scene Change: 30%
- Board Fill: 75%
- Interval: 5s

Result: ~20-30 frames of key slides and equations
```

### Example 2: Coding Tutorial
```
Scenario: 30-minute Python tutorial

Setup:
- Mode: Manual
- Technique: Pause and press 'C' for each code snippet

Result: ~10-15 frames of important code examples
```

### Example 3: Conference Talk
```
Scenario: 45-minute presentation

Setup:
- Mode: Auto
- Scene Change: 25% (more sensitive)
- Detect Scene Changes: ✓
- Detect Board Fill: ✗
- Detect Screen Clear: ✓

Result: ~15-25 frames of presentation slides
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **C** | Capture current frame |
| **Esc** | Close lightbox |
| **Space** | Play/Pause video (YouTube default) |

---

## Tips & Tricks

### 💡 Getting Best Results

1. **For Slide Presentations:**
   - Use Auto Mode
   - Enable "Detect Scene Changes"
   - Set sensitivity around 25-30%

2. **For Handwritten Boards:**
   - Use Auto Mode
   - Enable "Detect Board Fill"
   - Set threshold around 75-80%

3. **For Mixed Content:**
   - Enable all detection methods
   - Adjust sensitivity based on results
   - Review and delete unwanted frames

4. **For Quick Notes:**
   - Use Manual Mode
   - Press 'C' for important moments
   - Faster and more precise

### ⚡ Performance Tips

- Close other tabs for faster processing
- Use desktop for best experience
- Modern browsers work best (Chrome/Firefox)
- Good internet connection for loading libraries

### 🎯 Common Use Cases

| Task | Recommended Mode | Settings |
|------|------------------|----------|
| Lecture slides | Auto | Scene: 30%, Interval: 5s |
| Board writing | Auto | Fill: 75%, Interval: 5s |
| Code snippets | Manual | Press 'C' when needed |
| Presentations | Auto | Scene: 25%, Interval: 4s |
| Mixed content | Auto | All detections enabled |

---

## Troubleshooting Quick Fixes

### Video Won't Load
- ✅ Check URL is valid YouTube link
- ✅ Try a different video
- ✅ Refresh the page

### No Frames Captured in Auto Mode
- ✅ Make sure video is playing
- ✅ Check that detection methods are enabled
- ✅ Lower sensitivity threshold
- ✅ Wait for interval to pass

### Download Not Working
- ✅ Allow popups in browser settings
- ✅ Check Downloads folder
- ✅ Try downloading single frame first

### App Seems Slow
- ✅ Close unnecessary browser tabs
- ✅ Clear browser cache
- ✅ Refresh the page
- ✅ Use a modern browser

---

## Next Steps

Once you're comfortable with basics:

1. **Experiment with settings** to find your preferences
2. **Try different types of videos** (lectures, tutorials, talks)
3. **Use keyboard shortcuts** for efficiency
4. **Organize your downloads** by topic/subject
5. **Share with classmates** - it's free for everyone! 🎓

---

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for hosting
- 🔧 Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details
- 🐛 Report issues on GitHub

---

**You're all set! Happy learning! 📚✨**
