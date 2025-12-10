# Media Converter Toolkit

A client-side media conversion tool that runs entirely in your browser. Convert videos to optimized web formats (MP4, WebM, GIF) using FFmpeg.wasm - no server required!

## Features

- 🎬 **Multiple Formats**: Convert to MP4, WebM, or animated GIF
- 🎨 **Optimized Output**: Automatic compression and optimization
- 📱 **Modern UI**: Beautiful, responsive web interface
- 🚀 **Client-Side**: Everything runs in your browser - no server needed!
- ⚙️ **Customizable**: Adjust quality, resolution, and frame rate
- 📝 **GitHub README Preset**: Optimized settings for GitHub documentation

## Hosting on GitHub Pages

This is a single-page application that can be hosted on GitHub Pages:

1. **Create a GitHub repository**
2. **Copy the files** from the `gh-pages` folder to your repository root
3. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Select your branch (usually `main`)
   - Save
4. **Your app will be live** at `https://<username>.github.io/<repository-name>/`

## Files Structure

```
gh-pages/
├── index.html      # Main HTML page
├── styles.css      # Styling
├── app.js          # Client-side conversion logic using FFmpeg.wasm
└── README.md       # This file
```

## How It Works

- Uses [FFmpeg.wasm](https://ffmpeg.wasm.org/) - a WebAssembly port of FFmpeg
- All processing happens in your browser
- No data is sent to any server - completely private
- Files are processed locally using your device's resources

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (may be slower)
- Mobile browsers: ⚠️ Limited (large files may cause issues)

## Limitations

- File size: Recommended max 100MB for best performance
- Processing time: Depends on your device's CPU
- Memory: Large files may require significant RAM

## License

MIT

