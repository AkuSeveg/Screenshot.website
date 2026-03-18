// Konfigurasi API - Jangan diubah
const API_URL = '/api/screenshot';

// Element Selection Bawaan
const form = document.getElementById('ss-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result-area');
const resultImg = document.getElementById('result-img');
const downloadBtn = document.getElementById('download-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// Tambahan Element Baru untuk Fitur OCR & Share Link
const extractedTextArea = document.getElementById('extracted-text'); 
const shareLinkInput = document.getElementById('share-link');
const copyLinkBtn = document.getElementById('copy-link-btn');

// Event Listener Form
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    setLoading(true);
    resultArea.style.display = 'none';

    const payload = {
        url: document.getElementById('url').value,
        width: parseInt(document.getElementById('width').value) || 1280,
        height: parseInt(document.getElementById('height').value) || 720,
        device_scale: parseInt(document.getElementById('scale').value) || 2, // Paksa HD
        full_page: document.getElementById('fullpage').checked
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            // Lempar url gambar dan teks OCR ke fungsi UI
            handleSuccess(data.image_url, data.extracted_text);
        } else {
            alert('Gagal mengambil screenshot. Error: ' + (data.message || 'Tidak diketahui'));
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi saat menghubungi server.');
    } finally {
        setLoading(false);
    }
});

// Fungsi UI Helper
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        loader.style.display = 'block';
        btnText.textContent = 'PROSES...';
        if (extractedTextArea) extractedTextArea.value = 'Sedang mengekstrak teks dari gambar...';
    } else {
        submitBtn.disabled = false;
        loader.style.display = 'none';
        btnText.textContent = 'AMBIL SCREENSHOT';
    }
}

// Menampilkan Hasil
function handleSuccess(url, text) {
    resultImg.src = url;
    
    // Nampilin Link & Teks OCR ke Form Input
    if (shareLinkInput) shareLinkInput.value = url;
    if (extractedTextArea) extractedTextArea.value = text;
    
    resultArea.style.display = 'block';
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Fitur Copy Link Shareable
if (copyLinkBtn && shareLinkInput) {
    copyLinkBtn.addEventListener('click', () => {
        shareLinkInput.select();
        document.execCommand('copy');
        
        const originalText = copyLinkBtn.innerText;
        copyLinkBtn.innerText = 'Tersalin!';
        setTimeout(() => copyLinkBtn.innerText = originalText, 2000);
    });
}

// UPDATE FITUR DOWNLOAD OTOMATIS
downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const imageUrl = resultImg.src;
    const originalText = downloadBtn.innerHTML;
    
    downloadBtn.innerHTML = `<div class="loader" style="display:inline-block; border-color: black; border-bottom-color: transparent;"></div> MENGUNDUH...`;
    downloadBtn.disabled = true;
    
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const tempUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = tempUrl;
        
        const timestamp = new Date().getTime();
        // NAMA FILE
        a.download = `yoanz-capture-${timestamp}.png`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(tempUrl);
    } catch (err) {
        console.error("Gagal auto-download, fallback ke tab baru", err);
        window.open(imageUrl, '_blank');
    } finally {
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
});

// Sidebar Toggle Logic
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}