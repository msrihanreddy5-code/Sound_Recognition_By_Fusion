const audioFile = document.getElementById("audioFile");
const audioPlayer = document.getElementById("audioPlayer");
const predictBtn = document.getElementById("predictBtn");
const fileInfo = document.getElementById("fileInfo");
const result = document.getElementById("result");
const prediction = document.getElementById("prediction");
const confidence = document.getElementById("confidence");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");

let selectedFile = null;

audioFile.addEventListener("change", () => {
    selectedFile = audioFile.files[0];

    result.classList.add("hidden");
    errorBox.classList.add("hidden");

    if (!selectedFile) {
        predictBtn.disabled = true;
        return;
    }

    fileInfo.textContent = `Selected: ${selectedFile.name}`;
    fileInfo.classList.remove("hidden");

    audioPlayer.src = URL.createObjectURL(selectedFile);
    audioPlayer.classList.remove("hidden");

    predictBtn.disabled = false;
});

predictBtn.addEventListener("click", async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("audio", selectedFile);

    predictBtn.disabled = true;
    loading.classList.remove("hidden");
    result.classList.add("hidden");
    errorBox.classList.add("hidden");

    try {
        const response = await fetch("/predict", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Prediction failed.");
        }

        prediction.textContent = data.prediction;

        if (data.confidence !== null) {
            confidence.textContent = `Model confidence: ${data.confidence}%`;
        } else {
            confidence.textContent = "Prediction completed.";
        }

        result.classList.remove("hidden");
    } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
        predictBtn.disabled = false;
    }
});
