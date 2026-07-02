const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Google Sheet URL representing sentence resources
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1hRiqV447IXq2spKWuF2nljHGG8mE-4y2Po-7UraVTGc/export?format=csv";

let recognition;
let allSentences = [];       
let filteredSentences = [];  
let currentIdx = 0;
let isRecording = false;

// Audio customization parameters
let voiceType = "female";
let voiceSpeed = 1.0;

// Game State variables for managing attempts (Only active on Listen and Speak mode)
let attemptsCount = 0;
let bestAttemptScore = -1;
let bestAttemptHTML = "";
let bestAttemptSpoken = "";

window.onload = async () => {
    initSpeechRecognition();
    await fetchSentences();
    renderHistoryTable();

    // Trigger local SpeechSynthesis setup to load system speech engines
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            // Fires when client voices load asynchronously
        };
    }
};

// 1. Initialize Speech API
function initSpeechRecognition() {
    const statusMsg = document.getElementById("status-message");
    const btnMic = document.getElementById("btn-mic");

    if (!SpeechRecognition) {
        statusMsg.innerText = "Error: Web Speech API is not supported in this browser.";
        btnMic.disabled = true;
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isRecording = true;
        const btnMic = document.getElementById("btn-mic");
        btnMic.className = "btn-danger btn-mic btn-mic-active";
        btnMic.innerHTML = "🔴 Listening... Speak Now";
        document.getElementById("status-message").innerText = "Listening to your voice...";
    };

    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        evaluatePronunciation(spokenText);
    };

    recognition.onerror = (event) => {
        const statusMsg = document.getElementById("status-message");
        if (event.error === 'not-allowed') {
            statusMsg.innerText = "Error: Microphone permission denied.";
        } else if (event.error === 'no-speech') {
            statusMsg.innerText = "Error: No speech detected. Please try again.";
        } else if (event.error === 'network') {
            statusMsg.innerText = "Error: Network error. Web Speech API requires internet.";
        } else {
            statusMsg.innerText = `Error: ${event.error}`;
        }
        resetMicButton();
    };

    recognition.onend = () => {
        resetMicButton();
    };
}

function resetMicButton() {
    isRecording = false;
    const btnMic = document.getElementById("btn-mic");
    btnMic.className = "btn-success btn-mic";
    btnMic.innerHTML = "🎙️ Start Practice (•◡•)";
}

