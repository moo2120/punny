const STORY_DATABASE = [
  // UNIT 1: Story Details (pp. 2 - 11)
  {
    id: 1,
    unit: 1,
    unitTitle: "Story Details",
    unitIcon: "🔍",
    title: "Cat in the Hat",
    emojiHero: "🐱",
    lines: [
      { text: "I see the cat.", icon: "🐱" },
      { text: "The cat is fat.", icon: "🍔" },
      { text: "The cat is in the hat.", icon: "👒" }
    ],
    vocab: ["cat", "fat", "hat", "see"],
    game: {
      type: "tap-choice",
      instruction: "Where is the cat?",
      choices: [
        { text: "in the box 📦", correct: false },
        { text: "in the hat 👒", correct: true }
      ]
    }
  },
  {
    id: 2,
    unit: 1,
    unitTitle: "Story Details",
    unitIcon: "🔍",
    title: "Dog Bath",
    emojiHero: "🐶",
    lines: [
      { text: "I see the dog.", icon: "🐶" },
      { text: "The dog has spots.", icon: "⚪" },
      { text: "The dog is in the tub.", icon: "🛁" }
    ],
    vocab: ["dog", "spots", "tub"],
    game: {
      type: "tap-choice",
      instruction: "The dog has ______.",
      choices: [
        { text: "wings 🪽", correct: false },
        { text: "spots ⚫", correct: true }
      ]
    }
  },
  {
    id: 3,
    unit: 1,
    unitTitle: "Story Details",
    unitIcon: "🔍",
    title: "The Zoo",
    emojiHero: "🐻",
    lines: [
      { text: "I go to the zoo.", icon: "🦁" },
      { text: "I go by car.", icon: "🚗" },
      { text: "I see a monkey.", icon: "🐒" },
      { text: "I see a big brown bear.", icon: "🐻" }
    ],
    vocab: ["zoo", "car", "monkey", "bear", "big"],
    game: {
      type: "tap-choice",
      instruction: "The bear is ______.",
      choices: [
        { text: "small 🐭", correct: false },
        { text: "big 🐻", correct: true }
      ]
    }
  },

  // UNIT 2: Building a Picture (pp. 12 - 17)
  {
    id: 11,
    unit: 2,
    unitTitle: "Building a Picture",
    unitIcon: "🎨",
    title: "Snowman",
    emojiHero: "⛄",
    lines: [
      { text: "I make a snowman.", icon: "⛄" },
      { text: "His hat is black.", icon: "🎩" },
      { text: "His scarf is pink.", icon: "🧣" },
      { text: "His nose is orange.", icon: "🥕" }
    ],
    vocab: ["snowman", "hat", "black", "scarf", "pink", "orange"],
    game: {
      type: "color-builder",
      instruction: "Tap the pink scarf! 🧣",
      targetColor: "pink",
      choices: [
        { text: "Black Hat 🎩", correct: false },
        { text: "Pink Scarf 🧣", correct: true },
        { text: "Orange Nose 🥕", correct: false }
      ]
    }
  },

  // UNIT 3: Story Sequence (pp. 18 - 23)
  {
    id: 17,
    unit: 3,
    unitTitle: "Story Sequence",
    unitIcon: "🎬",
    title: "Raining",
    emojiHero: "🌧️",
    lines: [
      { text: "It is raining.", icon: "🌧️" },
      { text: "The road is wet.", icon: "🛣️" },
      { text: "The bike is wet.", icon: "🚲" },
      { text: "Dad is mad.", icon: "😠" }
    ],
    vocab: ["raining", "road", "bike", "wet", "mad"],
    game: {
      type: "sequence",
      instruction: "Tap to put the story in order (1 to 4)!",
      items: [
        { step: 1, text: "🌧️ It is raining." },
        { step: 2, text: "🛣️ Road is wet." },
        { step: 3, text: "🚲 Bike is wet." },
        { step: 4, text: "😠 Dad is mad." }
      ]
    }
  },
  {
    id: 20,
    unit: 3,
    unitTitle: "Story Sequence",
    unitIcon: "🎬",
    title: "Sick Day",
    emojiHero: "🤒",
    lines: [
      { text: "Joe is sick.", icon: "🤒" },
      { text: "Joe sees the doctor.", icon: "👨‍⚕️" },
      { text: "Joe stays in bed.", icon: "🛏️" },
      { text: "Joe is great again!", icon: "😄" }
    ],
    vocab: ["sick", "doctor", "bed", "great"],
    game: {
      type: "sequence",
      instruction: "What happened first to last?",
      items: [
        { step: 1, text: "🤒 Joe is sick" },
        { step: 2, text: "👨‍⚕️ Sees doctor" },
        { step: 3, text: "🛏️ Stays in bed" },
        { step: 4, text: "😄 Great again!" }
      ]
    }
  },

  // UNIT 4: Making Predictions (pp. 24 - 29)
  {
    id: 23,
    unit: 4,
    unitTitle: "Making Predictions",
    unitIcon: "🔮",
    title: "Mom and the Cat",
    emojiHero: "🐟",
    lines: [
      { text: "Mom cooks a fish.", icon: "🍳" },
      { text: "Mom goes outside.", icon: "🚪" },
      { text: "The cat comes inside.", icon: "🐈" },
      { text: "The cat sees the fish...", icon: "👀" }
    ],
    vocab: ["cooks", "fish", "outside", "inside", "cat"],
    game: {
      type: "tap-choice",
      instruction: "What will the cat do next? 🔮",
      choices: [
        { text: "Read a book 📖", correct: false },
        { text: "Eat the delicious fish! 🐟😋", correct: true }
      ]
    }
  },

  // UNIT 5: Character Map (pp. 30 - 35)
  {
    id: 29,
    unit: 5,
    unitTitle: "Character Map",
    unitIcon: "💖",
    title: "Good Boy",
    emojiHero: "👦",
    lines: [
      { text: "Ben is a good boy.", icon: "👦" },
      { text: "He helps his dad.", icon: "👨" },
      { text: "He makes the bed.", icon: "🛏️" },
      { text: "He feeds the goat.", icon: "🐐" }
    ],
    vocab: ["good", "helps", "bed", "goat", "boy"],
    game: {
      type: "tap-choice",
      instruction: "Stamp Ben's heart trait: Ben is ______.",
      choices: [
        { text: "lazy 😴", correct: false },
        { text: "good 💖", correct: true }
      ]
    }
  },

  // UNIT 6: Compare & Contrast (pp. 36 - 41)
  {
    id: 35,
    unit: 6,
    unitTitle: "Compare & Contrast",
    unitIcon: "⚖️",
    title: "Apples",
    emojiHero: "🍎",
    lines: [
      { text: "My apple is red.", icon: "🍎" },
      { text: "Your apple is green.", icon: "🍏" },
      { text: "They grow on trees.", icon: "🌳" },
      { text: "They have sweet juice.", icon: "🧃" }
    ],
    vocab: ["apple", "red", "green", "trees", "juice"],
    game: {
      type: "venn",
      instruction: "Where does 'Grow on trees' belong?",
      item: "Grow on trees 🌳",
      target: "both",
      leftLabel: "My Apple 🍎",
      rightLabel: "Your Apple 🍏"
    }
  },

  // UNIT 7: Identifying Facts (pp. 42 - 47)
  {
    id: 41,
    unit: 7,
    unitTitle: "Identifying Facts",
    unitIcon: "✔️",
    title: "Penguins",
    emojiHero: "🐧",
    lines: [
      { text: "Penguins are birds.", icon: "🐧" },
      { text: "Penguins have wings.", icon: "🪽" },
      { text: "Penguins cannot fly.", icon: "❌" },
      { text: "Penguins love to swim!", icon: "🌊" }
    ],
    vocab: ["penguins", "birds", "wings", "fly", "swim"],
    game: {
      type: "true-false",
      instruction: "Fact Check: 'Penguins are fish.'",
      isTrue: false
    }
  },

  // UNIT 10: Cause & Effect (pp. 58 - 61)
  {
    id: 57,
    unit: 10,
    unitTitle: "Cause & Effect",
    unitIcon: "⚡",
    title: "Windy Day",
    emojiHero: "🍃",
    lines: [
      { text: "It is a windy day.", icon: "💨" },
      { text: "The leaves fall off.", icon: "🍂" },
      { text: "The leaves are everywhere.", icon: "🍁" },
      { text: "Sandy has to rake them.", icon: "🧹" }
    ],
    vocab: ["windy", "leaves", "fall", "rake"],
    game: {
      type: "tap-choice",
      instruction: "Cause: It is a windy day 💨 ➔ Effect: ______?",
      choices: [
        { text: "The sun shines ☀️", correct: false },
        { text: "The leaves fall off 🍂", correct: true }
      ]
    }
  },

  // UNIT 11: Story Elements (pp. 62 - 64)
  {
    id: 63,
    unit: 11,
    unitTitle: "Story Elements",
    unitIcon: "🧭",
    title: "Missing Kid",
    emojiHero: "🐪",
    lines: [
      { text: "The kids are at the zoo.", icon: "🦒" },
      { text: "But where is Kim?", icon: "❓" },
      { text: "Everyone looks for Kim.", icon: "🔎" },
      { text: "Kim is on the camel!", icon: "🐪" }
    ],
    vocab: ["kids", "zoo", "looks", "camel", "missing"],
    game: {
      type: "tap-choice",
      instruction: "Problem: What's wrong in the story?",
      choices: [
        { text: "It's raining 🌧️", correct: false },
        { text: "Kim is missing! 👧❓", correct: true }
      ]
    }
  }
];

// รายการหมวดหมู่ทั้งหมด 11 หมวด
const UNITS_META = [
  { id: 1, title: "Story Details", icon: "🔍", desc: "Finding key facts" },
  { id: 2, title: "Building a Picture", icon: "🎨", desc: "Color & draw" },
  { id: 3, title: "Story Sequence", icon: "🎬", desc: "Order 1-2-3-4" },
  { id: 4, title: "Making Predictions", icon: "🔮", desc: "What's next?" },
  { id: 5, title: "Character Map", icon: "💖", desc: "Feelings & traits" },
  { id: 6, title: "Compare & Contrast", icon: "⚖️", desc: "Venn Diagrams" },
  { id: 7, title: "Identifying Facts", icon: "✔️", desc: "True or False?" },
  { id: 8, title: "Classifying Details", icon: "🗂️", desc: "Sorting lines" },
  { id: 9, title: "Making Inferences", icon: "💡", desc: "Secret clues" },
  { id: 10, title: "Cause & Effect", icon: "⚡", desc: "Why it happens" },
  { id: 11, title: "Story Elements", icon: "🧭", desc: "Who, Where, Problem" }
];
