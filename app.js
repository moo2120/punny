const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// ลิงก์ดาวน์โหลด CSV ของ Google Sheet ที่จัดเตรียมไว้
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

// 1. ตั้งค่าเสียงดักจับ (Speech Recognition)
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
    btnMic.innerHTML = "🎙️ Start Practice";
}

// แกะรหัสข้อมูลแถว CSV
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

// 2. ดึงข้อมูลประโยคจาก Google Sheets
async function fetchSentences() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error("Failed to fetch Google Sheets database.");
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

        // เปิดใช้งานปุ่มเข้าสู่ระบบฝึกซ้อมเมื่อดึงข้อมูลเสร็จสิ้น
        const btnStart = document.getElementById("btn-start");
        btnStart.disabled = false;
        btnStart.innerText = "🚀 Start Training / เริ่มต้นฝึกซ้อม";

    } catch (err) {
        alert("ขออภัย! ไม่สามารถดึงฐานข้อมูลคำศัพท์ได้ กรุณาลองใหม่อีกครั้ง");
        console.error(err);
    }
}

// 3. เริ่มต้นเซสชันฝึกซ้อม (เปลี่ยนสลับไปหน้า 2)
function startTrainingSession() {
    applyFilters();
    
    // สลับหน้าจอ
    document.getElementById("screen-setup").classList.remove("active");
    document.getElementById("screen-trainer").classList.add("active");
    document.getElementById("history-panel").style.display = "block";
}

// คลิกย้อนกลับไปเปลี่ยนตั้งค่าโหมด (กลับไปหน้าแรก)
function goBackToSetup() {
    document.getElementById("screen-trainer").classList.remove("active");
    document.getElementById("screen-setup").classList.add("active");
    document.getElementById("history-panel").style.display = "none";
}

// 4. กรองรายการข้อมูลตามที่ผู้เรียนเลือกโหมดและความยาก
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

// 5. แสดงผลการฝึกตามโจทย์ปัจจุบัน
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

    // อัปเดตตัวเลขแสดงความก้าวหน้าคำ
    const curNumSpan = document.getElementById("current-question-num");
    const totalNumSpan = document.getElementById("total-questions-num");

    if (filteredSentences.length === 0) {
        targetDiv.innerText = "No sentences found for this selection.";
        targetDiv.classList.remove("text-blurred");
        diffBadge.innerText = "-";
        diffBadge.className = "badge";
        imgContainer.style.display = "none";
        audioContainer.style.display = "none";
        btnMic.disabled = true;
        curNumSpan.innerText = "0";
        totalNumSpan.innerText = "0";
        return;
    }

    btnMic.disabled = false;
    const item = filteredSentences[currentIdx];
    
    // ตั้งค่าตัวนับข้อ
    curNumSpan.innerText = currentIdx + 1;
    totalNumSpan.innerText = filteredSentences.length;

    // ตั้งระดับความยากและการ์ดสี
    diffBadge.innerText = item.difficulty.toUpperCase();
    diffBadge.className = `badge badge-${item.difficulty.toLowerCase()}`;

    if (item.mode === "read") {
        imgContainer.style.display = "none";
        audioContainer.style.display = "none";
        targetDiv.innerText = item.text1;
        targetDiv.classList.remove("text-blurred");
    } 
    else if (item.mode === "listen") {
        imgContainer.style.display = "none";
        audioContainer.style.display = "block"; // เปิดเผย container ลำโพงเสียง
        targetDiv.innerText = item.text1;
        targetDiv.classList.add("text-blurred"); // เปิดเอฟเฟกต์เบลอบังคำเฉลยก่อน
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
        targetDiv.classList.remove("text-blurred");
    }
}

// 6. โหมดฟังแล้วพูด: สังเคราะห์เสียงพูดให้ผู้เรียนฟัง
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

// 7. วิเคราะห์เปรียบเทียบประเมินการพูด
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

    // ปลดเอฟเฟกต์เบลอบังคำออก เมื่อประเมินผลเรียบร้อยแล้ว
    const targetDiv = document.getElementById("target-sentence");
    targetDiv.classList.remove("text-blurred"); 
    
    if (item.mode === "listen") {
        targetDiv.innerHTML = `<span style="font-size:14px; color:#6B7280; display:block; margin-bottom:5px;">Target Text:</span> ${item.text1}`;
    } else if (item.mode === "image") {
        targetDiv.innerHTML = `<span style="font-size:14px; color:#6B7280; display:block; margin-bottom:5px;">Acceptable Answers:</span> ${targets.join(" / ")}`;
    }

    document.getElementById("comparison-result").innerHTML = bestResultHTML;
    document.getElementById("status-message").innerText = `You said: "${spokenText}"`;
    document.getElementById("score-text").innerText = `Score: ${bestScore}%`;

    saveToHistory(item.mode, bestMatchedTarget, spokenText, bestScore);
}

// 8. บันทึกและแสดงผลประวัติฝึกซ้อม
function saveToHistory(mode, target, spoken, score) {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    const newRecord = {
        timestamp: new Date().toLocaleString('th-TH'),
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

// ส่งออกไฟล์ประวัติการเล่น (CSV)
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
