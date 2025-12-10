#!/bin/bash

# KIM Video Activation Script
# Converts video and activates it in documentation

echo "🚀 KIM Video Activation"
echo "======================"

# Run the conversion script
./scripts/convert-video.sh

if [ $? -ne 0 ]; then
    echo "❌ Video conversion failed"
    exit 1
fi

echo ""
echo "📝 Activating video in README.md..."

# Uncomment the main demo video section
sed -i '' 's/<!-- Uncomment when video is added:/<!-- Video activated:/' README.md
sed -i '' 's/-->/-->/' README.md

# Remove the placeholder text
sed -i '' '/\*Add your demo video as/d' README.md

# Uncomment the pairing demo video section
sed -i '' 's/<!-- Video demonstration of the complete flow:/<!-- Video demonstration:/' README.md

echo "✅ Video activated in documentation!"
echo ""
echo "🎬 Your video is now live in:"
echo "   - Main demo section (800px width)"
echo "   - Quick Start section (600px width)"
echo ""
echo "🌐 The videos will autoplay, loop, and work like GIFs!"