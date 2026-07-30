document.getElementById('prediction-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        experience: document.getElementById('experience').value,
        salary: document.getElementById('salary').value,
        projects: document.getElementById('projects').value,
        ai_score: document.getElementById('ai_score').value,
        education: document.getElementById('education').value,
        job_role: document.getElementById('job_role').value
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const resultData = await response.json();

        if (resultData.error) {
            alert("Error: " + resultData.error);
        } else {
            const resultDiv = document.getElementById('result');
            const predictionText = document.getElementById('prediction-text');

            resultDiv.classList.remove('hidden');
            predictionText.textContent = resultData.prediction;

            if (resultData.prediction === 'Hired') {
                predictionText.style.color = '#28a745'; // Green
            } else {
                predictionText.style.color = '#dc3545'; // Red
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server.');
    }
});