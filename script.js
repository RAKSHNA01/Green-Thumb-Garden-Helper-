const imageUpload = document.getElementById("imageUpload");
const analyzeBtn = document.getElementById("analyzeBtn");
let uploadedImage;

imageUpload.addEventListener("change", () => {
    uploadedImage = imageUpload.files[0];
    if (uploadedImage) {
        analyzeBtn.disabled = false;
        alert("Image uploaded successfully 🌿");
    }
});

function analyzePlant() {
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("resultImage").src =
        URL.createObjectURL(uploadedImage);

    document.getElementById("plantInfo").innerText =
        "Plant Name: Tulsi (Holy Basil)\nType: Medicinal Plant\nHealth: Healthy 🌱";

    const tips = [
        "Provide 5–6 hours of sunlight daily",
        "Water regularly but avoid waterlogging",
        "Use well-drained soil",
        "Prune dead leaves weekly"
    ];

    const list = document.getElementById("careList");
    list.innerHTML = "";
    tips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        list.appendChild(li);
    });
}
