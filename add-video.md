# Adding Video to KIM Documentation

## Steps to add your video:

### 1. Prepare the video file
```bash
# Convert QuickTime to optimized MP4 (14MB → ~3-5MB)
ffmpeg -i /path/to/your/video.mov -vcodec h264 -acodec aac -crf 28 -vf scale=1280:-1 docs/images/kim-demo.mp4

# Alternative: Even smaller file size
ffmpeg -i /path/to/your/video.mov -vcodec h264 -acodec aac -crf 32 -vf scale=1024:-1 docs/images/kim-demo.mp4

# Create WebM version (often smaller than MP4)
ffmpeg -i /path/to/your/video.mov -c:v libvpx-vp9 -crf 35 -b:v 0 -vf scale=1280:-1 docs/images/kim-demo.webm
```

### 2. Video will be automatically referenced in documentation

The video references are ready to be added to:
- README.md (Quick Start section)
- ARCHITECTURE.md (if showing technical features)

### 3. HTML5 Video Format (for autoplay)

```html
<video width="800" autoplay muted loop playsinline>
  <source src="docs/images/kim-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

### 4. GitHub Native Video (simpler)

GitHub also supports direct video embedding:
```markdown
![KIM Demo](docs/images/kim-demo.mp4)
```

## What should the video show?

For maximum impact, show:
1. Opening VS Code with KIM extension
2. Clicking the control panel
3. Generating pairing code
4. Scanning QR code on phone
5. Typing prompt on phone
6. Prompt appearing in VS Code Copilot

Keep it under 60 seconds for best engagement!