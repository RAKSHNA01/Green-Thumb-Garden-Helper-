function showChart(predictions) {
    const ctx = document.getElementById("confidenceChart");

    const labels = predictions.map(p => p.className);
    const data = predictions.map(p => (p.probability * 100).toFixed(2));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Prediction Confidence (%)',
                data: data
            }]
        },
        options: {
            responsive: true
        }
    });
}
