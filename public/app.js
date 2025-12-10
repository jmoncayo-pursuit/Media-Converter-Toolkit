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

// Initialize with GitHub README preset (GIF default)
applyPreset('github-readme');

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
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
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

    const format = document.querySelector('input[name="format"]:checked').value;
    const scale = document.getElementById('scale').value;
    const crf = document.getElementById('crf').value;
    const fps = document.getElementById('fps').value;

    const options = {
        scale: parseInt(scale),
        crf: parseInt(crf),
        fps: parseInt(fps)
    };

    // Hide sections
    conversionSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Show progress
    progressSection.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.textContent = 'Uploading and converting...';

    try {
        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('format', format);
        formData.append('options', JSON.stringify(options));

        // Simulate progress (since we can't track real FFmpeg progress easily)
        simulateProgress();

        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Conversion failed');
        }

        // Show success
        progressSection.style.display = 'none';
        showResult(data);

    } catch (error) {
        progressSection.style.display = 'none';
        showError(error.message || 'An error occurred during conversion');
    }
});

// Simulate progress (since FFmpeg progress is hard to track in real-time)
function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        progressBar.style.width = progress + '%';
        
        if (progress < 30) {
            progressText.textContent = 'Uploading file...';
        } else if (progress < 60) {
            progressText.textContent = 'Processing video...';
        } else if (progress < 90) {
            progressText.textContent = 'Optimizing output...';
        }
    }, 500);

    // Clear interval when conversion completes (handled in try/catch)
    setTimeout(() => clearInterval(interval), 60000);
}

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
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
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
    
    // Reset previews
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

