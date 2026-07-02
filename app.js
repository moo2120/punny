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

// Game State variables for managing attempts (Active on Listen & Speak, Listen & Type, and Look & Type)
let attemptsCount = 0;
let bestAttemptScore = -1;
let bestAttemptHTML = "";
let bestAttemptSpoken = "";

// State tracking for completed missions (getting 100% score)
let completedChallenges = new Set();
let selectedMode = "read"; // Tracks active selected study mode

window.onload = async () => {
    initSpeechRecognition();
    await fetchSentences();
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
            if (values.length < 3) return null;
            return {
                id: values[0] ? values[0].replace(/"/g, "") : "",
                mode: values[1] ? values[1].replace(/"/g, "") : "",
                question: values[2] ? values[2].replace(/"/g, "") : "",
                text1: values[3] ? values[3].replace(/"/g, "") : "",
                text2: values[4] ? values[4].replace(/"/g, "") : "",
                text3: values[5] ? values[5].replace(/"/g, "") : "",
                image_url: values[6] ? values[6].replace(/"/g, "").trim() : ""
            };
        }).filter(item => item !== null);

        // Scan which modes have actual spreadsheet rows and disable empty buttons
        checkAvailableModes();

        const btnStart = document.getElementById("btn-start");
        btnStart.disabled = false;
        btnStart.innerText = "🚀 Start Practicing! (•◡•)";

    } catch (err) {
        alert("Sorry! Unable to connect to the database. Please reload or check your network.");
        console.error(err);
    }
}

// Check which categories are present and toggle button states
function checkAvailableModes() {
    const availableModes = new Set(allSentences.map(item => item.mode));
    const modeList = ["read", "listen", "image", "listen_type", "image_type"];
    
    modeList.forEach(m => {
        const btn = document.getElementById(`mode-${m}`);
        if (btn) {
            if (!availableModes.has(m)) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }
    });
    
    // Auto-select first available category
    const firstAvailable = modeList.find(m => availableModes.has(m));
    if (firstAvailable) {
        selectMode(firstAvailable);
    }
}

// Handles selecting study mode via interactive icon button clicks
function selectMode(mode) {
    selectedMode = mode;
    document.querySelectorAll(".mode-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`mode-${mode}`);
    if (activeBtn) {
        activeBtn.classList.add("active");
    }
}

// 3. Interface Management
function startTrainingSession() {
    applyFilters();
    
    document.getElementById("screen-setup").classList.remove("active");
    document.getElementById("screen-trainer").classList.add("active");
}

function goBackToSetup() {
    document.getElementById("screen-trainer").classList.remove("active");
    document.getElementById("screen-setup").classList.add("active");
}

// 4. Group data matching filter configurations
function applyFilters() {
    filteredSentences = allSentences.filter(item => {
        return item.mode === selectedMode;
    });

    currentIdx = 0;
    completedChallenges.clear();
    displayCurrentItem();
}

// 5. Render Target Challenges
function displayCurrentItem() {
    const targetDiv = document.getElementById("target-sentence");
    const imgContainer = document.getElementById("image-container");
    const imgDisplay = document.getElementById("image-display");
    const audioContainer = document.getElementById("audio-container");
    
    const btnMic = document.getElementById("btn-mic");
    const btnSubmitType = document.getElementById("btn-submit-type");
    const btnRetry = document.getElementById("btn-retry");
    
    const typeContainer = document.getElementById("type-container");
    const typeInput = document.getElementById("type-input");

    document.getElementById("status-message").innerText = "Ready. Click 'Start Practice' to begin.";

    // Reset attempt states when transitioning to a new sentence
    attemptsCount = 0;
    bestAttemptScore = -1;
    bestAttemptHTML = "";
    bestAttemptSpoken = "";
    
    // Default speaking mode layout configurations
    btnMic.style.display = "inline-flex";
    btnMic.disabled = false;
    btnSubmitType.style.display = "none";
    btnRetry.style.display = "none"; 
    typeContainer.style.display = "none";

    const curNumSpan = document.getElementById("current-question-num");
    const totalNumSpan = document.getElementById("total-questions-num");

    if (filteredSentences.length === 0) {
        targetDiv.innerText = "No sentences found for this selection.";
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

    if (item.mode === "read") {
        imgContainer.style.display = "none";
        audioContainer.style.display = "none";
        targetDiv.innerText = item.question; 
    } 
    else if (item.mode === "listen") {
        imgContainer.style.display = "none";
        audioContainer.style.display = "block";
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
        targetDiv.innerText = item.question ? item.question : "Look at the image and say what it is.";
    }
    // Mode: Listen and Type
    else if (item.mode === "listen_type") {
        imgContainer.style.display = "none";
        audioContainer.style.display = "block";
        targetDiv.innerText = "🎧 Listen to the audio and type what you hear!";
        
        // Show typing elements
        typeContainer.style.display = "block";
        typeInput.disabled = false;
        typeInput.value = "";
        btnSubmitType.style.display = "inline-flex";
        btnSubmitType.disabled = false;
        btnMic.style.display = "none";
    }
    // Mode: Look and Type
    else if (item.mode === "image_type") {
        audioContainer.style.display = "none";
        if (item.image_url) {
            imgDisplay.src = item.image_url;
            imgContainer.style.display = "block";
        } else {
            imgContainer.style.display = "none";
        }
        targetDiv.innerText = item.question ? item.question : "Look at the image and type what it is.";
        
        // Show typing elements
        typeContainer.style.display = "block";
        typeInput.disabled = false;
        typeInput.value = "";
        btnSubmitType.style.display = "inline-flex";
        btnSubmitType.disabled = false;
        btnMic.style.display = "none";
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

// 7. Text-To-Speech Pronunciation Engine (Synthesizing audio based on question instead of text1)
function playTargetAudio() {
    if (filteredSentences.length === 0) return;
    const item = filteredSentences[currentIdx];
    
    window.speechSynthesis.cancel();

    // Playback based on question stimulus
    const utterance = new SpeechSynthesisUtterance(item.question);
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

// Allows users to retry/re-practice the current challenge at any time
function retryCurrentSentence() {
    if (filteredSentences.length === 0) return;
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

// Support keydown enter for typing answer checking
function handleTypeEnter(event) {
    if (event.key === "Enter") {
        evaluateTyping();
    }
}

// ================== Helper Functions for Robust Text Comparison ==================
const cleanText = str => {
    if (!str) return "";
    return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

const getWordsArray = str => {
    const cleaned = cleanText(str);
    return cleaned ? cleaned.split(" ") : [];
};

// Advanced Multi-Heuristic Client-Side Grammar Advisor (Totally free, zero latency, zero memory overhead)
function analyzeGrammarHeuristics(inputText, targetText, isKeywordMatch) {
    const cleanedInput = inputText.toLowerCase().trim();
    const suggestions = [];

    // Check A: Incorrect "a" before vowel sound words (e.g. "a apple")
    const aVowelPattern = /\ba\s+([aeiou][a-z]*)\b/g;
    const nonSilentU = ["university", "union", "unique", "useful", "user", "unit", "one"];
    let match;
    while ((match = aVowelPattern.exec(cleanedInput)) !== null) {
        const word = match[1];
        if (!nonSilentU.some(exception => word.startsWith(exception))) {
            suggestions.push(`💡 <strong>Grammar Tip:</strong> Use "<strong>an</strong>" instead of "a" before vowel sounds (e.g. "an ${word}").`);
        }
    }

    // Check B: Incorrect "an" before consonant sounds (e.g. "an banana")
    const anConsonantPattern = /\ban\s+([bcdfghjklmnpqrstvwxyz][a-z]*)\b/g;
    const silentH = ["hour", "honest", "honor", "heir"];
    while ((match = anConsonantPattern.exec(cleanedInput)) !== null) {
        const word = match[1];
        if (!silentH.some(exception => word.startsWith(exception))) {
            suggestions.push(`💡 <strong>Grammar Tip:</strong> Use "<strong>a</strong>" instead of "an" before consonant sounds (e.g. "a ${word}").`);
        }
    }

    // Only perform morphological alignment diagnostics if the user didn't hit a keyword-match
    if (!isKeywordMatch && targetText) {
        const spokenWords = getWordsArray(inputText);
        const targetWords = getWordsArray(targetText);

        const spokenSet = new Set(spokenWords);
        const prepositions = ["in", "on", "at", "to", "for", "with", "by", "of", "from", "about", "into", "through", "under", "over"];
        const missingPrepositions = targetWords.filter(w => prepositions.includes(w) && !spokenSet.has(w));
        
        if (missingPrepositions.length > 0) {
            suggestions.push(`💡 <strong>Preposition Tip:</strong> Did you miss the preposition? Try including: "<strong>${missingPrepositions.join(", ")}</strong>".`);
        }

        const minLength = Math.min(spokenWords.length, targetWords.length);
        for (let i = 0; i < minLength; i++) {
            const sw = spokenWords[i];
            const tw = targetWords[i];
            if (sw !== tw) {
                if (sw + "s" === tw || sw + "es" === tw || tw + "s" === sw || tw + "es" === sw) {
                    suggestions.push(`💡 <strong>Noun Agreement Tip:</strong> You said "<strong>${sw}</strong>" but the target sentence requires plural/singular form: "<strong>${tw}</strong>".`);
                }
                const copulas = ["is", "are", "was", "were", "am", "be", "been"];
                if (copulas.includes(sw) && copulas.includes(tw)) {
                    suggestions.push(`💡 <strong>Subject-Verb Agreement Tip:</strong> Try using the correct verb form "<strong>${tw}</strong>" instead of "${sw}".`);
                }
                const auxiliaries = ["has", "have", "had", "do", "does", "did", "can", "could", "will", "would", "should"];
                if (auxiliaries.includes(sw) && auxiliaries.includes(tw)) {
                    suggestions.push(`💡 <strong>Auxiliary Verb Tip:</strong> Try using "<strong>${tw}</strong>" instead of "${sw}".`);
                }
                const irregulars = [
                    ["go", "went", "gone", "going"], ["run", "ran", "running"], ["see", "saw", "seen", "seeing"],
                    ["do", "did", "done", "doing"], ["eat", "ate", "eaten", "eating"], ["write", "wrote", "written", "writing"],
                    ["speak", "spoke", "spoken", "speaking"], ["take", "took", "taken", "taking"], ["make", "made", "making"],
                    ["buy", "bought", "buying"]
                ];
                for (const group of irregulars) {
                    if (group.includes(sw) && group.includes(tw)) {
                        suggestions.push(`💡 <strong>Verb Tense Tip:</strong> You said "<strong>${sw}</strong>" but the correct verb conjugation is "<strong>${tw}</strong>".`);
                        break;
                    }
                }
                const cleanVerbRoot = w => w.replace(/(ing|ed|s|es)$/, "");
                if (cleanVerbRoot(sw) === cleanVerbRoot(tw) && sw !== tw) {
                    if (tw.endsWith("ing")) {
                        suggestions.push(`💡 <strong>Verb Form Tip:</strong> Try using continuous participle "<strong>${tw}</strong>" instead of "${sw}".`);
                    } else if (tw.endsWith("ed")) {
                        suggestions.push(`💡 <strong>Verb Tense Tip:</strong> Use the past-tense "<strong>${tw}</strong>" instead of the present "${sw}".`);
                    }
                }
            }
        }
    }
    return suggestions.join("<br>");
}

// 8. Evaluates Textual Input for Typing Modes with 3-Attempt Logic
function evaluateTyping() {
    const item = filteredSentences[currentIdx];
    const typedText = document.getElementById("type-input").value;
    
    if (!typedText || !typedText.trim()) {
        alert("Please type your answer first! ⌨️");
        return;
    }

    const targets = [item.text1, item.text2, item.text3].filter(t => t && t.trim() !== "");
    let bestScore = -1;
    let bestResultHTML = "";
    let bestMatchedTarget = "";

    const typedWords = getWordsArray(typedText);

    targets.forEach(target => {
        const targetWords = getWordsArray(target);
        let correctCount = 0;
        
        const comparisonHTML = targetWords.map((word, idx) => {
            if (typedWords[idx] === word) {
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

    attemptsCount++;

    if (bestScore > bestAttemptScore) {
        bestAttemptScore = bestScore;
        bestAttemptHTML = bestResultHTML;
        bestAttemptSpoken = typedText;
    }

    const targetDiv = document.getElementById("target-sentence");
    const statusMsg = document.getElementById("status-message");
    const btnSubmit = document.getElementById("btn-submit-type");
    const btnRetry = document.getElementById("btn-retry");
    const typeInput = document.getElementById("type-input");

    const localGrammarFeedback = analyzeGrammarHeuristics(typedText, bestMatchedTarget, false);

    // Case I: Perfect Typing (100% Score) - Complete turn immediately, launch popup modal
    if (bestScore === 100) {
        targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Correct Answer:</span> ${targets.join(" / ")}`;

        // Lock fields and update main screen
        typeInput.disabled = true;
        btnSubmit.style.display = "none";
        btnRetry.style.display = "inline-flex";

        showResultModal(100, bestResultHTML, localGrammarFeedback, `🎉 Perfect! Excellent job! (◕‿◕)`, item.id);
    }
    // Case II: Under 100% and still have attempts left (< 3)
    else if (attemptsCount < 3) {
        // Keeps user on training screen with inline guidance, no popup modal until finished
        const inlineComparison = document.getElementById("comparison-result");
        inlineComparison.innerHTML = `<span style="color:#6B7280; font-size:14px;">You typed: "${typedText.trim()}"</span>`;
        statusMsg.innerText = `❌ Not quite perfect! Try again. Attempt ${attemptsCount} of 3 (•◡•). Score: ${bestScore}%`;
    }
    // Case III: Under 100% and used up all 3 attempts
    else {
        targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Correct Answer:</span> ${targets.join(" / ")}`;

        typeInput.disabled = true;
        btnSubmit.style.display = "none";
        btnRetry.style.display = "inline-flex";

        let finalGrammarFeedback = localGrammarFeedback;
        if (bestMatchedTarget) {
            const guidance = `💡 <strong>Review Tip:</strong> Practice writing: "<strong>${bestMatchedTarget}</strong>"`;
            finalGrammarFeedback = finalGrammarFeedback ? `${guidance}<br>${finalGrammarFeedback}` : guidance;
        }

        showResultModal(bestAttemptScore, bestAttemptHTML, finalGrammarFeedback, `😔 Out of attempts! Here is the correct answer.`, item.id);
    }
}

// 9. Pronunciation Speech Assessment logic (Voice Modes)
function evaluatePronunciation(spokenText) {
    const item = filteredSentences[currentIdx];
    const targets = [item.text1, item.text2, item.text3].filter(t => t && t.trim() !== "");
    
    let currentBestScore = -1;
    let currentBestHTML = "";
    let currentBestMatchedTarget = "";
    let isBestMatchKeywordBased = false;

    const spokenClean = cleanText(spokenText);
    const spokenWords = getWordsArray(spokenText);

    targets.forEach(target => {
        const targetClean = cleanText(target);
        const targetWords = getWordsArray(target);
        let correctCount = 0;
        let comparisonHTML = [];

        // Check if the user spoke the target phrase anywhere in their input (Keyword Match)
        const isKeywordMatch = spokenClean.includes(targetClean);

        if (isKeywordMatch) {
            correctCount = targetWords.length;
            comparisonHTML = targetWords.map(word => `<span class="word-correct">${word}</span>`);
        } else {
            // Fallback to standard word-by-word alignment evaluation
            comparisonHTML = targetWords.map((word, idx) => {
                if (spokenWords[idx] === word) {
                    correctCount++;
                    return `<span class="word-correct">${word}</span>`;
                } else {
                    return `<span class="word-incorrect">${word}</span>`;
                }
            });
        }
        
        const score = isKeywordMatch ? 100 : Math.round((correctCount / targetWords.length) * 100);
        
        if (score > currentBestScore) {
            currentBestScore = score;
            currentBestHTML = comparisonHTML.join(" ");
            currentBestMatchedTarget = target;
            isBestMatchKeywordBased = isKeywordMatch;
        }
    });

    const targetDiv = document.getElementById("target-sentence");
    const statusMsg = document.getElementById("status-message");
    const btnMic = document.getElementById("btn-mic");
    const btnRetry = document.getElementById("btn-retry");

    const localGrammarFeedback = analyzeGrammarHeuristics(spokenText, currentBestMatchedTarget, isBestMatchKeywordBased);

    // ================== Mode A: Listen and Speak Mode (3-Attempt Logic) ==================
    if (item.mode === "listen") {
        attemptsCount++;

        // Track the overall best score and HTML across all 3 attempts
        if (currentBestScore > bestAttemptScore) {
            bestAttemptScore = currentBestScore;
            bestAttemptHTML = currentBestHTML;
            bestAttemptSpoken = spokenText;
        }

        // Case I: Perfect Pronunciation (100% Score) - Complete turn immediately, launch popup modal
        if (currentBestScore === 100) {
            targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Target Text:</span> ${item.text1}`;
            btnMic.disabled = true; 
            btnRetry.style.display = "inline-flex"; 

            showResultModal(100, currentBestHTML, localGrammarFeedback, `🎉 Perfect! Excellent job! (◕‿◕)`, item.id);
        }
        // Case II: Under 100% and still have attempts left
        else if (attemptsCount < 3) {
            const inlineComparison = document.getElementById("comparison-result");
            inlineComparison.innerHTML = `<span style="color:#6B7280; font-size:14px;">You said: "${spokenText}"</span>`;
            statusMsg.innerText = `❌ Not quite perfect! Try again. Attempt ${attemptsCount} of 3 (•◡•). Score: ${currentBestScore}%`;
        }
        // Case III: Under 100% and used up all 3 attempts
        else {
            targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Target Text:</span> ${item.text1}`;
            btnMic.disabled = true; 
            btnRetry.style.display = "inline-flex"; 

            let finalGrammarFeedback = localGrammarFeedback;
            if (currentBestMatchedTarget) {
                const guidance = `💡 <strong>Review Tip:</strong> Practice saying: "<strong>${currentBestMatchedTarget}</strong>"`;
                finalGrammarFeedback = finalGrammarFeedback ? `${guidance}<br>${finalGrammarFeedback}` : guidance;
            }

            showResultModal(bestAttemptScore, bestAttemptHTML, finalGrammarFeedback, `😔 Out of attempts! Here is the correct answer.`, item.id);
        }
    }
    // ================== Mode B: Read/Look Mode (Immediate Evaluation Logic) ==================
    else {
        if (item.mode === "image") {
            targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Correct Answer:</span> ${targets.join(" / ")}`;
        } else {
            targetDiv.innerHTML = `<span style="font-size:12px; color:#6B7280; display:block; margin-bottom:5px;">Correct Answer:</span> ${targets.join(" / ")}`;
        }

        btnMic.disabled = true; 
        btnRetry.style.display = "inline-flex"; 

        let finalGrammarFeedback = localGrammarFeedback;
        if (currentBestMatchedTarget) {
            const guidance = `💡 <strong>Review Tip:</strong> Practice saying: "<strong>${currentBestMatchedTarget}</strong>"`;
            finalGrammarFeedback = finalGrammarFeedback ? `${guidance}<br>${finalGrammarFeedback}` : guidance;
        }

        showResultModal(currentBestScore, currentBestHTML, finalGrammarFeedback, `You said: "${spokenText}"`, item.id);
    }
}

// 10. Pop-up Modal System with Confetti & Ascending Fanfare Chime on 100%
function showResultModal(score, comparisonHTML, grammarFeedback, statusText, questionId) {
    document.getElementById("modal-score").innerText = `${score}%`;
    document.getElementById("modal-comparison").innerHTML = comparisonHTML;
    document.getElementById("modal-status").innerText = statusText;

    const tipDiv = document.getElementById("modal-grammar-tip");
    if (grammarFeedback) {
        tipDiv.innerHTML = grammarFeedback;
        tipDiv.style.display = "block";
    } else {
        tipDiv.style.display = "none";
    }

    // Launch evaluation overlay screen
    document.getElementById("evaluation-modal").style.display = "block";

    if (score === 100) {
        completedChallenges.add(questionId);
        playCelebrationSound();
        startConfetti();

        // Check if all challenges in this mode have been cleared with 100% score
        if (completedChallenges.size === filteredSentences.length) {
            setTimeout(() => {
                showMissionCompletedModal();
            }, 1000);
        }
    }
}

function closeModal() {
    document.getElementById("evaluation-modal").style.display = "none";
}

function closeModalAndRetry() {
    closeModal();
    retryCurrentSentence();
}

function closeModalAndNext() {
    closeModal();
    loadNextSentence();
}

// Mission Accomplished Pop-up (Completing 100% across all mode cards)
function showMissionCompletedModal() {
    closeModal();
    document.getElementById("mission-modal").style.display = "flex";
    playCelebrationSound();
    startConfetti();
}

function restartMission() {
    document.getElementById("mission-modal").style.display = "none";
    completedChallenges.clear();
    currentIdx = 0;
    displayCurrentItem();
}

function changeMissionMode() {
    document.getElementById("mission-modal").style.display = "none";
    goBackToSetup();
}

// ================== Celebrating Fanfare Music & Particle confetti (Web-Native, Offline, Totally Free) ==================
function playCelebrationSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Ascending major chord (Fanfare style chime)
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        const dur = 0.15;
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * dur);
            
            gain.gain.setValueAtTime(0.15, ctx.currentTime + i * dur);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i + 1) * dur);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime + i * dur);
            osc.stop(ctx.currentTime + (i + 1) * dur);
        });
    } catch (e) {
        console.error("Fanfare audio generator failed: ", e);
    }
}

let confettiActive = false;
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const colors = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#EC4899', '#3B82F6'];
    
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    
    confettiActive = true;
    let animationFrameId;
    
    function draw() {
        if (!confettiActive) {
            canvas.style.display = 'none';
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;
            
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
            
            if (p.y > canvas.height) {
                particles[index] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngleIncremental: p.tiltAngleIncremental,
                    tiltAngle: p.tiltAngle
                };
            }
        });
        
        animationFrameId = requestAnimationFrame(draw);
    }
    
    draw();
    
    // Auto-disable anim frames after 3 seconds
    setTimeout(() => {
        confettiActive = false;
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }, 3000);
}
