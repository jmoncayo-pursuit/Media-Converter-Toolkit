#!/bin/bash

# KIM Video to GIF Conversion Script
# Converts MP4 demo to optimized animated GIF for GitHub autoplay

echo "🎬 Converting KIM Demo to Animated GIF"
echo "======================================"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Please install it first:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu: sudo apt install ffmpeg"
    exit 1
fi

# Check if source video exists
if [ ! -f "docs/images/kim-demo.mp4" ]; then
    echo "❌ Source video not found: docs/images/kim-demo.mp4"
    exit 1
fi

echo "📁 Found source video: docs/images/kim-demo.mp4"

# Get original file size
ORIGINAL_SIZE=$(du -h "docs/images/kim-demo.mp4" | cut -f1)
echo "📊 Original MP4 size: $ORIGINAL_SIZE"

# Step 1: Generate optimized palette
echo "🎨 Generating optimized color palette..."
ffmpeg -i docs/images/kim-demo.mp4 -vf "fps=12,scale=800:-1:flags=lanczos,palettegen=stats_mode=diff" docs/images/palette.png -y

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate palette"
    exit 1
fi

# Step 2: Create optimized GIF using the palette
echo "🔄 Converting to animated GIF..."
ffmpeg -i docs/images/kim-demo.mp4 -i docs/images/palette.png -filter_complex "fps=12,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" docs/images/kim-demo.gif -y

if [ $? -ne 0 ]; then
    echo "❌ Failed to create GIF"
    exit 1
fi

# Clean up palette file
rm docs/images/palette.png

# Check final file size
GIF_SIZE=$(du -h "docs/images/kim-demo.gif" | cut -f1)
GIF_SIZE_BYTES=$(du -b "docs/images/kim-demo.gif" | cut -f1)
GIF_SIZE_MB=$((GIF_SIZE_BYTES / 1024 / 1024))

echo ""
echo "✅ Conversion complete!"
echo "📊 Results:"
echo "   Original MP4: $ORIGINAL_SIZE"
echo "   Animated GIF: $GIF_SIZE"
echo "   File size: ${GIF_SIZE_MB}MB"

# Check if file size is acceptable
if [ $GIF_SIZE_MB -gt 10 ]; then
    echo "⚠️  Warning: GIF is larger than 10MB, may be slow to load on GitHub"
    echo "💡 Consider reducing frame rate or duration for better performance"
else
    echo "🎉 GIF size is optimal for GitHub display!"
fi

echo ""
echo "🚀 Ready to update README with animated GIF!"
echo "   The GIF will autoplay automatically in GitHub"