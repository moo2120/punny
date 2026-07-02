// ตรวจสอบ Browser Prefix ของ Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let sentences = [];
let currentIdx = 0;
let isRecording = false;

// เริ่มต้นโหลดเมื่อเปิดหน้าเว็บ
window.onload = async () => {
    initSpeechRecognition();
    await fetchSentences();
    renderHistoryTable();
};

// 1. ตรวจสอบการรองรับและตั้งค่า Web Speech API
function initSpeechRecognition() {
    const statusMsg = document.getElementById("status-message");
    const btnMic = document.getElementById("btn-mic");

    if (!SpeechRecognition) {
        statusMsg.innerText = "Error: Web Speech API is not supported in this browser. Please use Chrome, Safari, or Edge.";
        btnMic.disabled = true;
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // กำหนดให้ฟังภาษาอังกฤษสำเนียงอเมริกา
    recognition.interimResults = false; // รับเฉพาะผลลัพธ์สุดท้ายที่ประมวลผลเสร็จแล้ว
    recognition.maxAlternatives = 1;

    // เหตุการณ์เมื่อเริ่มฟังเสียง
    recognition.onstart = () => {
        isRecording = true;
        btnMic.innerText = "🔴 Listening... Speak Now";
        btnMic.className = "btn-danger";
        document.getElementById("status-message").innerText = "Listening to your voice...";
    };

    // เหตุการณ์เมื่อประมวลผลเสียงพูดเสร็จ
    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        evaluatePronunciation(spokenText);
    };

    // เหตุการณ์เมื่อเกิดข้อผิดพลาด
    recognition.onerror = (event) => {
        const statusMsg = document.getElementById("status-message");
        if (event.error === 'not-allowed') {
            statusMsg.innerText = "Error: Microphone permission denied.";
        } else if (event.error === 'no-speech') {
            statusMsg.innerText = "Error: No speech detected. Try again.";
        } else {
            statusMsg.innerText = `Error detected: ${event.error}`;
        }
        resetMicButton();
    };

    // เหตุการณ์เมื่อหยุดทำงาน
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

// 2. ดึงข้อมูลจากไฟล์ sentences.csv
async function fetchSentences() {
    try {
        const response = await fetch('sentences.csv');
        if (!response.ok) throw new Error("Failed to fetch sentences.csv");
        const data = await response.text();
        
        // แยกบรรทัดและแปลงข้อมูล CSV เป็น Array ของ Object
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',');
        
        sentences = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
                id: values[0],
                text: values[1],
                difficulty: values[2]
            };
        });

        if (sentences.length > 0) {
            displaySentence();
        }
    } catch (err) {
        document.getElementById("target-sentence").innerText = "Failed to load sentences. Make sure files are on a server.";
        console.error(err);
    }
}

function displaySentence() {
    if (sentences.length === 0) return;
    const item = sentences[currentIdx];
    document.getElementById("target-sentence").innerText = item.text;
    document.getElementById("difficulty-badge").innerText = item.difficulty;
    document.getElementById("comparison-result").innerHTML = "";
    document.getElementById("score-text").innerText = "";
    document.getElementById("status-message").innerText = "Click 'Start Practice' to begin.";
}

function loadNextSentence() {
    currentIdx = (currentIdx + 1) % sentences.length;
    displaySentence();
}

// 3. เริ่มต้น/หยุด อัดเสียงผ่านปุ่มกด (User-gesture ทริกเกอร์ตามเงื่อนไข Safari)
function toggleRecording() {
    if (!recognition) return;
    if (isRecording) {
        recognition.stop();
    } else {
        // ขอสิทธิ์แบบ User-Initiated Event ซึ่งปลอดภัยต่อระบบป้องกันบน iOS/Safari
        recognition.start();
    }
}

// 4. ระบบเปรียบเทียบคำพูดและการคำนวณคะแนน
function evaluatePronunciation(spokenText) {
    const targetText = sentences[currentIdx].text;
    
    // คลีนตัวอักษรพิเศษและเปลี่ยนเป็นตัวเล็กทั้งหมด
    const clean = str => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    
    const targetWords = clean(targetText).split(/\s+/);
    const spokenWords = clean(spokenText).split(/\s+/);
    
    let correctCount = 0;
    
    // สร้างผลลัพธ์ HTML แสดงความถูกต้องรายคำ
    const comparisonHTML = targetWords.map((word, idx) => {
        // หากคำที่พูดในลำดับนั้นตรงกัน หรือออกเสียงใกล้เคียง
        if (spokenWords[idx] === word) {
            correctCount++;
            return `<span class="word-correct">${word}</span>`;
        } else {
            return `<span class="word-incorrect">${word}</span>`;
        }
    });

    // คำนวณคะแนนเป็นเปอร์เซ็นต์
    const score = Math.round((correctCount / targetWords.length) * 100);
    
    document.getElementById("comparison-result").innerHTML = comparisonHTML.join(" ");
    document.getElementById("status-message").innerText = `You said: "${spokenText}"`;
    document.getElementById("score-text").innerText = `Score: ${score}%`;

    // บันทึกลง LocalStorage
    saveToHistory(targetText, spokenText, score);
}

// 5. จัดการระบบเก็บข้อมูล Local Storage
function saveToHistory(sentence, spoken, score) {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    const newRecord = {
        timestamp: new Date().toLocaleString(),
        sentence: sentence,
        spoken: spoken,
        score: score
    };
    history.unshift(newRecord); // นำประวัติใหม่ไว้ด้านบนสุด
    localStorage.setItem("practice_history", JSON.stringify(history));
    renderHistoryTable();
}

function renderHistoryTable() {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    const tbody = document.getElementById("history-table-body");
    tbody.innerHTML = history.slice(0, 5).map(row => `
        <tr>
            <td>${row.timestamp}</td>
            <td>${row.sentence}</td>
            <td><strong>${row.score}%</strong></td>
        </tr>
    `).join("");
}

// 6. ส่งออกข้อมูล (Export) เป็นไฟล์ CSV ให้ผู้ใช้ดาวน์โหลด
function exportHistoryToCSV() {
    const history = JSON.parse(localStorage.getItem("practice_history") || "[]");
    if (history.length === 0) {
        alert("No history to export yet!");
        return;
    }

    // กำหนดหัวตารางของ CSV
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // ใส่ BOM ป้องกันปัญหากับอักษรภาษาไทย/ภาษาอื่น
    csvContent += "Timestamp,Target Sentence,Spoken Text,Score\n";

    history.forEach(row => {
        // หุ้มข้อความด้วยเครื่องหมายอัญประกาศคู่เพื่อหลีกเลี่ยงผลกระทบจาก comma ในประโยค
        csvContent += `"${row.timestamp}","${row.sentence}","${row.spoken}",${row.score}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pronunciation_practice_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
