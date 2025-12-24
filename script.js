const imageUpload = document.getElementById("imageUpload");
const analyzeBtn = document.getElementById("analyzeBtn");
let uploadedImage;

imageUpload.addEventListener("change", () => {
    uploadedImage = imageUpload.files[0];
    analyzeBtn.disabled = false;
});

async function analyzePlant() {
    document.getElementById("result").classList.remove("hidden");

    const img = document.getElementById("resultImage");
    img.src = URL.createObjectURL(uploadedImage);

    img.onload = async () => {
        const predictions = await analyzeWithAI(img);

        document.getElementById("plantInfo").innerText =
            `Detected Object: ${predictions[0].className}
Confidence: ${(predictions[0].probability * 100).toFixed(2)}%`;

        showChart(predictions);

        loadCareTips();
    };
}

function loadCareTips() {
    const tips = [
        "Ensure adequate sunlight",
        "Water based on soil moisture",
        "Avoid overwatering",
        "Monitor leaf color for disease"
    ];

    const list = document.getElementById("careList");
    list.innerHTML = "";
    tips.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        list.appendChild(li);
    });
}
