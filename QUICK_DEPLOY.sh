#!/bin/bash

# Quick Deploy Script for GitHub Pages
# This script helps deploy the gh-pages version to GitHub Pages

echo "🚀 GitHub Pages Deployment Helper"
echo "=================================="
echo ""

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Please run 'git init' first."
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Ask user what they want to do
echo "Choose deployment method:"
echo "1) Deploy gh-pages folder to gh-pages branch (Recommended)"
echo "2) Just show GitHub Pages setup instructions"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "📦 Creating gh-pages branch..."
    
    # Check if gh-pages branch exists
    if git show-ref --verify --quiet refs/heads/gh-pages; then
        echo "⚠️  gh-pages branch already exists. Switching to it..."
        git checkout gh-pages
    else
        echo "✨ Creating new gh-pages branch..."
        git checkout -b gh-pages
    fi
    
    echo ""
    echo "📋 Copying gh-pages files to root..."
    cp -r gh-pages/* .
    
    echo ""
    echo "📝 Staging files..."
    git add .
    
    echo ""
    echo "💾 Committing changes..."
    git commit -m "Deploy GitHub Pages version" || echo "No changes to commit"
    
    echo ""
    echo "🚀 Pushing to GitHub..."
    git push origin gh-pages
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📌 Next steps:"
    echo "1. Go to: https://github.com/jmoncayo-pursuit/Media-Converter-Toolkit/settings/pages"
    echo "2. Under 'Source', select:"
    echo "   - Branch: gh-pages"
    echo "   - Folder: / (root)"
    echo "3. Click Save"
    echo ""
    echo "🌐 Your site will be live at:"
    echo "   https://jmoncayo-pursuit.github.io/Media-Converter-Toolkit/"
    echo ""
    echo "⏱️  Wait 1-2 minutes for GitHub to build your site"
    
    # Switch back to main branch
    echo ""
    read -p "Switch back to main branch? (y/n): " switch_back
    if [ "$switch_back" == "y" ]; then
        git checkout $CURRENT_BRANCH
        echo "✅ Switched back to $CURRENT_BRANCH"
    fi
    
elif [ "$choice" == "2" ]; then
    echo ""
    echo "📖 GitHub Pages Setup Instructions:"
    echo "===================================="
    echo ""
    echo "1. Go to your repository settings:"
    echo "   https://github.com/jmoncayo-pursuit/Media-Converter-Toolkit/settings/pages"
    echo ""
    echo "2. Under 'Source', select:"
    echo "   - Branch: main (or gh-pages if you deployed that branch)"
    echo "   - Folder: / (root)"
    echo ""
    echo "3. Click 'Save'"
    echo ""
    echo "4. Wait 1-2 minutes for GitHub to build"
    echo ""
    echo "5. Your site will be live at:"
    echo "   https://jmoncayo-pursuit.github.io/Media-Converter-Toolkit/"
    echo ""
else
    echo "❌ Invalid choice"
    exit 1
fi

