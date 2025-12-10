// FFmpeg.wasm loaded via UMD script tags (avoids worker CORS issues)
// FFmpegWASM and FFmpegUtil are available globally from CDN scripts

// FFmpeg instance
let ffmpeg = null;
let ffmpegLoaded = false;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFile');
const conversionSection = document.getElementById('conversionSection');
const convertBtn = document.getElementById('convertBtn');
const progressSection = document.getElementById('progressSection');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const downloadBtn = document.getElementById('downloadBtn');
const newConversionBtn = document.getElementById('newConversionBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const formatRadios = document.querySelectorAll('input[name="format"]');
const crfGroup = document.getElementById('crfGroup');
const fpsGroup = document.getElementById('fpsGroup');
const presetButtons = document.querySelectorAll('.preset-btn');
const presetDescription = document.getElementById('presetDescription');
const scaleSelect = document.getElementById('scale');
const crfSelect = document.getElementById('crf');
const fpsSelect = document.getElementById('fps');
const videoPreview = document.getElementById('videoPreview');
const gifPreview = document.getElementById('gifPreview');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const previewContainer = document.getElementById('previewContainer');

let selectedFile = null;
let currentPreset = 'github-readme';

// Preset configurations
const presets = {
    'github-readme': {
        format: 'gif',
        scale: '800',
        crf: '28',
        fps: '12',
        description: 'Optimized for GitHub README: GIF format, 800px width, 12fps. Perfect for autoplay in markdown!'
    },
    'web-optimized': {
        format: 'webm',
        scale: '1280',
        crf: '35',
        fps: '12',
        description: 'Web optimized: WebM format, 1280px width, smaller file size (CRF 35). Great for web pages!'
    },
    'custom': {
        format: 'gif',
        scale: '1280',
        crf: '28',
        fps: '12',
        description: 'Custom settings: Adjust options manually for your specific needs.'
    }
};

// Initialize FFmpeg
async function initFFmpeg() {
    if (ffmpegLoaded) return;
    
    // Ensure DOM elements are available
    if (!progressText || !progressBar) {
        console.error('DOM elements not ready');
        return;
    }
    
    try {
        progressText.textContent = 'Loading FFmpeg...';
        progressBar.style.width = '10%';
        
        // Create FFmpeg instance (from global UMD script)
        const { FFmpeg } = FFmpegWASM;
        ffmpeg = new FFmpeg();
        
        // Configure logging and progress
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        
        // Use older version (0.11.x) that works without SharedArrayBuffer/headers
        // This version doesn't require cross-origin isolation headers
        await ffmpeg.load({
            coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/umd/ffmpeg-core.js',
            wasmURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/umd/ffmpeg-core.wasm'
        });
        
        // Set up progress tracking
        ffmpeg.on('progress', ({ progress }) => {
            const percent = Math.round(progress * 100);
            progressBar.style.width = percent + '%';
            progressText.textContent = `Converting... ${percent}%`;
        });
        
        // FFmpeg is already loaded via load() call above
        ffmpegLoaded = true;
        progressBar.style.width = '100%';
        progressText.textContent = 'Ready!';
        
        console.log('FFmpeg loaded successfully');
    } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        showError('Failed to initialize FFmpeg. Please refresh the page.');
        throw error;
    }
}

// Apply preset
function applyPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;

    currentPreset = presetName;
    
    // Update format radio
    document.querySelector(`input[name="format"][value="${preset.format}"]`).checked = true;
    
    // Trigger format change to show/hide options
    formatRadios.forEach(radio => {
        if (radio.value === preset.format) {
            radio.dispatchEvent(new Event('change'));
        }
    });
    
    // Update selects
    scaleSelect.value = preset.scale;
    crfSelect.value = preset.crf;
    fpsSelect.value = preset.fps;
    
    // Update description
    presetDescription.textContent = preset.description;
    
    // Update button states
    presetButtons.forEach(btn => {
        if (btn.dataset.preset === presetName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show/hide advanced options based on preset
    const advancedDetails = document.querySelector('.advanced-options details');
    if (presetName === 'custom') {
        advancedDetails.open = true;
    } else {
        advancedDetails.open = false;
    }
}

// Preset button handlers
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        applyPreset(btn.dataset.preset);
    });
});

// Format change handler
formatRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        const format = radio.value;
        // Show/hide CRF and FPS options based on format
        if (format === 'gif') {
            crfGroup.style.display = 'none';
            fpsGroup.style.display = 'block';
        } else {
            crfGroup.style.display = 'block';
            fpsGroup.style.display = 'none';
        }
        
        // If custom preset, update description
        if (currentPreset === 'custom') {
            presetDescription.textContent = presets.custom.description;
        }
    });
});

