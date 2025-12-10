# 🚀 Quick Setup Summary

## Your Repository
**https://github.com/jmoncayo-pursuit/Media-Converter-Toolkit**

## Your Live Site (After Setup)
**https://jmoncayo-pursuit.github.io/Media-Converter-Toolkit/**

---

## Step 1: Enable GitHub Pages

1. Go to: **https://github.com/jmoncayo-pursuit/Media-Converter-Toolkit/settings/pages**

2. Under **"Source"**:
   - Select **Branch**: `main` (or `gh-pages` if you deploy that)
   - Select **Folder**: `/ (root)`
   - Click **Save**

3. Wait 1-2 minutes for GitHub to build

---

## Step 2: Deploy Client-Side Version (Optional)

If you want to deploy the **gh-pages** folder (client-side version):

### Option A: Use the script
```bash
./QUICK_DEPLOY.sh
```

### Option B: Manual steps
```bash
git checkout -b gh-pages
cp -r gh-pages/* .
git add .
git commit -m "Deploy GitHub Pages version"
git push origin gh-pages
```

Then in Settings → Pages, select `gh-pages` branch.

---

## Step 3: Verify

1. Visit: **https://jmoncayo-pursuit.github.io/Media-Converter-Toolkit/**
2. You should see the Media Converter Toolkit interface
3. Try uploading a small video to test

---

## Links Updated ✅

All CDN links are already configured:
- ✅ FFmpeg.wasm: `https://unpkg.com/@ffmpeg/ffmpeg@0.12.10`
- ✅ FFmpeg Core: `https://unpkg.com/@ffmpeg/core@0.12.10`
- ✅ All versions match for compatibility

No link updates needed! Just enable GitHub Pages and you're good to go! 🎉

---

## Troubleshooting

**Site shows 404?**
- Wait 2-3 minutes
- Check Settings → Pages for build status
- Verify branch name (main vs master)

**FFmpeg not loading?**
- Check browser console (F12)
- Use Chrome/Edge for best compatibility
- Ensure HTTPS (GitHub Pages provides this)

