#!/bin/bash

# KIM Video Conversion Script
# Converts QuickTime movies to optimized web formats

echo "🎬 KIM Video Converter"
echo "====================="

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Please install it first:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu: sudo apt install ffmpeg"
    exit 1
fi

# Look for video files in docs/images/
INPUT_FILE=""
for ext in mov MOV mp4 MP4 avi AVI; do
    if [ -f "docs/images/kim-demo.$ext" ]; then
        INPUT_FILE="docs/images/kim-demo.$ext"
        break
    fi
done

if [ -z "$INPUT_FILE" ]; then
    echo "❌ No video file found. Please add your video as:"
    echo "   docs/images/kim-demo.mov (or .mp4, .avi)"
    exit 1
fi

echo "📁 Found video: $INPUT_FILE"

# Get file size
FILE_SIZE=$(du -h "$INPUT_FILE" | cut -f1)
echo "📊 Original size: $FILE_SIZE"

# Convert to optimized MP4
echo "🔄 Converting to MP4..."
ffmpeg -i "$INPUT_FILE" -vcodec h264 -acodec aac -crf 28 -vf scale=1280:-1 docs/images/kim-demo.mp4 -y

# Convert to WebM (smaller file size)
echo "🔄 Converting to WebM..."
ffmpeg -i "$INPUT_FILE" -c:v libvpx-vp9 -crf 35 -b:v 0 -vf scale=1280:-1 docs/images/kim-demo.webm -y

# Show results
echo ""
echo "✅ Conversion complete!"
echo "📊 File sizes:"
ls -lh docs/images/kim-demo.* | grep -E '\.(mp4|webm)$'

echo ""
echo "🎉 Ready to uncomment video sections in README.md!"
echo "   The videos will autoplay like GIFs in your documentation."