// Safely parses line inputs for comma delimiters inside quotes
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// 2. Load external sentence data
async function fetchSentences() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error("Failed to fetch database.");
        const data = await response.text();
        
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');
        
        allSentences = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            return {
                id: values[0] ? values[0].replace(/"/g, "") : "",
                mode: values[1] ? values[1].replace(/"/g, "") : "",
                text1: values[2] ? values[2].replace(/"/g, "") : "",
                text2: values[3] ? values[3].replace(/"/g, "") : "",
                text3: values[4] ? values[4].replace(/"/g, "") : "",
                difficulty: values[5] ? values[5].replace(/"/g, "") : "",
                image_url: values[6] ? values[6].replace(/"/g, "").trim() : ""
            };
        });

        const btnStart = document.getElementById("btn-start");
        btnStart.disabled = false;
        btnStart.innerText = "🚀 Start Practicing! (•◡•)";

    } catch (err) {
        alert("Sorry! Unable to connect to the database. Please reload or check your network.");
        console.error(err);
    }
}

// 3. Interface Management
function startTrainingSession() {
    applyFilters();
    
    document.getElementById("screen-setup").classList.remove("active");
    document.getElementById("screen-trainer").classList.add("active");
    document.getElementById("history-panel").style.display = "block";
}

function goBackToSetup() {
    document.getElementById("screen-trainer").classList.remove("active");
    document.getElementById("screen-setup").classList.add("active");
    document.getElementById("history-panel").style.display = "none";
}

// 4. Group data matching filter configurations
function applyFilters() {
    const selectedMode = document.getElementById("filter-mode").value;
    const selectedDiff = document.getElementById("filter-difficulty").value;

    filteredSentences = allSentences.filter(item => {
        const matchMode = item.mode === selectedMode;
        const matchDiff = (selectedDiff === "all") || (item.difficulty.toLowerCase() === selectedDiff.toLowerCase());
        return matchMode && matchDiff;
    });

    currentIdx = 0;
    displayCurrentItem();
}

// 5. Render Target Challenges
function displayCurrentItem() {
    const targetDiv = document.getElementById("target-sentence");
    const imgContainer = document.getElementById("image-container");
    const imgDisplay = document.getElementById("image-display");
    const audioContainer = document.getElementById("audio-container");
    const diffBadge = document.getElementById("difficulty-badge");
    const btnMic = document.getElementById("btn-mic");

    document.getElementById("comparison-result").innerHTML = "";
    document.getElementById("score-text").innerText = "";
    document.getElementById("status-message").innerText = "Ready. Click 'Start Practice' to begin.";

    // Reset attempt states when transitioning to a new sentence
    attemptsCount = 0;
    bestAttemptScore = -1;
    bestAttemptHTML = "";
    bestAttemptSpoken = "";
    btnMic.disabled = false;

    const curNumSpan = document.getElementById("current-question-num");
    const totalNumSpan = document.getElementById("total-questions-num");

    if (filteredSentences.length === 0) {
        targetDiv.innerText = "No sentences found for this selection.";
        diffBadge.innerText = "-";
        diffBadge.className = "badge";
        imgContainer.style.display = "none";
        audioContainer.style.display = "none";
        btnMic.disabled = true;
        curNumSpan.innerText = "0";
        totalNumSpan.innerText = "0";
        return;
    }

    const item = filteredSentences[currentIdx];
    
    curNumSpan.innerText = currentIdx + 1;
    totalNumSpan.innerText = filteredSentences.length;

    diffBadge.innerText = item.difficulty.toUpperCase();
    diffBadge.className = `badge badge-${item.difficulty.toLowerCase()}`;

    if (item.mode === "read") {
        imgContainer.style.display = "none";
        audioContainer.style.display = "none";
        targetDiv.innerText = item.text1;
    } 
    else if (item.mode === "listen") {
        imgContainer.style.display = "none";
        audioContainer.style.display = "block";
        // Prompt instructs users to listen and repeat, fully hiding any text previews
        targetDiv.innerText = "🎧 Tap the button below to listen, then repeat!";
    } 
    else if (item.mode === "image") {
        audioContainer.style.display = "none";
        if (item.image_url) {
            imgDisplay.src = item.image_url;
            imgContainer.style.display = "block";
        } else {
            imgContainer.style.display = "none";
        }
        targetDiv.innerText = "Look at the image and say what it is.";
    }
}

// 6. Voice Customizer Helpers
function updateVoiceSettings() {
    voiceType = document.getElementById("select-voice-type").value;
    voiceSpeed = parseFloat(document.getElementById("select-voice-speed").value);
}

// Dynamic voice lookup supporting fallback options
function getBestVoice(type) {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    
    // Filter to English voice engines
    const enVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    if (enVoices.length === 0) return null;

    // Filter profiles matching speaker gender tags
    const femaleNames = ["zira", "samantha", "hazel", "susan", "karen", "veena", "tessa", "moira", "female", "siri", "victoria"];
    const maleNames = ["david", "george", "ravi", "mark", "richard", "male", "microsoft david", "daniel", "alex"];

    if (type === "female" || type === "girl") {
        const voice = enVoices.find(v => femaleNames.some(name => v.name.toLowerCase().includes(name)));
        if (voice) return voice;
    } else if (type === "male" || type === "boy") {
        const voice = enVoices.find(v => maleNames.some(name => v.name.toLowerCase().includes(name)));
        if (voice) return voice;
    }
    
    // US English Fallback
    const usVoice = enVoices.find(v => v.lang.toLowerCase().includes('us'));
    if (usVoice) return usVoice;

    return enVoices[0];
}

// 7. Text-To-Speech Pronunciation Engine
function playTargetAudio() {
    if (filteredSentences.length === 0) return;
    const item = filteredSentences[currentIdx];
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(item.text1);
    utterance.lang = 'en-US';
    
    const matchedVoice = getBestVoice(voiceType);
    if (matchedVoice) {
        utterance.voice = matchedVoice;
    }

    // Set voice rate speed
    utterance.rate = voiceSpeed;

    // Pitch customizers simulating age profiles
    if (voiceType === "girl") {
        utterance.pitch = 1.5; 
    } else if (voiceType === "boy") {
        utterance.pitch = 1.4; 
    } else if (voiceType === "male") {
        utterance.pitch = 0.9; 
    } else {
        utterance.pitch = 1.0; 
    }

    window.speechSynthesis.speak(utterance);
}

function loadNextSentence() {
    if (filteredSentences.length === 0) return;
    currentIdx = (currentIdx + 1) % filteredSentences.length;
    displayCurrentItem();
}

function toggleRecording() {
    if (!recognition || filteredSentences.length === 0) return;
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// 8. Pronunciation Speech Assessment logic with dynamic mode evaluation
function evaluatePronunciation(spokenText) {
    const item = filteredSentences[currentIdx];
    const targets = [item.text1, item.text2, item.text3].filter(t => t && t.trim() !== "");
    
    let currentBestScore = -1;
    let currentBestHTML = "";
    let currentBestMatchedTarget = "";

    const clean = str => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const spokenWords = clean(spokenText).split(/\s+/);

    targets.forEach(target => {
        const targetWords = clean(target).split(/\s+/);
        let correctCount = 0;
        
        const comparisonHTML = targetWords.map((word, idx) => {
            if (spokenWords[idx] === word) {
                correctCount++;
                return `<span class="word-correct">${word}</span>`;
            } else {
                return `<span class="word-incorrect">${word}</span>`;
            }
        });
        
        const score = Math.round((correctCount / targetWords.length) * 100);
        
        if (score > currentBestScore) {
            currentBestScore = score;
            currentBestHTML = comparisonHTML.join(" ");
            currentBestMatchedTarget = target;
        }
    });

    const targetDiv = document.getElementById("target-sentence");
    const comparisonDiv = document.getElementById("comparison-result");
    const statusMsg = document.getElementById("status-message");
    const scoreText = document.getElementById("score-text");
    const btnMic = document.getElementById("btn-mic");

    // ================== Mode 1: Listen and Speak Mode (3-Attempt Logic) ==================
    if (item.mode === "listen") {
        attemptsCount++;

        // Track the overall best score and HTML across all 3 attempts
        if (currentBestScore > bestAttemptScore) {
            bestAttemptScore = currentBestScore;
            bestAttemptHTML = currentBestHTML;
            bestAttemptSpoken = spokenText;
        }

        // Case A: Perfect Pronunciation (100% Score) - Complete turn immediately
        if (currentBestScore === 100) {
            targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Target Text:</span> ${item.text1}`;
            comparisonDiv.innerHTML = currentBestHTML;
            statusMsg.innerText = `🎉 Perfect! Excellent job! (◕‿◕)`;
            scoreText.innerText = `Score: 100%`;
            btnMic.disabled = true; // Block practicing for this question since it is already perfect

            saveToHistory(item.mode, currentBestMatchedTarget, spokenText, 100);
        }
        // Case B: Under 100% and still have attempts left
        else if (attemptsCount < 3) {
            // Hide correct answer, show current attempt score and transcript
            comparisonDiv.innerHTML = `<span style="color:#6B7280; font-size:14px;">You said: "${spokenText}"</span>`;
            statusMsg.innerText = `❌ Not quite perfect! Try again. Attempt ${attemptsCount} of 3 (•◡•)`;
            scoreText.innerText = `Attempt Score: ${currentBestScore}%`;
        }
        // Case C: Under 100% and used up all 3 attempts
        else {
            // Reveal the correct answers now that attempts are exhausted
            targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Target Text:</span> ${item.text1}`;
            
            // Display results from their best performing attempt
            comparisonDiv.innerHTML = bestAttemptHTML;
            statusMsg.innerText = `😔 Out of attempts! Here is the correct answer.`;
            scoreText.innerText = `Best Score: ${bestAttemptScore}%`;
            btnMic.disabled = true; // Complete current question, block microphone until they click next

            saveToHistory(item.mode, currentBestMatchedTarget, bestAttemptSpoken, bestAttemptScore);
        }
    }
    // ================== Mode 2: Read/Look Mode (Immediate Evaluation Logic) ==================
    else {
        // Reveal target texts / answers immediately on the first speak
        if (item.mode === "image") {
            targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Correct Answer:</span> ${targets.join(" / ")}`;
        } else {
            targetDiv.innerText = item.text1;
        }

        comparisonDiv.innerHTML = currentBestHTML;
        statusMsg.innerText = `You said: "${spokenText}"`;
        scoreText.innerText = `Score: ${currentBestScore}%`;
        btnMic.disabled = true; // Complete current question, block microphone until they click next

        saveToHistory(item.mode, currentBestMatchedTarget, spokenText, currentBestScore);
    }
}

// 9. Process Local Session History Logs
function saveToHistory(mode, target, spoken, score) {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    const newRecord = {
        timestamp: new Date().toLocaleString('en-US'),
        mode: mode.toUpperCase(),
        target: target,
        spoken: spoken,
        score: score
    };
    history.unshift(newRecord);
    localStorage.setItem("practice_history", JSON.stringify(history));
    renderHistoryTable();
}

function renderHistoryTable() {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    const tbody = document.getElementById("history-table-body");
    
    tbody.innerHTML = history.slice(0, 5).map(row => {
        let scoreClass = 'score-pill-low';
        if (row.score >= 80) scoreClass = 'score-pill-high';
        else if (row.score >= 50) scoreClass = 'score-pill-med';

        return `
            <tr>
                <td><span style="color:#6B7280; font-size:12px;">${row.timestamp}</span></td>
                <td><span style="font-weight:700; color:var(--primary);">${row.mode}</span></td>
                <td>
                    <div class="history-target">${row.target}</div>
                    <div class="history-user">Speech: "${row.spoken || '...'}"</div>
                </td>
                <td><span class="score-pill ${scoreClass}">${row.score}%</span></td>
            </tr>
        `;
    }).join("");
}

// Clear all local records with confirmation warning
function clearPracticeHistory() {
    if (confirm("Are you sure you want to clear all practice history? 🗑️ This action cannot be undone!")) {
        localStorage.removeItem("practice_history");
        renderHistoryTable();
    }
}

// Export logs to a local CSV file
function exportHistoryToCSV() {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    if (history.length === 0) {
        alert("No history to export yet!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Timestamp,Mode,Target Sentence,Spoken Text,Score\n";

    history.forEach(row => {
        csvContent += `"${row.timestamp}","${row.mode}","${row.target}","${row.spoken}",${row.score}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pronunciation_trainer_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
