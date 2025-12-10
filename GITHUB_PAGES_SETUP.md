# GitHub Pages Setup Guide

## Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/jmoncayo-pursuit/Media-Converter-Toolkit
2. Click on **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `main` (or `master` if that's your default)
   - **Folder**: `/ (root)` 
5. Click **Save**

## Step 2: Wait for Deployment

- GitHub will build your site (takes 1-2 minutes)
- You'll see a message: "Your site is live at..."
- Your site URL will be:
  ```
  https://jmoncayo-pursuit.github.io/Media-Converter-Toolkit/
  ```

## Step 3: Deploy the gh-pages Version

Since you want to host the **client-side version** (gh-pages folder), you have two options:

### Option A: Deploy gh-pages folder to a separate branch (Recommended)

1. Create a new branch for GitHub Pages:
   ```bash
   git checkout -b gh-pages
   ```

2. Copy gh-pages files to root:
   ```bash
   cp -r gh-pages/* .
   git add .
   git commit -m "Deploy GitHub Pages version"
   git push origin gh-pages
   ```

3. In GitHub Settings → Pages:
   - Select **Branch**: `gh-pages`
   - Select **Folder**: `/ (root)`
   - Click **Save**

### Option B: Use GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml` to automatically deploy gh-pages folder.

## Step 4: Verify Your Site

1. Visit: https://jmoncayo-pursuit.github.io/Media-Converter-Toolkit/
2. The page should load with the Media Converter Toolkit interface
3. Try uploading a small video to test conversion

## Troubleshooting

### Site shows 404
- Wait 2-3 minutes for GitHub to build
- Check Settings → Pages to see deployment status
- Verify branch name matches (main vs master)

### FFmpeg not loading
- Check browser console (F12) for errors
- Ensure you're using HTTPS (GitHub Pages provides this)
- Try Chrome/Edge browser for best compatibility

### Files not updating
- GitHub Pages can take a few minutes to update
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check repository → Actions tab for build status

## Your Live URL

Once deployed, your app will be available at:
**https://jmoncayo-pursuit.github.io/Media-Converter-Toolkit/**

Bookmark it and share with others! 🚀

