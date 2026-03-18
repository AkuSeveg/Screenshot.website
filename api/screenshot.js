const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });

    const { url, width = 1280, height = 720, full_page = false, device_scale = 2 } = req.body;

    try {
        if (!url || !url.startsWith('http')) {
            throw new Error('URL tidak valid. Gunakan awalan https://');
        }

        // 1. Generate HD Screenshot & Shareable Link
        const { data: imgData } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
            url: url,
            browserWidth: parseInt(width),
            browserHeight: parseInt(height),
            fullPage: full_page === true || full_page === 'true',
            deviceScaleFactor: parseInt(device_scale), 
            format: 'png'
        }, {
            headers: {
                'content-type': 'application/json',
                referer: 'https://imagy.app/full-page-screenshot-taker/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!imgData.fileUrl) throw new Error('Gagal mendapatkan gambar dari server.');
        
        const shareableLink = imgData.fileUrl; 
        let extractedText = "Sedang memproses teks...";

        // 2. Ekstrak Teks (OCR) via Public API
        try {
            const ocrRes = await axios.get(`https://api.ocr.space/parse/imageurl?apikey=helloworld&url=${encodeURIComponent(shareableLink)}`);
            
            if (ocrRes.data && ocrRes.data.ParsedResults && ocrRes.data.ParsedResults.length > 0) {
                extractedText = ocrRes.data.ParsedResults[0].ParsedText.trim() || "Tidak ada teks terdeteksi.";
            } else {
                extractedText = "Gagal memindai teks.";
            }
        } catch (error) {
            extractedText = "Fitur OCR sedang sibuk.";
        }

        // 3. Final Response
        return res.status(200).json({ 
            success: true, 
            image_url: shareableLink,     
            extracted_text: extractedText, 
            creator: "Yoanz"       
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};