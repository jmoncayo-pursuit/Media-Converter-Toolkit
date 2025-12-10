# Deploying to GitHub Pages

Follow these steps to host your Media Converter Toolkit on GitHub Pages:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it (e.g., `media-converter`)
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have files)
6. Click "Create repository"

## Step 2: Upload Files

### Option A: Using GitHub Web Interface

1. In your new repository, click "uploading an existing file"
2. Drag and drop all files from the `gh-pages` folder:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `README.md`
   - `.nojekyll`
3. Scroll down and click "Commit changes"

### Option B: Using Git Command Line

```bash
# Navigate to the gh-pages folder
cd gh-pages

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Media Converter Toolkit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

## Step 4: Wait and Access

- GitHub will build your site (takes 1-2 minutes)
- Your site will be live at:
  ```
  https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
  ```

## Troubleshooting

### Site shows 404
- Wait a few minutes for GitHub to build
- Check that all files are in the root directory
- Verify `.nojekyll` file exists (prevents Jekyll processing)

### FFmpeg not loading
- Check browser console for errors
- Ensure you're using HTTPS (GitHub Pages provides this)
- Some browsers may block WASM - try Chrome/Edge

### Files not updating
- Clear browser cache
- GitHub Pages can take a few minutes to update
- Check repository settings → Pages to verify deployment

## Custom Domain (Optional)

If you want a custom domain:
1. Add a `CNAME` file with your domain name
2. Update your DNS settings
3. Enable custom domain in GitHub Pages settings

## Notes

- The app runs entirely client-side - no server needed!
- All processing happens in the user's browser
- Large files may take time to process
- Recommended max file size: 100MB for best performance

