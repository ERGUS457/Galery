// --- Konfigurasi ---
// PASTE URL WEB APP GOOGLE SCRIPT DI BAWAH INI SETELAH DEPLOY
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycdxGH_aFrYqVKW9OfQ7pGWDs5MC82NHHM5kvAai-Rh4IVA3mdJHqe-WcQK8ffSxiifw/exec'; // Contoh: 'https://script.google.com/macros/s/AIzaSy.../exec'

// --- Elemen DOM ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');

const addBtn = document.getElementById('add-btn');
const uploadModal = document.getElementById('upload-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelUploadBtn = document.getElementById('cancel-upload');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const imageNameInput = document.getElementById('image-name');
const submitUploadBtn = document.getElementById('submit-upload');
const uploadSpinner = document.getElementById('upload-spinner');
const btnText = document.querySelector('.btn-text');
const urlWarning = document.getElementById('url-warning');

const galleryGrid = document.getElementById('gallery-grid');
const loadingGallery = document.getElementById('loading-gallery');

const viewModal = document.getElementById('view-modal');
const closeViewBtn = document.getElementById('close-view');
const fullImage = document.getElementById('full-image');
const fullImageTitle = document.getElementById('full-image-title');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

let selectedFile = null;

// --- Tema (Theme Selector) ---
const currentTheme = localStorage.getItem('ethereal-theme') || 'ocean';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggleBtn.addEventListener('click', () => {
    themeMenu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!themeToggleBtn.contains(e.target) && !themeMenu.contains(e.target)) {
        themeMenu.classList.add('hidden');
    }
});

themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ethereal-theme', theme);
        themeMenu.classList.add('hidden');
    });
});

// --- Modal Controls ---
const openModal = (modal) => {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.firstElementChild.style.transform = 'scale(1)';
        modal.style.opacity = '1';
    }, 10);
};

const closeModal = (modal) => {
    modal.firstElementChild.style.transform = 'scale(0.95)';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

addBtn.addEventListener('click', () => {
    openModal(uploadModal);
    
    // Check if SCRIPT_URL is set
    if (!SCRIPT_URL || SCRIPT_URL.trim() === '') {
        urlWarning.classList.remove('hidden');
        submitUploadBtn.disabled = true;
    } else {
        urlWarning.classList.add('hidden');
        if (selectedFile) submitUploadBtn.disabled = false;
    }
});
closeModalBtn.addEventListener('click', () => closeModal(uploadModal));
cancelUploadBtn.addEventListener('click', () => closeModal(uploadModal));
closeViewBtn.addEventListener('click', () => closeModal(viewModal));

// --- Drag and Drop File ---
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--p-2)';
    dropZone.style.background = 'var(--glass-border)';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--p-1)';
    dropZone.style.background = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--p-1)';
    dropZone.style.background = 'transparent';
    
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.match('image.*')) {
        showToast('Tolong pilih file gambar', 'error');
        return;
    }

    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
        if (SCRIPT_URL && SCRIPT_URL.trim() !== '') {
            submitUploadBtn.disabled = false;
        }
    };
    reader.readAsDataURL(file);
}

// --- Upload Process ---
submitUploadBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    submitUploadBtn.disabled = true;
    btnText.textContent = 'Mengunggah...';
    uploadSpinner.classList.remove('hidden');

    try {
        const base64Data = await convertToBase64(selectedFile);
        const filename = imageNameInput.value.trim() || selectedFile.name;

        const payload = {
            base64: base64Data,
            filename: filename,
            mimeType: selectedFile.type
        };

        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            mode: 'no-cors' // Mencegah error CORS karena Apps Script meredirect POST
        });

        // Karena menggunakan no-cors, kita mengasumsikan upload berhasil 
        // selama request tidak memunculkan network error.
        showToast('Gambar berhasil diunggah!');
        closeModal(uploadModal);
        
        // Reset form
        selectedFile = null;
        fileInput.value = '';
        imagePreview.src = '';
        imagePreview.classList.add('hidden');
        imageNameInput.value = '';
        
        // Reload gallery setelah sedikit delay agar Google Drive memproses file
        setTimeout(loadGallery, 2000);

    } catch (error) {
        console.error('Upload Error:', error);
        showToast('Terjadi kesalahan saat mengunggah', 'error');
    } finally {
        btnText.textContent = 'Unggah Sekarang';
        uploadSpinner.classList.add('hidden');
        if (selectedFile) submitUploadBtn.disabled = false;
    }
});

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// --- Load Gallery ---
async function loadGallery() {
    if (!SCRIPT_URL || SCRIPT_URL.trim() === '') {
        loadingGallery.innerHTML = '<p>URL Google Script belum diset. Tidak bisa memuat galeri.</p>';
        return;
    }

    galleryGrid.innerHTML = '';
    galleryGrid.appendChild(loadingGallery);
    loadingGallery.classList.remove('hidden');

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        loadingGallery.classList.add('hidden');

        if (data.success && data.files && data.files.length > 0) {
            data.files.forEach(file => {
                const card = document.createElement('div');
                card.className = 'img-card';
                card.innerHTML = `
                    <img src="${file.url}" alt="Memories" loading="lazy">
                `;
                
                card.addEventListener('click', () => {
                    fullImage.src = file.url;
                    fullImageTitle.textContent = "";
                    openModal(viewModal);
                });
                
                galleryGrid.appendChild(card);
            });
        } else {
            galleryGrid.innerHTML = '<div class="loading-state"><p>Galeri masih kosong. Mulai tambahkan kenanganmu!</p></div>';
        }

    } catch (error) {
        console.error('Load Error:', error);
        loadingGallery.innerHTML = `
            <div class="url-setup-warning" style="margin-top:2rem">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Gagal memuat galeri. Pastikan URL Google Script benar dan dapat diakses publik.</p>
            </div>
        `;
    }
}

// --- Notifications ---
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toast.style.background = '#ef4444';
        toast.style.color = 'white';
        toastIcon.className = 'fa-solid fa-circle-xmark';
    } else {
        toast.style.background = 'var(--text-main)';
        toast.style.color = 'var(--bg-color)';
        toastIcon.className = 'fa-solid fa-circle-check';
    }

    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadGallery);
