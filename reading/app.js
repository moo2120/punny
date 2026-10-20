/* ================= 1. Game State & Persistence ================= */
let state = {
  stars: 0,
  completedIds: [],
  petHappiness: 70,
  currentStory: null,
  currentQIndex: 0
};

function loadState() {
  const saved = localStorage.getItem("fun_reading_save_all");
  if (saved) {
    try { state = Object.assign(state, JSON.parse(saved)); } catch(e){}
  }
  document.getElementById("totalStars").innerText = state.stars;
}

function saveState() {
  localStorage.setItem("fun_reading_save_all", JSON.stringify(state));
  document.getElementById("totalStars").innerText = state.stars;
}

/* ================= 2. Web Audio API SFX ================= */
const ctx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t = ctx.currentTime;

  if (type === 'correct') {
    osc.frequency.setValueAtTime(523.25, t);
    osc.frequency.setValueAtTime(659.25, t + 0.08);
    osc.frequency.setValueAtTime(783.99, t + 0.16);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);
  } else if (type === 'wrong') {
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.15);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.start(t);
    osc.stop(t + 0.25);
  } else if (type === 'pop') {
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.06);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.06);
    osc.start(t);
    osc.stop(t + 0.06);
  }
}

/* ================= 3. Web Speech API (English Voice) ================= */
function speak(text, onWord = null, onDone = null) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;

  if (onWord) {
    u.onboundary = (e) => {
      if (e.name === 'word') onWord(e.charIndex);
    };
  }
  if (onDone) u.onend = onDone;
  window.speechSynthesis.speak(u);
}

/* ================= 4. Navigation & Screens ================= */
function showScreen(id) {
  window.speechSynthesis.cancel();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function renderWorldMap() {
  const container = document.getElementById("islandsContainer");
  container.innerHTML = "";

  UNITS_META.forEach(u => {
    const storiesInU = ALL_STORIES.filter(s => s.unit === u.id);
    const doneCount = storiesInU.filter(s => state.completedIds.includes(s.id)).length;

    const div = document.createElement("div");
    div.className = "island-card";
    div.onclick = () => openUnit(u.id);
    div.innerHTML = `
      <div class="island-icon">${u.icon}</div>
      <div class="island-title">Unit ${u.id}<br>${u.title}</div>
      <div class="island-badge">⭐ ${doneCount}/${storiesInU.length}</div>
    `;
    container.appendChild(div);
  });
}

function openUnit(unitId) {
  const uMeta = UNITS_META.find(u => u.id === unitId);
  document.getElementById("currentUnitTitle").innerText = `${uMeta.icon} Unit ${uMeta.id}: ${uMeta.title}`;

  const container = document.getElementById("storiesContainer");
  container.innerHTML = "";

  const stories = ALL_STORIES.filter(s => s.unit === unitId);
  stories.forEach(s => {
    const isDone = state.completedIds.includes(s.id);
    const row = document.createElement("div");
    row.className = "story-row-card";
    row.onclick = () => openReader(s);
    row.innerHTML = `
      <div class="row-emoji">${s.emoji}</div>
      <div class="row-name">${s.title}</div>
      <div class="row-star">${isDone ? "⭐" : "⚪"}</div>
    `;
    container.appendChild(row);
  });

  showScreen("storySelectScreen");
}

/* ================= 5. Story Reader ================= */
function openReader(story) {
  state.currentStory = story;
  document.getElementById("storyEmojiHero").innerText = story.emoji;
  document.getElementById("readerTitle").innerText = story.title;

  const box = document.getElementById("storyLinesBox");
  box.innerHTML = "";

  story.lines.forEach((l, idx) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "story-line";
    lineDiv.id = `line-${idx}`;

    l.text.split(" ").forEach(w => {
      const span = document.createElement("span");
      span.className = "word-span";
      span.innerText = w + " ";
      span.onclick = (e) => {
        e.stopPropagation();
        playSound('pop');
        speak(w);
      };
      lineDiv.appendChild(span);
    });

    const icon = document.createElement("span");
    icon.className = "line-emoji";
    icon.innerText = l.icon;
    lineDiv.appendChild(icon);

    box.appendChild(lineDiv);
  });

  showScreen("storyReaderScreen");
}

