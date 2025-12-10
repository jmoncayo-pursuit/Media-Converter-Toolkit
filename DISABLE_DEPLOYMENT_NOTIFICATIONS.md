# Disable GitHub Pages Deployment Notifications

If you're receiving too many email notifications about GitHub Pages deployments, here's how to disable them:

## Option 1: Disable via GitHub Web Interface (Recommended)

1. Go to your repository: https://github.com/jmoncayo-pursuit/Media-Converter-Toolkit
2. Click **Settings** (top right of the repository)
3. Scroll down to **Notifications** section
4. Under **Deployments**, uncheck **Email** notifications
5. Click **Save**

## Option 2: Disable All Repository Email Notifications

1. Go to https://github.com/settings/notifications
2. Scroll to **Repository activity** section
3. Uncheck **Deployments** or disable email notifications entirely for this repository

## Option 3: Use GitHub Notification Filters

1. Go to https://github.com/settings/notifications
2. Under **Filtering**, you can set up filters to automatically archive deployment notifications
3. Or mark deployment emails as read automatically

## Quick Fix: Reduce Deployment Frequency

Alternatively, you can reduce the number of deployments by:
- Batching multiple changes into single commits
- Only deploying when you have significant updates
- Using the `QUICK_DEPLOY.sh` script less frequently

The notifications are sent because GitHub Pages automatically deploys every time you push to the `gh-pages` branch, which we've been doing frequently during troubleshooting.

