// ใส่ลิงก์ Web App URL ที่คัดลอกมาจากขั้นตอนที่ 1.2
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbxOda7H_Ucihf2Yy5w5Ui8Ys0RAInww4a51NXN1U8TaQ8HUJ-LcsbCts0Hq12mhsL9O/exec";

let wordsData = [];
let currentIndex = 0;
let userScore = 0;

// อ้างอิง Element ต่าง ๆ จาก HTML
const imgWord = document.getElementById("word-image");
const placeholderImg = document.getElementById("image-placeholder");
const txtWord = document.getElementById("target-word");
const txtMeaning = document.getElementById("word-meaning");
const txtProgress = document.getElementById("progress-text");
const starsContainer = document.getElementById("stars-container");
const btnPlay = document.getElementById("btn-play");
const btnMic = document.getElementById("btn-mic");
const micPulse = document.getElementById("mic-pulse");
const txtStatus = document.getElementById("status-message");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const browserWarning = document.getElementById("browser-warning");

// 1. ดึงข้อมูลจาก API ของ Google Sheets
async function fetchWords() {
  try {
    const response = await fetch(GOOGLE_SHEETS_API_URL);
    if (!response.ok) throw new Error("ดึงข้อมูลไม่สำเร็จ");
    wordsData = await response.json();
    
    if (wordsData.length > 0) {
      initApp();
    } else {
      txtStatus.textContent = "ไม่มีข้อมูลใน Google Sheets ของคุณครับ";
    }
  } catch (error) {
    console.error(error);
    txtStatus.textContent = "เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Sheets กรุณาตรวจสอบลิงก์ API ของคุณ";
  }
}

// 2. เริ่มต้นระบบแอปพลิเคชัน
function initApp() {
  currentIndex = 0;
  userScore = 0;
  showWordCard(currentIndex);
  setupWebSpeechAPI();
}

// 3. แสดงผลคำศัพท์ตามข้อที่กำหนด
function showWordCard(index) {
  const item = wordsData[index];
  
// อัปเดตรูปภาพ (ปรับปรุงระบบรองรับไฟล์สัมพันธ์)
  if (item.imageUrl) {
    let finalImgUrl = item.imageUrl.trim();
    
    // หากลิงก์ไม่ได้ขึ้นต้นด้วย http แสดงว่าเป็นไฟล์ในโปรเจกต์ (เช่น /apple.jpg หรือ apple.jpg)
    if (!finalImgUrl.startsWith("http")) {
      // ลบเครื่องหมาย / ด้านหน้าออกก่อนหากมี เพื่อไม่ให้ชนกันตอนต่อลิงก์
      const cleanPath = finalImgUrl.startsWith("/") ? finalImgUrl.slice(1) : finalImgUrl;
      // ต่อลิงก์เข้ากับโดเมนปัจจุบันของเว็บเราอัตโนมัติ
      finalImgUrl = window.location.origin + "/" + cleanPath;
    }
    
    imgWord.src = finalImgUrl;
    imgWord.classList.remove("hidden");
    placeholderImg.classList.add("hidden");
  } else {
    imgWord.classList.add("hidden");
    placeholderImg.textContent = "ไม่มีรูปภาพประกอบ";
    placeholderImg.classList.remove("hidden");
  } else {
    imgWord.classList.add("hidden");
    placeholderImg.textContent = "ไม่มีรูปภาพประกอบ";
    placeholderImg.classList.remove("hidden");
  }

  // อัปเดตข้อความ
  txtWord.textContent = item.word;
  txtMeaning.textContent = item.meaning;
  txtProgress.textContent = `คำที่ ${index + 1}/${wordsData.length}`;
  
  // จัดการประวัติการออกเสียงถูก/ผิด
  txtStatus.textContent = "กดปุ่มไมค์สีแดงแล้วพูดตามรูปภาพได้เลยนะค๊าบ!";
  txtStatus.className = "text-sm font-semibold text-gray-500 mt-2";
  
  // รีเซ็ตการทำงานของเสียง
  audioPlayer = null;
}

// 4. ระบบการเล่นไฟล์เสียงตัวอย่าง (.mp3 จากชีต)
let audioPlayer = null;
btnPlay.addEventListener("click", () => {
  const currentItem = wordsData[currentIndex];
  if (!currentItem.audioUrl) {
    txtStatus.textContent = "❌ คำนี้ยังไม่มีตัวอย่างเสียงสะกดครับ";
    return;
  }

  btnPlay.classList.add("animate-bounce");
  
  if (audioPlayer) {
    audioPlayer.pause();
  }
  
  audioPlayer = new Audio(currentItem.audioUrl);
  audioPlayer.play()
    .then(() => {
      txtStatus.textContent = "กำลังเล่นเสียงตัวอย่าง...🔊";
    })
    .catch((err) => {
      console.error(err);
      txtStatus.textContent = "⚠️ ไม่สามารถเล่นไฟล์เสียงนี้ได้ กรุณาตรวจสอบลิ้งก์เสียงใน Sheets";
    });

  audioPlayer.onended = () => {
    btnPlay.classList.remove("animate-bounce");
    txtStatus.textContent = "กดปุ่มไมค์สีแดงแล้วลองพูดตามเลย!";
  };
});

