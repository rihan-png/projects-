# 🚀 How to Run the YouTube Frame Capture Application

## Easiest Way (Automated Script)

### On Linux/Mac:
```bash
./run.sh
```

### On Windows:
```cmd
run.bat
```

Then open **http://localhost:8000** in your browser. Done! 🎉

---

## Manual Start (3 Steps)

### Step 1: Navigate to the Application Folder
```bash
cd youtube-frame-capture
```

### Step 2: Start a Web Server

Choose one of these methods:

**Using Python (Most Common):**
```bash
python3 -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

### Step 3: Open in Browser
Open your web browser and go to:
```
http://localhost:8000
```

**That's it!** 🎉

---

## What You'll See

When you open the application, you'll see:
1. **A text input** - Paste any YouTube video URL here
2. **Load Video button** - Click to load the video
3. **Capture controls** - Choose Manual or Auto mode
4. **Empty gallery** - Your captured frames will appear here

---

## How to Use the Application

### Basic Usage (Manual Mode)

1. **Paste a YouTube URL** in the input field
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

2. **Click "Load Video"**
   - Video will load in the player

3. **Pause the video** at any moment you want to capture

4. **Click "Capture Frame"** (or press 'C' key)
   - Frame appears in the gallery on the right

5. **Download your frames**
   - Click "Download All" for a ZIP file
   - Or download individual frames

### Advanced Usage (Auto Mode)

1. Switch to **"Auto Mode"**
2. Adjust the settings as needed:
   - Scene Change Sensitivity
   - Board Fill Threshold
   - Capture Interval
3. **Play the video**
4. Frames are captured automatically!

---

## Troubleshooting

### "Command not found" error
- **Python**: Make sure Python is installed (`python3 --version`)
- **Node.js**: Install Node.js from nodejs.org
- **PHP**: Install PHP from php.net

### Port 8000 already in use
Change the port number:
```bash
python3 -m http.server 8080
# Then visit http://localhost:8080
```

### Application won't load
- Make sure you're in the `youtube-frame-capture` folder
- Check if the server is running (should see "Serving HTTP on...")
- Try a different browser (Chrome, Firefox recommended)

---

## Need More Help?

- 📖 See [youtube-frame-capture/README.md](youtube-frame-capture/README.md) for full documentation
- 🚀 See [youtube-frame-capture/QUICK_START.md](youtube-frame-capture/QUICK_START.md) for detailed walkthrough
- 🌐 See [youtube-frame-capture/DEPLOYMENT.md](youtube-frame-capture/DEPLOYMENT.md) for deployment options

---

## Alternative: Use Without Installation

If you don't want to run a server locally, you can:

1. **Deploy to GitHub Pages** (Free):
   - Fork this repository
   - Go to Settings → Pages
   - Enable GitHub Pages
   - Access at `https://yourusername.github.io/projects-/youtube-frame-capture/`

2. **Use a Simple File Server Extension**:
   - Install "Live Server" extension in VS Code
   - Right-click `index.html` → "Open with Live Server"

---

**Ready to capture some educational content!** 📚✨
