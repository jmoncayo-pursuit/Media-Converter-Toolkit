const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure uploads and outputs directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const outputsDir = path.join(__dirname, 'outputs');

[uploadsDir, outputsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Preserve original filename with timestamp prefix to avoid conflicts
    const timestamp = Date.now();
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${originalName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(mov|MOV|mp4|MP4|avi|AVI|mkv|MKV|webm|WEBM)$/;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  }
});

// Helper function to get file size
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload and convert endpoint
app.post('/api/convert', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { format, options } = req.body;
  const inputPath = req.file.path;
  const originalSize = getFileSize(inputPath);
  
  // Get original filename - req.file.originalname contains the original filename from client
  const originalName = req.file.originalname;
  console.log('=== FILE NAMING DEBUG ===');
  console.log('req.file.originalname:', originalName);
  console.log('req.file.filename:', req.file.filename);
  
  // Extract base name without extension - use originalName directly
  let originalBaseName = path.basename(originalName, path.extname(originalName));
  console.log('Extracted base name:', originalBaseName);
  
  // Keep spaces and most characters - only remove truly problematic filesystem characters
  // Problematic chars: / \ : * ? " < > |
  let baseName = originalBaseName
    .replace(/[/\\:*?"<>|]/g, '_')      // Replace only problematic filesystem chars
    .trim();                            // Remove leading/trailing spaces
  
  // If empty after sanitization, use a default
  if (!baseName || baseName.length === 0) {
    baseName = 'converted';
  }
  
  console.log('Final base name:', baseName);
  console.log('========================');
  
  // Determine output extension based on format
  let outputExt;
  switch (format) {
    case 'mp4':
      outputExt = '.mp4';
      break;
    case 'webm':
      outputExt = '.webm';
      break;
    case 'gif':
      outputExt = '.gif';
      break;
    default:
      throw new Error('Invalid format specified');
  }
  
  // Handle filename conflicts BEFORE conversion by appending a number if file exists
  let outputFileName = `${baseName}${outputExt}`;
  let outputPath = path.join(outputsDir, outputFileName);
  let counter = 1;
  while (fs.existsSync(outputPath)) {
    outputFileName = `${baseName}_${counter}${outputExt}`;
    outputPath = path.join(outputsDir, outputFileName);
    counter++;
  }

  try {
    // Convert with the final filename
    switch (format) {
      case 'mp4':
        await convertToMP4(inputPath, outputPath, options);
        break;
      
      case 'webm':
        await convertToWebM(inputPath, outputPath, options);
        break;
      
      case 'gif':
        await convertToGIF(inputPath, outputPath, options);
        break;
      
      default:
        throw new Error('Invalid format specified');
    }

    const outputSize = getFileSize(outputPath);
    const compressionRatio = ((1 - outputSize / originalSize) * 100).toFixed(1);

    res.json({
      success: true,
      originalFile: {
        name: req.file.originalname,
        size: formatFileSize(originalSize)
      },
      convertedFile: {
        name: outputFileName,
        size: formatFileSize(outputSize),
        url: `/api/download/${encodeURIComponent(outputFileName)}`
      },
      compressionRatio: compressionRatio > 0 ? `${compressionRatio}%` : 'N/A'
    });

    // Clean up input file after conversion
    fs.unlinkSync(inputPath);

  } catch (error) {
    // Clean up on error
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    
    res.status(500).json({
      error: 'Conversion failed',
      message: error.message
    });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(outputsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Use original filename for download (preserve the name)
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Download failed' });
    }
  });
});

// Cleanup old files endpoint
app.post('/api/cleanup', (req, res) => {
  try {
    const files = fs.readdirSync(outputsDir);
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(outputsDir, file);
      const stats = fs.statSync(filePath);
      const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
      
      // Delete files older than 24 hours
      if (ageInHours > 24) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    res.json({ success: true, deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Conversion functions
function convertToMP4(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const crf = options.crf || 28;
    const scale = options.scale || 1280;
    
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(`-crf ${crf}`)
      .size(`${scale}x?`)
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + Math.round(progress.percent) + '% done');
      })
      .on('end', () => {
        console.log('MP4 conversion finished');
        resolve();
      })
      .on('error', (err) => {
        console.error('MP4 conversion error:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

function convertToWebM(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const crf = options.crf || 35;
    const scale = options.scale || 1280;
    
    ffmpeg(inputPath)
      .videoCodec('libvpx-vp9')
      .outputOptions(`-crf ${crf}`)
      .outputOptions('-b:v 0')
      .size(`${scale}x?`)
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + Math.round(progress.percent) + '% done');
      })
      .on('end', () => {
        console.log('WebM conversion finished');
        resolve();
      })
      .on('error', (err) => {
        console.error('WebM conversion error:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

function convertToGIF(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const fps = options.fps || 12;
    const scale = options.scale || 800;
    const palettePath = path.join(outputsDir, `palette-${Date.now()}.png`);
    
    // Step 1: Generate palette
    ffmpeg(inputPath)
      .videoFilters([
        `fps=${fps}`,
        `scale=${scale}:-1:flags=lanczos`,
        'palettegen=stats_mode=diff'
      ])
      .on('end', () => {
        // Step 2: Create GIF using palette
        ffmpeg(inputPath)
          .complexFilter([
            `fps=${fps},scale=${scale}:-1:flags=lanczos[x]`,
            `[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`
          ])
          .input(palettePath)
          .on('start', (commandLine) => {
            console.log('FFmpeg command:', commandLine);
          })
          .on('progress', (progress) => {
            console.log('Processing: ' + Math.round(progress.percent) + '% done');
          })
          .on('end', () => {
            // Clean up palette
            if (fs.existsSync(palettePath)) {
              fs.unlinkSync(palettePath);
            }
            console.log('GIF conversion finished');
            resolve();
          })
          .on('error', (err) => {
            if (fs.existsSync(palettePath)) {
              fs.unlinkSync(palettePath);
            }
            console.error('GIF conversion error:', err);
            reject(err);
          })
          .save(outputPath);
      })
      .on('error', (err) => {
        console.error('Palette generation error:', err);
        reject(err);
      })
      .save(palettePath);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Media Converter Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`📁 Outputs directory: ${outputsDir}`);
});

