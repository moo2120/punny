/* ============================================================
   1. จัดการข้อมูลสถานะของเกม (State & LocalStorage)
============================================================ */
let gameState = {
  stars: 0,
  unlockedStoryIds: [1],
  completedStoryIds: [],
  petHappiness: 60,
  currentStory: null
};

// โหลดเซฟเก่าจากบราวเซอร์
function loadGameProgress() {
  const saved = localStorage.getItem("fun_reading_save_v1");
  if (saved) {
    try {
      gameState = Object.assign(gameState, JSON.parse(saved));
    } catch(e) { console.error("Error loading save", e); }
  }
  updateTopNavStars();
}

function saveGameProgress() {
  localStorage.setItem("fun_reading_save_v1", JSON.stringify(gameState));
  updateTopNavStars();
}

function updateTopNavStars() {
  document.getElementById("totalStars").innerText = gameState.stars;
}

/* ============================================================
   2. ระบบเสียงสังเคราะห์ (Web Audio API - Zero MP3 files)
============================================================ */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'correct') {
    // เสียง ติ๊ง-ต่อง คอร์ด C เมเจอร์
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'wrong') {
    // เสียง ดึ๋ง สั่นนุ่มนวล
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'pop') {
    // เสียง ป๊อป แตกฟองสบู่
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

/* ============================================================
   3. ระบบเสียงอ่านออกเสียงภาษาอังกฤษ (Web Speech API)
============================================================ */
function speakText(text, onWordBoundary = null, onEnd = null) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // ตัดเสียงเก่าทิ้งก่อน

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85; // ลดสปีดลงเล็กน้อยสำหรับเด็ก ป.1

  if (onWordBoundary) {
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        onWordBoundary(e.charIndex);
      }
    };
  }
  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/* ============================================================
   4. การสลับหน้าจอ (Screen Navigation)
============================================================ */
function showScreen(screenId) {
  window.speechSynthesis.cancel();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

/* ============================================================
   5. หน้า 1: เรนเดอร์แผนที่เกาะ 11 หน่วย (World Map)
============================================================ */
function renderWorldMap() {
  const container = document.getElementById("islandsContainer");
  container.innerHTML = "";

  UNITS_META.forEach(unit => {
    // นับจำนวนนิทานในหมวดนี้
    const storiesInUnit = STORY_DATABASE.filter(s => s.unit === unit.id);
    const completedInUnit = storiesInUnit.filter(s => gameState.completedStoryIds.includes(s.id)).length;

    const card = document.createElement("div");
    card.className = "island-card unlocked";
    card.onclick = () => openUnit(unit.id);

    card.innerHTML = `
      <div class="island-icon">${unit.icon}</div>
      <div class="island-title">Unit ${unit.id}: ${unit.title}</div>
      <div class="island-badge">⭐ ${completedInUnit}/${storiesInUnit.length}</div>
    `;
    container.appendChild(card);
  });
}

/* ============================================================
   6. หน้า 2: หน้ารายชื่อนิทานประจำหน่วย (Story List)
============================================================ */
let activeUnitId = 1;

function openUnit(unitId) {
  activeUnitId = unitId;
  const unitMeta = UNITS_META.find(u => u.id === unitId);
  document.getElementById("currentUnitTitle").innerText = `${unitMeta.icon} Unit ${unitId}: ${unitMeta.title}`;

  const container = document.getElementById("storiesContainer");
  container.innerHTML = "";

  const stories = STORY_DATABASE.filter(s => s.unit === unitId);

  if (stories.length === 0) {
    container.innerHTML = "<p style='text-align:center; padding: 20px;'>More stories coming soon! 🎈</p>";
  } else {
    stories.forEach(story => {
      const isDone = gameState.completedStoryIds.includes(story.id);
      const row = document.createElement("div");
      row.className = "story-row-card";
      row.onclick = () => openStoryReader(story);

      row.innerHTML = `
        <div class="row-emoji">${story.emojiHero}</div>
        <div class="row-name">${story.title}</div>
        <div class="row-star">${isDone ? "⭐" : "⚪"}</div>
      `;
      container.appendChild(row);
    });
  }

  showScreen("storySelectScreen");
}

/* ============================================================
   7. หน้า 3: หน้านิทาน + คาราโอเกะ (Story Reader)
============================================================ */
function openStoryReader(story) {
  gameState.currentStory = story;
  document.getElementById("storyEmojiHero").innerText = story.emojiHero;
  document.getElementById("readerTitle").innerText = story.title;

  const linesBox = document.getElementById("storyLinesBox");
  linesBox.innerHTML = "";

  story.lines.forEach((lineObj, lineIdx) => {
    const lineElem = document.createElement("div");
    lineElem.className = "story-line";
    lineElem.id = `line-${lineIdx}`;

    // แยกคำเพื่อให้แตะฟังเสียงทีละคำได้
    const words = lineObj.text.split(" ");
    words.forEach(w => {
      const span = document.createElement("span");
      span.className = "word-span";
      span.innerText = w + " ";
      span.onclick = (e) => {
        e.stopPropagation();
        playSound('pop');
        speakText(w);
      };
      lineElem.appendChild(span);
    });

    // ใส่ไอคอนท้ายประโยค (Rebus)
    const iconSpan = document.createElement("span");
    iconSpan.className = "line-emoji";
    iconSpan.innerText = lineObj.icon;
    lineElem.appendChild(iconSpan);

    linesBox.appendChild(lineElem);
  });

  showScreen("storyReaderScreen");
}

// อ่านทั้งเรื่องแบบคาราโอเกะ
function readStoryAloud() {
  const story = gameState.currentStory;
  if (!story) return;

  const fullText = story.lines.map(l => l.text).join(" ");
  const allWordSpans = document.querySelectorAll(".word-span");

  allWordSpans.forEach(s => s.classList.remove("speaking"));

  let currentWordIdx = 0;
  speakText(
    fullText,
    (charIdx) => {
      if (currentWordIdx < allWordSpans.length) {
        allWordSpans.forEach(s => s.classList.remove("speaking"));
        allWordSpans[currentWordIdx].classList.add("speaking");
        currentWordIdx++;
      }
    },
    () => {
      allWordSpans.forEach(s => s.classList.remove("speaking"));
    }
  );
}

function startMission() {
  const story = gameState.currentStory;
  if (!story) return;

  document.getElementById("gameMissionBadge").innerText = `${story.unitTitle} Mission`;
  document.getElementById("gameInstruction").innerText = story.game.instruction;

  renderGamePlayfield(story.game);
  showScreen("gamePlayScreen");
}

function exitToReader() {
  showScreen("storyReaderScreen");
}

function speakInstruction() {
  const inst = document.getElementById("gameInstruction").innerText;
  speakText(inst);
}

/* ============================================================
   8. หน้า 4: Engine จัดการมินิเกมตามหมวดหมู่ (Mini-Games)
============================================================ */
function renderGamePlayfield(game) {
  const field = document.getElementById("dynamicGameArea");
  field.innerHTML = "";

  // แบบที่ 1: แตะเลือกคำตอบ (Story Details, Predictions, Cause & Effect, Character)
  if (game.type === "tap-choice" || game.type === "color-builder") {
    const list = document.createElement("div");
    list.className = "choice-cards-container";

    game.choices.forEach(ch => {
      const card = document.createElement("div");
      card.className = "tap-card";
      card.innerText = ch.text;
      card.onclick = () => {
        if (ch.correct) {
          card.classList.add("correct");
          playSound("correct");
          fireConfetti();
          speakText("Awesome! That is right!");
          finishMissionSuccess();
        } else {
          card.classList.add("wrong");
          playSound("wrong");
          speakText("Try again!");
          setTimeout(() => card.classList.remove("wrong"), 400);
        }
      };
      list.appendChild(card);
    });
    field.appendChild(list);
  }

  // แบบที่ 2: ลำดับเหตุการณ์ 1-2-3-4 (Story Sequence)
  else if (game.type === "sequence") {
    let currentStep = 1;
    const grid = document.createElement("div");
    grid.className = "sequence-slots";

    // สลับตำแหน่งการ์ดให้เด็กเรียง
    const shuffled = [...game.items].sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {
      const box = document.createElement("div");
      box.className = "seq-box";
      box.innerText = item.text;

      box.onclick = () => {
        if (item.step === currentStep) {
          playSound("pop");
          box.classList.add("filled");
          box.innerHTML = `<strong>#${currentStep}</strong><br>${item.text}`;
          box.style.pointerEvents = "none";
          currentStep++;

          if (currentStep > game.items.length) {
            playSound("correct");
            fireConfetti();
            speakText("You are a great director!");
            finishMissionSuccess();
          }
        } else {
          playSound("wrong");
          box.classList.add("wrong");
          setTimeout(() => box.classList.remove("wrong"), 400);
        }
      };
      grid.appendChild(box);
    });
    field.appendChild(grid);
  }

  // แบบที่ 3: เวนน์ไดอะแกรม (Compare & Contrast)
  else if (game.type === "venn") {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div style="text-align:center; margin-bottom:12px; font-weight:700; font-size:1.3rem;">
        Drop here: <span style="color:#E67E22;">${game.item}</span>
      </div>
      <div class="venn-container">
        <div class="venn-circle venn-left" onclick="checkVenn('left')">${game.leftLabel}</div>
        <div class="venn-middle" onclick="checkVenn('both')">⭐ Both!</div>
        <div class="venn-circle venn-right" onclick="checkVenn('right')">${game.rightLabel}</div>
      </div>
    `;
    field.appendChild(wrap);

    window.checkVenn = (choice) => {
      if (choice === game.target) {
        playSound("correct");
        fireConfetti();
        speakText("Correct! Both apples grow on trees!");
        finishMissionSuccess();
      } else {
        playSound("wrong");
        speakText("Think again. Does both of them have this?");
      }
    };
  }

  // แบบที่ 4: ตรวจสอบข้อเท็จจริง (True/False - Identifying Facts)
  else if (game.type === "true-false") {
    const list = document.createElement("div");
    list.className = "choice-cards-container";

    const btnTrue = document.createElement("div");
    btnTrue.className = "tap-card";
    btnTrue.innerHTML = "✅ TRUE (It's a fact!)";
    btnTrue.onclick = () => answerTF(true);

    const btnFalse = document.createElement("div");
    btnFalse.className = "tap-card";
    btnFalse.innerHTML = "❌ FALSE (Not true!)";
    btnFalse.onclick = () => answerTF(false);

    list.appendChild(btnTrue);
    list.appendChild(btnFalse);
    field.appendChild(list);

    function answerTF(ans) {
      if (ans === game.isTrue) {
        playSound("correct");
        fireConfetti();
        speakText("Great detective work!");
        finishMissionSuccess();
      } else {
        playSound("wrong");
        speakText("Oops! Check the story again!");
      }
    }
  }
}

// เมื่อผ่านด่าน แจกดาว และปลดล็อก
function finishMissionSuccess() {
  const story = gameState.currentStory;
  if (!gameState.completedStoryIds.includes(story.id)) {
    gameState.completedStoryIds.push(story.id);
    gameState.stars += 3;
    gameState.petHappiness = Math.min(100, gameState.petHappiness + 15);
    saveGameProgress();
  }

  setTimeout(() => {
    alert("🎉 Mission Accomplished! You earned 3 Stars! ⭐⭐⭐");
    showScreen("storySelectScreen");
    openUnit(story.unit); // รีเฟรชรายการ
  }, 1200);
}

/* ============================================================
   9. หน้า 5: สวนสัตว์เลี้ยงคำศัพท์ (Vocab Pet Sanctuary)
============================================================ */
let targetVocab = "";

function openPetMode() {
  document.getElementById("petHeartBar").style.width = `${gameState.petHappiness}%`;
  generateVocabQuiz();
  showScreen("petScreen");
}

function generateVocabQuiz() {
  // รวบรวมคำศัพท์ทั้งหมดจากนิทานที่เคยอ่านจบ
  let wordsPool = [];
  STORY_DATABASE.forEach(s => {
    wordsPool = wordsPool.concat(s.vocab);
  });
  wordsPool = [...new Set(wordsPool)]; // คำไม่ซ้ำ

  if (wordsPool.length < 3) {
    wordsPool = ["cat", "hat", "dog", "sun", "big", "run"];
  }

  // สุ่มคำเป้าหมาย 1 คำ
  targetVocab = wordsPool[Math.floor(Math.random() * wordsPool.length)];

  // สุ่มตัวเลือกหลอก 2 คำ
  const choices = [targetVocab];
  while (choices.length < 3) {
    const randomW = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    if (!choices.includes(randomW)) choices.push(randomW);
  }
  choices.sort(() => Math.random() - 0.5);

  const container = document.getElementById("vocabChoicesBox");
  container.innerHTML = "";

  choices.forEach(w => {
    const btn = document.createElement("div");
    btn.className = "vocab-bubble";
    btn.innerText = w;
    btn.onclick = () => {
      if (w === targetVocab) {
        playSound("correct");
        fireConfetti();
        gameState.petHappiness = Math.min(100, gameState.petHappiness + 10);
        gameState.stars += 1;
        saveGameProgress();
        document.getElementById("petHeartBar").style.width = `${gameState.petHappiness}%`;
        document.getElementById("petSpeech").innerText = `Yummy! I love '${w}'! 😋`;
        speakText(`Yummy! ${w}!`);
        setTimeout(generateVocabQuiz, 1500);
      } else {
        playSound("wrong");
        speakText("Not that one. Listen again!");
      }
    };
    container.appendChild(btn);
  });

  playVocabAudioPrompt();
}

function playVocabAudioPrompt() {
  speakText(targetVocab);
}

/* ============================================================
   10. เอฟเฟกต์พลุกระดาษฉลองชัย (Canvas Confetti)
============================================================ */
function fireConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#4A90E2", "#48CFAD", "#FFCE54", "#FC6E51", "#AC92EC"];

  for (let i = 0; i < 40; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  let frames = 0;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // แรงโน้มถ่วง
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    frames++;
    if (frames < 50) {
      requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  update();
}

/* เริ่มต้นระบบเมื่อโหลดหน้าเสร็จ */
window.addEventListener("DOMContentLoaded", () => {
  loadGameProgress();
  renderWorldMap();
});
