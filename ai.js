let model;

async function loadModel() {
    model = await mobilenet.load();
    console.log("AI model loaded");
}

loadModel();

async function analyzeWithAI(imgElement) {
    const predictions = await model.classify(imgElement);
    return predictions;
}