function readStoryAloud() {
  const story = state.currentStory;
  if (!story) return;

  const fullText = story.lines.map(l => l.text).join(" ");
  const spans = document.querySelectorAll("#storyLinesBox .word-span");
  spans.forEach(s => s.classList.remove("speaking"));

  let wIndex = 0;
  speak(fullText, () => {
    if (wIndex < spans.length) {
      spans.forEach(s => s.classList.remove("speaking"));
      spans[wIndex].classList.add("speaking");
      wIndex++;
    }
  }, () => spans.forEach(s => s.classList.remove("speaking")));
}

/* ================= 6. Mission Player Engine (มีเนื้อเรื่องกำกับเสมอ) ================= */
function startStoryMission() {
  state.currentQIndex = 0;
  renderMissionStoryBanner(); // เรนเดอร์เนื้อเรื่องกำกับไว้ด้านบน
  loadCurrentQuestion();
  showScreen("gamePlayScreen");
}

// เรนเดอร์กล่องเนื้อเรื่องย่อส่วนไว้ด้านบนของข้อสอบ
function renderMissionStoryBanner() {
  const story = state.currentStory;
  if (!story) return;

  document.getElementById("missionStoryTitle").innerText = `📖 ${story.title}`;
  const linesBox = document.getElementById("missionStoryLines");
  linesBox.innerHTML = "";

  story.lines.forEach(l => {
    const row = document.createElement("div");
    row.className = "banner-line-row";

    l.text.split(" ").forEach(w => {
      const span = document.createElement("span");
      span.className = "word-span";
      span.innerText = w + " ";
      span.onclick = (e) => {
        e.stopPropagation();
        playSound('pop');
        speak(w);
      };
      row.appendChild(span);
    });

    const icon = document.createElement("span");
    icon.className = "line-emoji";
    icon.innerText = l.icon;
    row.appendChild(icon);

    linesBox.appendChild(row);
  });
}

// ฟังเสียงเนื้อเรื่องซ้ำขณะทำข้อสอบ
function readMissionStoryAloud() {
  const story = state.currentStory;
  if (!story) return;

  const fullText = story.lines.map(l => l.text).join(" ");
  const spans = document.querySelectorAll("#missionStoryLines .word-span");
  spans.forEach(s => s.classList.remove("speaking"));

  let wIndex = 0;
  speak(fullText, () => {
    if (wIndex < spans.length) {
      spans.forEach(s => s.classList.remove("speaking"));
      spans[wIndex].classList.add("speaking");
      wIndex++;
    }
  }, () => spans.forEach(s => s.classList.remove("speaking")));
}

function exitToReader() {
  showScreen("storyReaderScreen");
}

function speakInstruction() {
  speak(document.getElementById("gameInstruction").innerText);
}

