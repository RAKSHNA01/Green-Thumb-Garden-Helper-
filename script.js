// Get your FREE Gemini API key: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Replace with your key

const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('result');
const plantName = document.getElementById('plantName');
const resultImage = document.getElementById('resultImage');
const diagnosisText = document.getElementById('diagnosisText');
const careList = document.getElementById('careList');
const newScanBtn = document.getElementById('newScan');

let selectedImage = null;

// Drag & drop + click upload
uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) handleImage(files[0]);
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleImage(e.target.files[0]);
});

function handleImage(file) {
    if (file.type.startsWith('image/')) {
        selectedImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.querySelector('.upload-icon').textContent = '✅';
            document.querySelector('.upload-area p').textContent = file.name;
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze Plant →';
        };
        reader.readAsDataURL(file);
    }
}

analyzeBtn.addEventListener('click', async () => {
    if (!selectedImage || !GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        alert('Please add your Gemini API key first!
1. Go to https://aistudio.google.com/app/apikey
2. Replace YOUR_GEMINI_API_KEY_HERE');
        return;
    }

    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;

    try {
        const base64Image = await fileToBase64(selectedImage);
        const result = await analyzePlant(base64Image);
        
        // Show result
        resultImage.src = URL.createObjectURL(selectedImage);
        plantName.textContent = result.plant || 'Plant Identified';
        diagnosisText.textContent = result.diagnosis;
        
        careList.innerHTML = result.careTips.map(tip => `<li>${tip}</li>`).join('');
        resultSection.classList.remove('hidden');
        
        document.getElementById('hero').style.display = 'none';
    } catch (error) {
        alert('Analysis failed. Check console for details.');
        console.error(error);
    } finally {
        analyzeBtn.textContent = 'Analyze Plant →';
        analyzeBtn.disabled = false;
    }
});

newScanBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    document.getElementById('hero').style.display = 'block';
    document.querySelector('.upload-icon').textContent = '📷';
    document.querySelector('.upload-area p').textContent = 'Drag & drop leaf image or click to upload';
    analyzeBtn.disabled = true;
    URL.revokeObjectURL(resultImage.src);
    selectedImage = null;
    imageInput.value = '';
});

// Gemini API Call
async function analyzePlant(base64Image) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [
                    {
                        text: "Analyze this plant leaf image. Respond in JSON format with: {"plant":"species name","diagnosis":"health status + issues","careTips":["tip1","tip2","tip3"]} Be specific about diseases/pests if visible."
                    },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image.split(',')[1]
                        }
                    }
                ]
            }]
        })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse JSON response
    try {
        return JSON.parse(text);
    } catch {
        // Fallback parsing
        return {
            plant: "Common plant species",
            diagnosis: text.slice(0, 200) + "...",
            careTips: ["Water regularly", "Ensure good sunlight", "Check for pests"]
        };
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
