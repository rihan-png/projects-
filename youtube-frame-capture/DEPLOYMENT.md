# Deployment Guide - GitHub Pages

This guide will help you deploy the YouTube Frame Capture application to GitHub Pages for free hosting.

## Prerequisites
- A GitHub account
- This repository forked or cloned to your GitHub account

## Deployment Steps

### Method 1: Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add YouTube Frame Capture application"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select your branch (usually `main` or `master`)
   - Select `/root` as the folder
   - Click "Save"

3. **Wait for deployment:**
   - GitHub will automatically build and deploy your site
   - This usually takes 1-2 minutes
   - You'll see a green checkmark when it's ready

4. **Access your application:**
   - Your site will be available at:
     ```
     https://your-username.github.io/repository-name/youtube-frame-capture/
     ```
   - Example: `https://rihan-png.github.io/projects-/youtube-frame-capture/`

### Method 2: Using GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./youtube-frame-capture
```

## Verification

After deployment, verify that:
1. ✅ The page loads without errors
2. ✅ External libraries load (YouTube API, OpenCV.js, JSZip)
3. ✅ You can paste a YouTube URL and load a video
4. ✅ Manual capture works
5. ✅ Dark/Light theme toggle works

## Troubleshooting

### Page shows 404 error
- Check that GitHub Pages is enabled in repository settings
- Verify the correct branch and folder are selected
- Make sure your repository is public (or you have GitHub Pro for private repos)

### External libraries not loading
- Check browser console for CORS errors
- Ensure you're accessing via HTTPS (not HTTP)
- Some ad blockers may block external resources - try disabling them

### YouTube videos won't load
- Ensure you're using valid YouTube URLs
- Some videos may be restricted from embedding
- Check browser console for specific error messages

## Custom Domain (Optional)

To use a custom domain:

1. Create a file named `CNAME` in the `youtube-frame-capture` directory
2. Add your domain name to the file (e.g., `myapp.example.com`)
3. Configure your domain's DNS settings to point to GitHub Pages
4. Wait for DNS propagation (can take up to 24 hours)

For detailed instructions, see: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Security Considerations

- ✅ All processing happens client-side
- ✅ No user data is collected or stored on servers
- ✅ No authentication required
- ✅ HTTPS is enforced by GitHub Pages

## Performance Tips

For optimal performance:
- Use a modern browser (Chrome, Firefox, Edge, Safari)
- Ensure good internet connection for loading external libraries
- Clear browser cache if experiencing issues
- Use desktop for best experience

## Updates and Maintenance

To update your deployed application:

1. Make changes to your local files
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
3. GitHub Pages will automatically redeploy (1-2 minutes)

## Cost

✅ **100% FREE**
- GitHub Pages is free for public repositories
- No bandwidth limits for reasonable use
- No hidden costs or fees

---

**Need Help?**
Check the main README.md for troubleshooting or create an issue on GitHub.