function loadCurrentQuestion() {
  const story = state.currentStory;
  const qObj = story.questions[state.currentQIndex];

  document.getElementById("gameProgressTag").innerText = `Question ${state.currentQIndex + 1}/${story.questions.length}`;
  document.getElementById("gameInstruction").innerText = qObj.q;

  const field = document.getElementById("dynamicGameArea");
  field.innerHTML = "";

  // 1. Sequence Ordering
  if (qObj.type === "sequence") {
    let step = 1;
    const grid = document.createElement("div");
    grid.className = "sequence-slots";

    const shuffled = [...qObj.items].map((text, idx) => ({ text, correctStep: idx + 1 }))
                                    .sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {
      const b = document.createElement("div");
      b.className = "seq-box";
      b.innerText = item.text;
      b.onclick = () => {
        if (item.correctStep === step) {
          playSound('pop');
          b.classList.add("filled");
          b.innerHTML = `<strong>#${step}</strong><br>${item.text}`;
          b.style.pointerEvents = "none";
          step++;
          if (step > qObj.items.length) handleCorrect();
        } else {
          playSound('wrong');
          b.classList.add("wrong");
          setTimeout(() => b.classList.remove("wrong"), 350);
        }
      };
      grid.appendChild(b);
    });
    field.appendChild(grid);
  }
  // 2. Venn Diagram
  else if (qObj.type === "venn") {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div style="text-align:center; margin-bottom:12px; font-weight:700; font-size:1.15rem;">
        Drop: <span style="color:#E67E22;">${qObj.item}</span>
      </div>
      <div class="venn-container">
        <div class="venn-circle venn-left" onclick="checkVennChoice('left')">${qObj.left}</div>
        <div class="venn-middle" onclick="checkVennChoice('both')">⭐ Both</div>
        <div class="venn-circle venn-right" onclick="checkVennChoice('right')">${qObj.right}</div>
      </div>
    `;
    field.appendChild(wrap);

    window.checkVennChoice = (c) => {
      if (c === qObj.target) handleCorrect();
      else { playSound('wrong'); speak("Try again!"); }
    };
  }
  // 3. Regular Choices (Details, True/False, Predictions, etc.)
  else {
    const list = document.createElement("div");
    list.className = "choice-cards-container";

    qObj.choices.forEach(ch => {
      const card = document.createElement("div");
      card.className = "tap-card";
      card.innerText = ch.text;
      card.onclick = () => {
        if (ch.correct) {
          card.classList.add("correct");
          handleCorrect();
        } else {
          card.classList.add("wrong");
          playSound('wrong');
          speak("Try again!");
          setTimeout(() => card.classList.remove("wrong"), 350);
        }
      };
      list.appendChild(card);
    });
    field.appendChild(list);
  }
}

function handleCorrect() {
  playSound('correct');
  fireConfetti();
  speak("Good job!");

  setTimeout(() => {
    state.currentQIndex++;
    if (state.currentQIndex < state.currentStory.questions.length) {
      loadCurrentQuestion();
    } else {
      completeStory();
    }
  }, 1000);
}

function completeStory() {
  const story = state.currentStory;
  if (!state.completedIds.includes(story.id)) {
    state.completedIds.push(story.id);
    state.stars += 3;
    state.petHappiness = Math.min(100, state.petHappiness + 15);
    saveState();
  }

  alert(`🎉 Mission Complete! You mastered "${story.title}"! (+3 Stars ⭐)`);
  openUnit(story.unit);
}

/* ================= 7. Vocab Pet Sanctuary ================= */
let petTarget = "";

function openPetMode() {
  document.getElementById("petHeartBar").style.width = `${state.petHappiness}%`;
  generateVocabQuiz();
  showScreen("petScreen");
}

function generateVocabQuiz() {
  let pool = [];
  ALL_STORIES.forEach(s => { pool = pool.concat(s.vocab); });
  pool = [...new Set(pool)];

  petTarget = pool[Math.floor(Math.random() * pool.length)];

  const choices = [petTarget];
  while (choices.length < 3) {
    const r = pool[Math.floor(Math.random() * pool.length)];
    if (!choices.includes(r)) choices.push(r);
  }
  choices.sort(() => Math.random() - 0.5);

  const container = document.getElementById("vocabChoicesBox");
  container.innerHTML = "";

  choices.forEach(w => {
    const b = document.createElement("div");
    b.className = "vocab-bubble";
    b.innerText = w;
    b.onclick = () => {
      if (w === petTarget) {
        playSound('correct');
        fireConfetti();
        state.petHappiness = Math.min(100, state.petHappiness + 10);
        state.stars += 1;
        saveState();
        document.getElementById("petHeartBar").style.width = `${state.petHappiness}%`;
        document.getElementById("petSpeech").innerText = `Yummy! I love '${w}'! 😋`;
        speak(`Yummy! ${w}!`);
        setTimeout(generateVocabQuiz, 1400);
      } else {
        playSound('wrong');
        speak("Listen again!");
      }
    };
    container.appendChild(b);
  });

  playVocabAudioPrompt();
}

function playVocabAudioPrompt() {
  speak(petTarget);
}

/* ================= 8. Canvas Confetti ================= */
function fireConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx2 = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#4A90E2", "#48CFAD", "#FFCE54", "#FC6E51", "#AC92EC"];
  for (let i = 0; i < 35; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  let frames = 0;
  function update() {
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      ctx2.fillStyle = p.color;
      ctx2.fillRect(p.x, p.y, p.size, p.size);
    });
    frames++;
    if (frames < 45) requestAnimationFrame(update);
    else ctx2.clearRect(0, 0, canvas.width, canvas.height);
  }
  update();
}

/* Initial Load */
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderWorldMap();
});
