const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// ⚠️ วางลิงก์ดาวน์โหลด CSV ของ Google Sheet ที่คุณเตรียมไว้ตรงนี้
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1hRiqV447IXq2spKWuF2nljHGG8mE-4y2Po-7UraVTGc/export?format=csv";

let recognition;
let allSentences = [];       
let filteredSentences = [];  
let currentIdx = 0;
let isRecording = false;

window.onload = async () => {
    initSpeechRecognition();
    await fetchSentences();
    renderHistoryTable();
};

// 1. ตั้งค่าการดักจับเสียง
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
        btnMic.innerText = "🔴 Listening... Speak Now";
        btnMic.className = "btn-danger";
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
            statusMsg.innerText = "Error: Network error. Web Speech API requires internet. (Avoid Brave Browser)";
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
    btnMic.innerText = "Start Practice";
    btnMic.className = "btn-success";
}

// ฟังก์ชันแกะรหัสแถวของ CSV อย่างปลอดภัย (รองรับกรณีมีเครื่องหมายคอมมาในประโยค)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes; // สลับสถานะเปิด/ปิดเครื่องหมายคำพูด
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

// 2. ดึงข้อมูลจาก Google Sheets (อ่านแทนไฟล์ sentences.csv ท้องถิ่น)
async function fetchSentences() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error("Failed to fetch Google Sheets database.");
        const data = await response.text();
        
        // แยกบรรทัด (รองรับทั้งระบบ Windows \r\n และ Unix \n)
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

        applyFilters();
    } catch (err) {
        document.getElementById("target-sentence").innerText = "Error: Unable to connect to Google Sheets database.";
        console.error(err);
    }
}

// 3. กรองข้อมูลตามที่ผู้ใช้เลือกโหมดและระดับความยาก
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

// 4. แสดงผลตามโหมดการเล่น
function displayCurrentItem() {
    const targetDiv = document.getElementById("target-sentence");
    const imgDisplay = document.getElementById("image-display");
    const btnPlayAudio = document.getElementById("btn-play-audio");
    const diffBadge = document.getElementById("difficulty-badge");
    const btnMic = document.getElementById("btn-mic");

    document.getElementById("comparison-result").innerHTML = "";
    document.getElementById("score-text").innerText = "";
    document.getElementById("status-message").innerText = "Ready. Click 'Start Practice' to begin.";

    if (filteredSentences.length === 0) {
        targetDiv.innerText = "No sentences found for this selection.";
        diffBadge.innerText = "-";
        imgDisplay.style.display = "none";
        btnPlayAudio.style.display = "none";
        btnMic.disabled = true;
        return;
    }

    btnMic.disabled = false;
    const item = filteredSentences[currentIdx];
    diffBadge.innerText = item.difficulty.toUpperCase();

    if (item.mode === "read") {
        imgDisplay.style.display = "none";
        btnPlayAudio.style.display = "none";
        targetDiv.innerText = item.text1;
        targetDiv.style.filter = "none";
    } 
    else if (item.mode === "listen") {
        imgDisplay.style.display = "none";
        btnPlayAudio.style.display = "inline-block";
        targetDiv.innerText = "🔊 Listen to the audio and repeat.";
        targetDiv.style.filter = "blur(4px)"; 
    } 
    else if (item.mode === "image") {
        btnPlayAudio.style.display = "none";
        if (item.image_url) {
            imgDisplay.src = item.image_url;
            imgDisplay.style.display = "block";
        } else {
            imgDisplay.style.display = "none";
        }
        targetDiv.innerText = "Look at the image and say what it is.";
        targetDiv.style.filter = "none";
    }
}

// 5. โหมดฟังแล้วพูด: สังเคราะห์เสียงพูดให้ผู้เรียนฟัง
function playTargetAudio() {
    if (filteredSentences.length === 0) return;
    const item = filteredSentences[currentIdx];
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(item.text1);
    utterance.lang = 'en-US';
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

// 6. วิเคราะห์เปรียบเทียบประเมินการพูด (รองรับสูงสุด 3 ตัวเลือกเฉลย)
function evaluatePronunciation(spokenText) {
    const item = filteredSentences[currentIdx];
    
    const targets = [item.text1, item.text2, item.text3].filter(t => t && t.trim() !== "");
    
    let bestScore = -1;
    let bestResultHTML = "";
    let bestMatchedTarget = "";

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
        
        if (score > bestScore) {
            bestScore = score;
            bestResultHTML = comparisonHTML.join(" ");
            bestMatchedTarget = target;
        }
    });

    const targetDiv = document.getElementById("target-sentence");
    targetDiv.style.filter = "none"; 
    
    if (item.mode === "listen") {
        targetDiv.innerHTML = `<strong>Answer:</strong> ${item.text1}`;
    } else if (item.mode === "image") {
        targetDiv.innerHTML = `<strong>Target Options:</strong> ${targets.join(" / ")}`;
    }

    document.getElementById("comparison-result").innerHTML = bestResultHTML;
    document.getElementById("status-message").innerText = `You said: "${spokenText}"`;
    document.getElementById("score-text").innerText = `Score: ${bestScore}%`;

    saveToHistory(item.mode, bestMatchedTarget, spokenText, bestScore);
}

// 7. จัดการตารางแสดงผลประวัติ
function saveToHistory(mode, target, spoken, score) {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    const newRecord = {
        timestamp: new Date().toLocaleString(),
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
    tbody.innerHTML = history.slice(0, 5).map(row => `
        <tr>
            <td>${row.timestamp}</td>
            <td><span style="font-weight:bold; color:var(--primary);">${row.mode}</span></td>
            <td><strong>Target:</strong> ${row.target}<br><small style="color:#7f8c8d;">You: ${row.spoken}</small></td>
            <td><strong>${row.score}%</strong></td>
        </tr>
    `).join("");
}

// 8. ส่งออกไฟล์ CSV
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