// Update preset to custom when user manually changes options
[scaleSelect, crfSelect, fpsSelect].forEach(select => {
    select.addEventListener('change', () => {
        if (currentPreset !== 'custom') {
            applyPreset('custom');
        }
    });
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// File selection handler
function handleFileSelect(file) {
    // Validate file type
    const allowedExtensions = ['.mov', '.mp4', '.avi', '.mkv', '.webm'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
        showError('Invalid file type. Please select a video file (MOV, MP4, AVI, MKV, WebM).');
        return;
    }

    // Validate file size (500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
        showError('File is too large. Maximum size is 500MB.');
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    fileInfo.style.display = 'block';
    conversionSection.style.display = 'block';
    uploadArea.style.display = 'none';
    
    // Hide any previous results/errors
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Initialize FFmpeg in background (non-blocking)
    // Don't wait for it - let it load while user selects options
    if (!ffmpegLoaded) {
        initFFmpeg().catch(err => {
            console.error('FFmpeg initialization error:', err);
        });
    }
}

// Remove file handler
removeFileBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    conversionSection.style.display = 'none';
    uploadArea.style.display = 'block';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
});

// Convert button handler
convertBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    if (!ffmpegLoaded) {
        showError('FFmpeg is still loading. Please wait...');
        return;
    }

    const format = document.querySelector('input[name="format"]:checked').value;
    const scale = document.getElementById('scale').value;
    const crf = document.getElementById('crf').value;
    const fps = document.getElementById('fps').value;

    // Hide sections
    conversionSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Show progress
    progressSection.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.textContent = 'Preparing conversion...';

    try {
        // Get original filename
        const originalName = selectedFile.name;
        const originalBaseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const outputExt = format === 'gif' ? '.gif' : format === 'mp4' ? '.mp4' : '.webm';
        const outputFileName = `${originalBaseName}${outputExt}`;
        
        // Write input file to FFmpeg virtual filesystem
        progressText.textContent = 'Reading video file...';
        progressBar.style.width = '10%';
        
        // Use fetchFile from global FFmpegUtil
        const { fetchFile } = FFmpegUtil;
        await ffmpeg.writeFile('input', await fetchFile(selectedFile));
        
        progressBar.style.width = '20%';
        progressText.textContent = 'Converting...';
        
        // Build FFmpeg command based on format
        let command = ['-i', 'input'];
        
        if (format === 'gif') {
            // GIF conversion: two-pass with palette
            const paletteFile = 'palette.png';
            command = [
                '-i', 'input',
                '-vf', `fps=${fps},scale=${scale}:-1:flags=lanczos,palettegen=stats_mode=diff`,
                '-y', paletteFile
            ];
            
            await ffmpeg.exec(command);
            progressBar.style.width = '50%';
            progressText.textContent = 'Creating GIF...';
            
            command = [
                '-i', 'input',
                '-i', paletteFile,
                '-filter_complex', `fps=${fps},scale=${scale}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
                '-y', 'output.gif'
            ];
        } else if (format === 'mp4') {
            command = [
                '-i', 'input',
                '-vcodec', 'libx264',
                '-acodec', 'aac',
                `-crf`, crf,
                '-vf', `scale=${scale}:-1`,
                '-y', 'output.mp4'
            ];
        } else if (format === 'webm') {
            command = [
                '-i', 'input',
                '-c:v', 'libvpx-vp9',
                `-crf`, crf,
                '-b:v', '0',
                '-vf', `scale=${scale}:-1`,
                '-y', 'output.webm'
            ];
        }
        
        await ffmpeg.exec(command);
        
        progressBar.style.width = '90%';
        progressText.textContent = 'Finalizing...';
        
        // Read output file
        const outputFile = format === 'gif' ? 'output.gif' : format === 'mp4' ? 'output.mp4' : 'output.webm';
        const data = await ffmpeg.readFile(outputFile);
        
        // Create blob URL (data is already a Uint8Array)
        const blob = new Blob([data], { 
            type: format === 'gif' ? 'image/gif' : format === 'mp4' ? 'video/mp4' : 'video/webm' 
        });
        const url = URL.createObjectURL(blob);
        
        // Clean up FFmpeg files
        try {
            await ffmpeg.deleteFile('input');
            await ffmpeg.deleteFile(outputFile);
            if (format === 'gif') {
                await ffmpeg.deleteFile('palette.png');
            }
        } catch (e) {
            console.warn('Cleanup warning:', e);
        }
        
        progressBar.style.width = '100%';
        progressText.textContent = 'Complete!';
        
        // Show result
        const originalSize = selectedFile.size;
        const convertedSize = blob.size;
        const compressionRatio = ((1 - convertedSize / originalSize) * 100).toFixed(1);
        
        showResult({
            originalFile: {
                name: originalName,
                size: formatFileSize(originalSize)
            },
            convertedFile: {
                name: outputFileName,
                size: formatFileSize(convertedSize),
                url: url
            },
            compressionRatio: compressionRatio > 0 ? `${compressionRatio}%` : 'N/A'
        });

    } catch (error) {
        console.error('Conversion error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Provide more helpful error messages
        let errorMsg = 'An error occurred during conversion. ';
        if (error.message) {
            if (error.message.includes('not found') || error.message.includes('404')) {
                errorMsg += 'FFmpeg files failed to load. Please refresh the page.';
            } else if (error.message.includes('Worker') || error.message.includes('CORS')) {
                errorMsg += 'CORS error detected. Please try refreshing the page.';
            } else if (error.message.includes('Invalid') || error.message.includes('format')) {
                errorMsg += 'Invalid video format. Please try a different file.';
            } else {
                errorMsg += error.message;
            }
        } else {
            errorMsg += 'Make sure your video file is valid and try again.';
        }
        
        showError(errorMsg);
    } finally {
        progressSection.style.display = 'none';
    }
});

// Show result
function showResult(data) {
    document.getElementById('originalInfo').textContent = 
        `${data.originalFile.name} (${data.originalFile.size})`;
    document.getElementById('convertedInfo').textContent = 
        `${data.convertedFile.name} (${data.convertedFile.size})`;
    document.getElementById('compressionInfo').textContent = 
        data.compressionRatio || 'N/A';

    downloadBtn.href = data.convertedFile.url;
    downloadBtn.download = data.convertedFile.name;

    // Show preview
    showPreview(data.convertedFile.url, data.convertedFile.name);

    resultSection.style.display = 'block';
}

// Show preview based on file type
function showPreview(fileUrl, fileName) {
    // Hide all previews first
    videoPreview.style.display = 'none';
    gifPreview.style.display = 'none';
    previewPlaceholder.style.display = 'flex';
    
    const fileExt = fileName.split('.').pop().toLowerCase();
    
    if (fileExt === 'gif') {
        // Show GIF preview
        gifPreview.src = fileUrl;
        gifPreview.onload = () => {
            previewPlaceholder.style.display = 'none';
            gifPreview.style.display = 'block';
        };
        gifPreview.onerror = () => {
            previewPlaceholder.innerHTML = '<p>❌ Failed to load preview</p>';
        };
    } else if (fileExt === 'mp4' || fileExt === 'webm') {
        // Show video preview
        videoPreview.src = fileUrl;
        videoPreview.onloadeddata = () => {
            previewPlaceholder.style.display = 'none';
            videoPreview.style.display = 'block';
        };
        videoPreview.onerror = () => {
            previewPlaceholder.innerHTML = '<p>❌ Failed to load preview</p>';
        };
    } else {
        previewPlaceholder.innerHTML = '<p>Preview not available for this format</p>';
    }
}

// Show error
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    if (errorSection) {
        errorSection.style.display = 'block';
    }
    console.error('User-facing error:', message);
}

// New conversion handler
newConversionBtn.addEventListener('click', () => {
    resetUI();
});

tryAgainBtn.addEventListener('click', () => {
    resetUI();
});

function resetUI() {
    selectedFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    conversionSection.style.display = 'none';
    progressSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    uploadArea.style.display = 'block';
    
    // Reset previews and revoke blob URLs
    if (videoPreview.src && videoPreview.src.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview.src);
    }
    if (gifPreview.src && gifPreview.src.startsWith('blob:')) {
        URL.revokeObjectURL(gifPreview.src);
    }
    if (downloadBtn.href && downloadBtn.href.startsWith('blob:')) {
        URL.revokeObjectURL(downloadBtn.href);
    }
    
    videoPreview.src = '';
    gifPreview.src = '';
    videoPreview.style.display = 'none';
    gifPreview.style.display = 'none';
    previewPlaceholder.style.display = 'flex';
    previewPlaceholder.innerHTML = '<p>Loading preview...</p>';
    
    // Reset to GitHub README preset
    applyPreset('github-readme');
}

// Utility function
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize preset
        applyPreset('github-readme');
        // Start loading FFmpeg immediately (non-blocking)
        initFFmpeg().catch(err => {
            console.warn('FFmpeg preload failed, will retry on file select:', err);
        });
    });
} else {
    // DOM already loaded
    applyPreset('github-readme');
    // Start loading FFmpeg immediately (non-blocking)
    initFFmpeg().catch(err => {
        console.warn('FFmpeg preload failed, will retry on file select:', err);
    });
}

