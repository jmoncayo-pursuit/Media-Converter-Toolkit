# Git Setup Instructions

## Initial Setup

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   ```

2. **Add the remote repository**:
   ```bash
   git remote add origin https://github.com/jmoncayo-pursuit/Media-Converter-Toolkit.git
   ```

3. **Verify .gitignore is working**:
   ```bash
   git status
   ```
   
   You should NOT see:
   - `outputs/` folder or any `.gif`, `.mp4`, `.webm` files
   - `uploads/` folder
   - `node_modules/` folder

4. **Add files**:
   ```bash
   git add .
   ```

5. **Commit**:
   ```bash
   git commit -m "Initial commit: Media Converter Toolkit"
   ```

6. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

## What Gets Ignored

The `.gitignore` file ensures these are NOT uploaded:
- ✅ `outputs/` - All converted video files
- ✅ `uploads/` - Temporary uploaded files
- ✅ `node_modules/` - Dependencies
- ✅ All media files (`.gif`, `.mp4`, `.webm`, etc.) in root
- ✅ Log files, OS files, IDE files

## What Gets Uploaded

- ✅ Source code (`server.js`, `package.json`)
- ✅ Frontend files (`public/` folder)
- ✅ Shell scripts (`*.sh` files)
- ✅ Documentation (`*.md` files)
- ✅ `gh-pages/` folder (for GitHub Pages deployment)
- ✅ `.gitignore` file

## Verify Before Pushing

Always check what will be committed:
```bash
git status
git diff --cached
```

If you see any output files, they won't be committed thanks to `.gitignore`.

