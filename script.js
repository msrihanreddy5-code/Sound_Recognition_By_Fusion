// DOM Elements
const uploadView = document.getElementById('upload-view');
const activeView = document.getElementById('active-view');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

const fileNameEl = document.getElementById('file-name');
const fileSizeEl = document.getElementById('file-size');
const audioPlayer = document.getElementById('audio-player');
const removeBtn = document.getElementById('remove-btn');

const classifyBtn = document.getElementById('classify-btn');
const processingState = document.getElementById('processing-state');
const completedState = document.getElementById('completed-state');
const progressBar = document.getElementById('progress-bar');
const statusMessage = document.getElementById('status-message');

const resultCategory = document.getElementById('result-category');
const resultConfidence = document.getElementById('result-confidence');
const resetBtn = document.getElementById('reset-btn');

let currentFileURL = null;

// --- Upload Logic ---

// Click to upload
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// Drag and drop events
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-indigo-500', 'bg-indigo-500/10');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (file.name.endsWith('.wav') || file.name.endsWith('.mp3') || file.type.includes('audio')) {
        // Show active view, hide upload view
        uploadView.classList.add('hidden');
        activeView.classList.remove('hidden');

        // Reset UI state
        classifyBtn.classList.remove('hidden');
        processingState.classList.add('hidden');
        completedState.classList.add('hidden');
        progressBar.style.width = '0%';

        // Populate file info
        fileNameEl.textContent = file.name;
        fileSizeEl.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';

        // Set audio player URL
        if (currentFileURL) {
            URL.revokeObjectURL(currentFileURL);
        }
        currentFileURL = URL.createObjectURL(file);
        audioPlayer.src = currentFileURL;
    } else {
        alert("Please upload a .wav or .mp3 file.");
    }
}

// Remove File
removeBtn.addEventListener('click', () => {
    resetApp();
});

// --- Classification Logic (Mocking SResNet pipeline) ---

classifyBtn.addEventListener('click', () => {
    // Hide classify button, show processing state
    classifyBtn.classList.add('hidden');
    processingState.classList.remove('hidden');
    
    // Reset progress bar width to 0 first
    progressBar.style.width = '0%';
    
    // Status 0s
    statusMessage.textContent = "Applying STES for endpoint detection...";

    // Start progress bar animation (needs a slight delay for DOM to register 0% first)
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 50);

    // Status 1.5s
    setTimeout(() => {
        statusMessage.textContent = "Generating Mel-spectrogram (Linear Features)...";
    }, 1500);

    // Status 3s
    setTimeout(() => {
        statusMessage.textContent = "Constructing Recurrence Plot (Nonlinear Features)...";
    }, 3000);

    // Status 4.5s
    setTimeout(() => {
        statusMessage.textContent = "Fusing features via DMFF in SResNet...";
    }, 4500);

    // Status 6s (Complete)
    setTimeout(() => {
        // Hide processing, show results
        processingState.classList.add('hidden');
        completedState.classList.remove('hidden');

        // Generate mock results
        const categories = ['Dog Bark', 'Engine Idling', 'Street Music', 'Car Horn'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomConfidence = (Math.random() * (98.39 - 97.82) + 97.82).toFixed(2);

        resultCategory.textContent = randomCategory;
        resultConfidence.textContent = randomConfidence + '%';
    }, 6000);
});

// --- Reset Logic ---

resetBtn.addEventListener('click', resetApp);

function resetApp() {
    // Hide active view, show upload view
    activeView.classList.add('hidden');
    uploadView.classList.remove('hidden');
    
    // Reset file input
    fileInput.value = '';

    // Cleanup URL
    if (currentFileURL) {
        URL.revokeObjectURL(currentFileURL);
        currentFileURL = null;
    }
    audioPlayer.src = '';
}