// 5. ตั้งค่าและเรียกใช้ระบบไมโครโฟนตรวจจับเสียงพูด (Speech Recognition)
let recognition = null;

function setupWebSpeechAPI() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    // แจ้งเตือนหากใช้งานบนเบราว์เซอร์ที่ไม่รองรับ
    browserWarning.classList.remove("hidden");
    btnMic.disabled = true;
    btnMic.classList.add("opacity-50", "cursor-not-allowed");
    txtStatus.textContent = "❌ อุปกรณ์หรือบราวเซอร์ของคุณไม่รองรับการทำงานของไมโครโฟน";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US'; // กำหนดให้ฟังภาษาอังกฤษเป็นหลัก
  recognition.interimResults = false; // เอาเฉพาะคำตอบที่มั่นใจ
  recognition.maxAlternatives = 1;

  // เมื่อเริ่มบันทึกเสียง
  recognition.onstart = () => {
    micPulse.classList.remove("hidden");
    txtStatus.textContent = "ฟังอยู่จ้า... พูดได้เลย! 🎙️";
    txtStatus.className = "text-sm font-bold text-rose-500 mt-2";
  };

  // จัดการกรณีเกิดข้อผิดพลาดในการฟังเสียง
  recognition.onerror = (event) => {
    micPulse.classList.add("hidden");
    console.error(event.error);
    if (event.error === 'no-speech') {
      txtStatus.textContent = "คุณครูไม่ได้ยินเสียงเลยครับ ลองกดปุ่มไมค์แล้วพูดใหม่อีกครั้งนะครับ 🎙️";
    } else {
      txtStatus.textContent = "เกิดข้อผิดพลาดในการเข้าถึงไมโครโฟน ลองตรวจสอบการตั้งค่าอนุญาตสิทธิ์ในเครื่องด้วยนะครับ";
    }
    txtStatus.className = "text-sm font-semibold text-amber-600 mt-2";
  };

  // สิ้นสุดการทำงานของไมโครโฟน
  recognition.onend = () => {
    micPulse.classList.add("hidden");
  };

  // ประเมินผลคำที่เด็กออกเสียง
  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript.toLowerCase().trim();
    const correctWord = wordsData[currentIndex].word.toLowerCase().trim();
    
    // ทำความสะอาดข้อความเพื่อเปรียบเทียบ (ลบพวกจุด หรือเครื่องหมายวรรคตอน)
    const cleanedResult = speechResult.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    
    console.log("เด็กพูดว่า: ", cleanedResult);
    console.log("คำตอบจริงคือ: ", correctWord);

    // เช็คกรณีเสียงมีความใกล้เคียง หรือหากคำนั้นอยู่ในประโยคที่เด็กพ่นมา (ช่วยเด็ก ป.1 ที่อาจพูดคำนำหน้า)
    if (cleanedResult === correctWord || cleanedResult.includes(correctWord)) {
      txtStatus.textContent = `เก่งมากเลยค๊าบ! 🎉 หนูออกเสียงตรงกับคำว่า "${correctWord}"`;
      txtStatus.className = "text-sm font-bold text-green-600 mt-2";
      addStar();
    } else {
      txtStatus.textContent = `คุณครูได้ยินว่า "${cleanedResult}" ลองพยายามใหม่อีกครั้งนะค๊าบ! 💪`;
      txtStatus.className = "text-sm font-bold text-amber-600 mt-2";
    }
  };
}

// ฟังก์ชันเพิ่มคะแนนและสะสมดาว
function addStar() {
  userScore++;
  const star = document.createElement("span");
  star.textContent = "🌟";
  star.className = "text-xl animate-bounce";
  starsContainer.appendChild(star);
}

// 6. ผูกกิจกรรมเข้ากับปุ่มกดไมโครโฟน
btnMic.addEventListener("click", () => {
  if (recognition) {
    try {
      recognition.start();
    } catch (e) {
      // ป้องกันข้อผิดพลาดกรณีการทำงานเบื้องหลังของระบบตรวจเสียงซ้ำซ้อน
      recognition.stop();
      setTimeout(() => { recognition.start(); }, 300);
    }
  }
});

// 7. การควบคุมสลับหน้าคำศัพท์ (ย้อนหลัง / ถัดไป)
btnPrev.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showWordCard(currentIndex);
  }
});

btnNext.addEventListener("click", () => {
  if (currentIndex < wordsData.length - 1) {
    currentIndex++;
    showWordCard(currentIndex);
  } else {
    txtStatus.textContent = `ยอดเยี่ยมมาก! เรียนรู้จนครบทุกคำแล้วนะครับเด็ก ๆ 🎉 ได้รับดาวทั้งหมด ${userScore} ดวง!`;
    txtStatus.className = "text-md font-bold text-blue-700 mt-2";
  }
});

// เริ่มต้นดึงข้อมูลทันทีเมื่อเปิดเว็บแอปขึ้นมาครั้งแรก
fetchWords();
