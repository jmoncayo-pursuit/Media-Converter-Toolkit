# Media Converter Toolkit

A web-based media conversion tool that converts videos to optimized web formats (MP4, WebM, GIF) using FFmpeg.

## Features

- 🎬 **Multiple Formats**: Convert to MP4, WebM, or animated GIF
- 🎨 **Optimized Output**: Automatic compression and optimization
- 📱 **Modern UI**: Beautiful, responsive web interface
- 🚀 **Easy to Use**: Drag & drop or click to upload
- ⚙️ **Customizable**: Adjust quality, resolution, and frame rate

## Prerequisites

- **Node.js** (v14 or higher)
- **FFmpeg** installed on your system

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use:
```bash
choco install ffmpeg
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Start the Web Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Using the Web Interface

1. Open your browser and navigate to `http://localhost:3000`
2. Drag & drop a video file or click to browse
3. Select your desired output format (MP4, WebM, or GIF)
4. (Optional) Adjust advanced options:
   - Resolution width
   - Quality (CRF)
   - Frame rate (for GIFs)
5. Click "Convert Video"
6. Download your converted file when ready

### Supported Input Formats

- MOV (QuickTime)
- MP4
- AVI
- MKV
- WebM

### Output Formats

- **MP4**: H.264 encoded, optimized for web playback
- **WebM**: VP9 encoded, often smaller file sizes
- **GIF**: Animated GIF with optimized palette, perfect for GitHub

## Original Shell Scripts

The original command-line scripts are still available:

- `convert-video.sh` - Convert video to MP4 and WebM
- `convert-to-gif.sh` - Convert MP4 to animated GIF
- `activate-video.sh` - Convert and activate video in documentation

## Project Structure

```
media-converter-toolkit/
├── server.js              # Express backend server
├── package.json           # Node.js dependencies
├── public/                # Frontend files
│   ├── index.html         # Main HTML page
│   ├── styles.css         # Styling
│   └── app.js            # Frontend JavaScript
├── uploads/              # Temporary upload directory (auto-created)
├── outputs/              # Converted files directory (auto-created)
└── *.sh                  # Original shell scripts
```

## API Endpoints

- `POST /api/convert` - Upload and convert a video file
- `GET /api/download/:filename` - Download a converted file
- `POST /api/cleanup` - Clean up old files (older than 24 hours)

## Notes

- Maximum file size: 500MB
- Converted files are automatically cleaned up after 24 hours
- The web interface provides a more user-friendly alternative to the command-line scripts

## License

MIT

