const ALL_STORIES = [
  // ================= UNIT 1: Story Details (10 เรื่อง: หน้า 2-11) =================
  {
    id: 1, unit: 1, title: "Cat in the Hat", emoji: "🐱",
    lines: [
      { text: "I see the cat.", icon: "🐱" },
      { text: "The cat is fat.", icon: "🍔" },
      { text: "The cat is in the hat.", icon: "👒" }
    ],
    vocab: ["cat", "fat", "hat", "see", "rat"],
    questions: [
      { q: "I see the ______.", choices: [{ text: "cat 🐱", correct: true }, { text: "rat 🐀", correct: false }] },
      { q: "The cat is ______.", choices: [{ text: "red 🔴", correct: false }, { text: "fat 🍔", correct: true }] },
      { q: "The cat is in ______.", choices: [{ text: "the hat 👒", correct: true }, { text: "the box 📦", correct: false }] },
      { q: "Find the hat!", choices: [{ text: "cat 🐱", correct: false }, { text: "hat 👒", correct: true }] }
    ]
  },
  {
    id: 2, unit: 1, title: "Dog Bath", emoji: "🐶",
    lines: [
      { text: "I see the dog.", icon: "🐶" },
      { text: "The dog has spots.", icon: "⚪" },
      { text: "The dog is in the tub.", icon: "🛁" }
    ],
    vocab: ["dog", "spots", "tub", "fox", "wings"],
    questions: [
      { q: "I see the ______.", choices: [{ text: "fox 🦊", correct: false }, { text: "dog 🐶", correct: true }] },
      { q: "The dog has ______.", choices: [{ text: "spots ⚫", correct: true }, { text: "wings 🪽", correct: false }] },
      { q: "The dog is in ______.", choices: [{ text: "the box 📦", correct: false }, { text: "the tub 🛁", correct: true }] },
      { q: "Find the tub!", choices: [{ text: "tub 🛁", correct: true }, { text: "dog 🐶", correct: false }] }
    ]
  },
  {
    id: 3, unit: 1, title: "Apple Jam", emoji: "🥪",
    lines: [
      { text: "He is Sam.", icon: "👦" },
      { text: "Sam likes ham.", icon: "🍖" },
      { text: "Sam likes milk.", icon: "🥛" },
      { text: "Sam likes apple jam.", icon: "🍯" }
    ],
    vocab: ["Sam", "ham", "milk", "apple", "jam"],
    questions: [
      { q: "He is ______.", choices: [{ text: "Sam 👦", correct: true }, { text: "Bam 🧒", correct: false }] },
      { q: "Sam likes ______.", choices: [{ text: "eggs 🍳", correct: false }, { text: "ham and milk 🍖🥛", correct: true }] },
      { q: "Sam likes ______ jam.", choices: [{ text: "orange 🍊", correct: false }, { text: "apple 🍎", correct: true }] },
      { q: "Find the milk!", choices: [{ text: "milk 🥛", correct: true }, { text: "jam 🍯", correct: false }] }
    ]
  },
  {
    id: 4, unit: 1, title: "Go to School", emoji: "🚌",
    lines: [
      { text: "The bus is here.", icon: "🚌" },
      { text: "Ben gets on.", icon: "👦" },
      { text: "Lucy gets on.", icon: "👧" },
      { text: "Let's go to school.", icon: "🏫" }
    ],
    vocab: ["bus", "Ben", "Lucy", "school", "car"],
    questions: [
      { q: "The ______ is here.", choices: [{ text: "car 🚗", correct: false }, { text: "bus 🚌", correct: true }] },
      { q: "______ get on the bus.", choices: [{ text: "Sam and Jo 👫", correct: false }, { text: "Ben and Lucy 👦👧", correct: true }] },
      { q: "They go to ______.", choices: [{ text: "school 🏫", correct: true }, { text: "the zoo 🦁", correct: false }] },
      { q: "Find the school!", choices: [{ text: "bus 🚌", correct: false }, { text: "school 🏫", correct: true }] }
    ]
  },
  {
    id: 5, unit: 1, title: "The Zoo", emoji: "🐻",
    lines: [
      { text: "I go to the zoo.", icon: "🦁" },
      { text: "I go by car.", icon: "🚗" },
      { text: "I see a monkey.", icon: "🐒" },
      { text: "I see a big brown bear.", icon: "🐻" }
    ],
    vocab: ["zoo", "car", "monkey", "bear", "big"],
    questions: [
      { q: "I go to the ______.", choices: [{ text: "zoo 🦁", correct: true }, { text: "pool 🏊", correct: false }] },
      { q: "I go by ______.", choices: [{ text: "bus 🚌", correct: false }, { text: "car 🚗", correct: true }] },
      { q: "The bear is ______.", choices: [{ text: "big 🐻", correct: true }, { text: "small 🐭", correct: false }] },
      { q: "Find the monkey!", choices: [{ text: "monkey 🐒", correct: true }, { text: "bear 🐻", correct: false }] }
    ]
  },
  {
    id: 6, unit: 1, title: "The Park", emoji: "🦆",
    lines: [
      { text: "I go to the park.", icon: "🌳" },
      { text: "I go by bus.", icon: "🚌" },
      { text: "I see a bird.", icon: "🐦" },
      { text: "I see a noisy yellow duck.", icon: "🦆" }
    ],
    vocab: ["park", "bus", "bird", "duck", "noisy"],
    questions: [
      { q: "I go to the ______.", choices: [{ text: "zoo 🦁", correct: false }, { text: "park 🌳", correct: true }] },
      { q: "I go by ______.", choices: [{ text: "car 🚗", correct: false }, { text: "bus 🚌", correct: true }] },
      { q: "I see ______.", choices: [{ text: "a bird 🐦", correct: true }, { text: "a bear 🐻", correct: false }] },
      { q: "Find the noisy duck!", choices: [{ text: "bird 🐦", correct: false }, { text: "duck 🦆", correct: true }] }
    ]
  },
  {
    id: 7, unit: 1, title: "My Dog", emoji: "👞",
    lines: [
      { text: "Mat is my dog.", icon: "🐶" },
      { text: "Mat is white.", icon: "⚪" },
      { text: "Mat likes to chew.", icon: "🦴" },
      { text: "Mat chews on my shoe!", icon: "👞" }
    ],
    vocab: ["dog", "white", "chew", "shoe"],
    questions: [
      { q: "Mat is ______.", choices: [{ text: "my dog 🐶", correct: true }, { text: "my cat 🐱", correct: false }] },
      { q: "Mat is ______.", choices: [{ text: "black ⚫", correct: false }, { text: "white ⚪", correct: true }] },
      { q: "Mat likes to ______.", choices: [{ text: "run 🏃", correct: false }, { text: "chew 🦴", correct: true }] },
      { q: "Find the shoe!", choices: [{ text: "shoe 👞", correct: true }, { text: "dog 🐶", correct: false }] }
    ]
  },
  {
    id: 8, unit: 1, title: "Pizza", emoji: "🍕",
    lines: [
      { text: "Mom makes a pizza.", icon: "👩‍🍳" },
      { text: "The pizza is hot.", icon: "♨️" },
      { text: "The pizza is yummy.", icon: "😋" },
      { text: "I like to eat pizza.", icon: "🍕" }
    ],
    vocab: ["pizza", "hot", "yummy", "eat", "cake"],
    questions: [
      { q: "Mom makes a ______.", choices: [{ text: "cake 🎂", correct: false }, { text: "pizza 🍕", correct: true }] },
      { q: "The pizza is ______.", choices: [{ text: "hot ♨️", correct: true }, { text: "cold 🧊", correct: false }] },
      { q: "I like to eat ______.", choices: [{ text: "pizza 🍕", correct: true }, { text: "cake 🎂", correct: false }] },
      { q: "Find the pizza!", choices: [{ text: "burger 🍔", correct: false }, { text: "pizza 🍕", correct: true }] }
    ]
  },
  {
    id: 9, unit: 1, title: "Ben's Hen", emoji: "🐔",
    lines: [
      { text: "Ben is a farmer.", icon: "👨‍🌾" },
      { text: "Ben has a hen.", icon: "🐔" },
      { text: "The hen is red.", icon: "🔴" },
      { text: "The hen lays many eggs.", icon: "🥚" }
    ],
    vocab: ["farmer", "hen", "red", "eggs", "cow"],
    questions: [
      { q: "Ben is a ______.", choices: [{ text: "teacher 👨‍🏫", correct: false }, { text: "farmer 👨‍🌾", correct: true }] },
      { q: "Ben has a ______.", choices: [{ text: "cow 🐮", correct: false }, { text: "hen 🐔", correct: true }] },
      { q: "The hen is ______.", choices: [{ text: "red 🔴", correct: true }, { text: "orange 🟠", correct: false }] },
      { q: "Find the eggs!", choices: [{ text: "eggs 🥚", correct: true }, { text: "hen 🐔", correct: false }] }
    ]
  },
  {
    id: 10, unit: 1, title: "The Balloon", emoji: "🎈",
    lines: [
      { text: "Bob has a balloon.", icon: "🎈" },
      { text: "The balloon is pink.", icon: "🌸" },
      { text: "The balloon flies away.", icon: "🪁" },
      { text: "Come back, my balloon!", icon: "🏃" }
    ],
    vocab: ["balloon", "pink", "flies", "away", "kite"],
    questions: [
      { q: "Bob has a ______.", choices: [{ text: "kite 🪁", correct: false }, { text: "balloon 🎈", correct: true }] },
      { q: "The balloon is ______.", choices: [{ text: "pink 🌸", correct: true }, { text: "yellow 🟡", correct: false }] },
      { q: "The balloon ______.", choices: [{ text: "flies away 🪁", correct: true }, { text: "pops 💥", correct: false }] },
      { q: "Find the balloon!", choices: [{ text: "boy 👦", correct: false }, { text: "balloon 🎈", correct: true }] }
    ]
  },

  // ================= UNIT 2: Building a Picture (6 เรื่อง: หน้า 12-17) =================
  {
    id: 11, unit: 2, title: "Snowman", emoji: "⛄",
    lines: [
      { text: "I make a snowman.", icon: "⛄" },
      { text: "His hat is black.", icon: "🎩" },
      { text: "His scarf is pink.", icon: "🧣" },
      { text: "His nose is orange.", icon: "🥕" }
    ],
    vocab: ["snowman", "hat", "black", "scarf", "pink", "orange"],
    questions: [
      { q: "Color the hat: What color is it?", choices: [{ text: "black 🎩", correct: true }, { text: "pink 🧣", correct: false }] },
      { q: "Color the scarf: What color is it?", choices: [{ text: "orange 🥕", correct: false }, { text: "pink 🧣", correct: true }] },
      { q: "Color the nose: What color is it?", choices: [{ text: "orange 🥕", correct: true }, { text: "black 🎩", correct: false }] },
      { q: "What did I make?", choices: [{ text: "a snowman ⛄", correct: true }, { text: "a sandcastle 🏖️", correct: false }] }
    ]
  },
  {
    id: 12, unit: 2, title: "Ladybug", emoji: "🐞",
    lines: [
      { text: "I see a red ladybug.", icon: "🐞" },
      { text: "It has six legs.", icon: "🦗" },
      { text: "It has spots.", icon: "⚫" },
      { text: "It is on the rug.", icon: "🧶" }
    ],
    vocab: ["ladybug", "red", "legs", "spots", "rug"],
    questions: [
      { q: "How many legs does it have?", choices: [{ text: "six legs 🦗", correct: true }, { text: "four legs 🐾", correct: false }] },
      { q: "The ladybug is ______.", choices: [{ text: "blue 🔵", correct: false }, { text: "red 🔴", correct: true }] },
      { q: "Where is the ladybug?", choices: [{ text: "on the rug 🧶", correct: true }, { text: "on the bed 🛏️", correct: false }] },
      { q: "It has ______.", choices: [{ text: "spots ⚫", correct: true }, { text: "stripes 🦓", correct: false }] }
    ]
  },
  {
    id: 13, unit: 2, title: "Pool Fun", emoji: "🏊",
    lines: [
      { text: "The sun is out.", icon: "☀️" },
      { text: "Jen swims in the pool.", icon: "🏊" },
      { text: "Jen eats an ice cream.", icon: "🍦" },
      { text: "Jen is happy.", icon: "😄" }
    ],
    vocab: ["sun", "swims", "pool", "ice cream", "happy"],
    questions: [
      { q: "The ______ is out.", choices: [{ text: "sun ☀️", correct: true }, { text: "moon 🌙", correct: false }] },
      { q: "Jen swims in the ______.", choices: [{ text: "sea 🌊", correct: false }, { text: "pool 🏊", correct: true }] },
      { q: "Jen eats ______.", choices: [{ text: "an ice cream 🍦", correct: true }, { text: "a hot dog 🌭", correct: false }] },
      { q: "Jen is ______.", choices: [{ text: "happy 😄", correct: true }, { text: "sad 😢", correct: false }] }
    ]
  },
  {
    id: 14, unit: 2, title: "My School", emoji: "🏫",
    lines: [
      { text: "I like my school.", icon: "🏫" },
      { text: "My school has a swing.", icon: "🪅" },
      { text: "My school has a slide.", icon: "🛝" },
      { text: "My school has a see-saw.", icon: "⚖️" }
    ],
    vocab: ["school", "swing", "slide", "see-saw"],
    questions: [
      { q: "My school has a ______.", choices: [{ text: "swing 🪅", correct: true }, { text: "car 🚗", correct: false }] },
      { q: "My school has a ______.", choices: [{ text: "boat ⛵", correct: false }, { text: "slide 🛝", correct: true }] },
      { q: "My school has a ______.", choices: [{ text: "see-saw ⚖️", correct: true }, { text: "tent ⛺", correct: false }] },
      { q: "I like my ______.", choices: [{ text: "school 🏫", correct: true }, { text: "zoo 🦁", correct: false }] }
    ]
  },
  {
    id: 15, unit: 2, title: "Giant's Home", emoji: "🏰",
    lines: [
      { text: "This is the giant's home.", icon: "🏰" },
      { text: "I see a big chair.", icon: "🪑" },
      { text: "I see a big bed.", icon: "🛏️" },
      { text: "Everything is so big!", icon: "🐘" }
    ],
    vocab: ["giant", "home", "big", "chair", "bed"],
    questions: [
      { q: "This is the ______'s home.", choices: [{ text: "giant 🧟", correct: true }, { text: "farmer 👨‍🌾", correct: false }] },
      { q: "I see a big ______.", choices: [{ text: "chair 🪑", correct: true }, { text: "hat 👒", correct: false }] },
      { q: "I see a big ______.", choices: [{ text: "bed 🛏️", correct: true }, { text: "cup 🥛", correct: false }] },
      { q: "Everything is so ______!", choices: [{ text: "big 🐘", correct: true }, { text: "small 🐭", correct: false }] }
    ]
  },
  {
    id: 16, unit: 2, title: "I Love You", emoji: "💐",
    lines: [
      { text: "I love you, Mom.", icon: "👩" },
      { text: "I love you, Dad.", icon: "👨" },
      { text: "I love you, Grandpa.", icon: "👴" },
      { text: "Happy Valentine's Day!", icon: "💖" }
    ],
    vocab: ["love", "Mom", "Dad", "Grandpa", "Valentine"],
    questions: [
      { q: "I love you, ______.", choices: [{ text: "Mom 👩", correct: true }, { text: "Dog 🐶", correct: false }] },
      { q: "I love you, ______.", choices: [{ text: "Dad 👨", correct: true }, { text: "Cat 🐱", correct: false }] },
      { q: "I love you, ______.", choices: [{ text: "Grandpa 👴", correct: true }, { text: "Teacher 👨‍🏫", correct: false }] },
      { q: "Happy ______ Day!", choices: [{ text: "Valentine's 💖", correct: true }, { text: "Sports ⚽", correct: false }] }
    ]
  },

  // ================= UNIT 3: Story Sequence (6 เรื่อง: หน้า 18-23) =================
  {
    id: 17, unit: 3, title: "Raining", emoji: "🌧️",
    lines: [
      { text: "It is raining.", icon: "🌧️" },
      { text: "The road is wet.", icon: "🛣️" },
      { text: "The bike is wet.", icon: "🚲" },
      { text: "Dad is mad.", icon: "😠" }
    ],
    vocab: ["raining", "road", "bike", "wet", "mad"],
    questions: [
      { type: "sequence", q: "Put in order (1 to 4)!", items: ["🌧️ It is raining.", "🛣️ The road is wet.", "🚲 The bike is wet.", "😠 Dad is mad."] }
    ]
  },
  {
    id: 18, unit: 3, title: "The King", emoji: "👑",
    lines: [
      { text: "He is the king.", icon: "👑" },
      { text: "The king has a gong.", icon: "🔔" },
      { text: "The king sings a song.", icon: "🎶" },
      { text: "The song is very long.", icon: "📜" }
    ],
    vocab: ["king", "gong", "sings", "song", "long"],
    questions: [
      { type: "sequence", q: "Put in order (1 to 4)!", items: ["👑 He is the king.", "🔔 The king has a gong.", "🎶 Sings a song.", "📜 The song is very long."] }
    ]
  },
  {
    id: 19, unit: 3, title: "Hat Trick", emoji: "🎩",
    lines: [
      { text: "Tim can do a hat trick.", icon: "🎩" },
      { text: "Here is a scarf.", icon: "🧣" },
      { text: "Here is a flower.", icon: "🌸" },
      { text: "Here is a bunny!", icon: "🐰" }
    ],
    vocab: ["trick", "scarf", "flower", "bunny", "hat"],
    questions: [
      { type: "sequence", q: "Put in order (1 to 4)!", items: ["🎩 Tim's hat trick.", "🧣 Here is a scarf.", "🌸 Here is a flower.", "🐰 Here is a bunny!"] }
    ]
  },
  {
    id: 20, unit: 3, title: "Sick Day", emoji: "🤒",
    lines: [
      { text: "Joe is sick.", icon: "🤒" },
      { text: "Joe sees the doctor.", icon: "👨‍⚕️" },
      { text: "Joe stays in bed.", icon: "🛏️" },
      { text: "Joe is great again!", icon: "😄" }
    ],
    vocab: ["sick", "doctor", "bed", "great"],
    questions: [
      { type: "sequence", q: "Put in order (1 to 4)!", items: ["🤒 Joe is sick.", "👨‍⚕️ Joe sees the doctor.", "🛏️ Joe stays in bed.", "😄 Joe is great again!"] }
    ]
  },
  {
    id: 21, unit: 3, title: "Nice Dream", emoji: "🍪",
    lines: [
      { text: "I have a dream.", icon: "💭" },
      { text: "It rains candy.", icon: "🍬" },
      { text: "It rains cookies.", icon: "🍪" },
      { text: "Then I wake up.", icon: "⏰" }
    ],
    vocab: ["dream", "candy", "cookies", "wake", "up"],
    questions: [
      { type: "sequence", q: "Put in order (1 to 4)!", items: ["💭 I have a dream.", "🍬 It rains candy.", "🍪 It rains cookies.", "⏰ Then I wake up."] }
    ]
  },
  {
    id: 22, unit: 3, title: "Santa", emoji: "🎅",
    lines: [
      { text: "Santa comes to my school.", icon: "🏫" },
      { text: "Santa has a big bag.", icon: "🎒" },
      { text: "Santa has a gift for me.", icon: "🎁" },
      { text: "Thank you, Santa!", icon: "🎅" }
    ],
    vocab: ["Santa", "school", "bag", "gift", "thank"],
    questions: [
      { type: "sequence", q: "Put in order (1 to 4)!", items: ["🏫 Santa comes to school.", "🎒 Santa has a big bag.", "🎁 Gift for me.", "🎅 Thank you, Santa!"] }
    ]
  },

  // ================= UNIT 4: Making Predictions (6 เรื่อง: หน้า 24-29) =================
  {
    id: 23, unit: 4, title: "Mom and the Cat", emoji: "🐟",
    lines: [
      { text: "Mom cooks a fish.", icon: "🍳" },
      { text: "Mom goes outside.", icon: "🚪" },
      { text: "The cat comes inside.", icon: "🐈" },
      { text: "The cat sees the fish...", icon: "👀" }
    ],
    vocab: ["cooks", "fish", "outside", "inside", "cat"],
    questions: [
      { q: "Mom cooks a ______.", choices: [{ text: "fish 🐟", correct: true }, { text: "chicken 🍗", correct: false }] },
      { q: "Mom goes ______.", choices: [{ text: "inside 🏠", correct: false }, { text: "outside 🌳", correct: true }] },
      { q: "The cat comes ______.", choices: [{ text: "inside 🏠", correct: true }, { text: "outside 🌳", correct: false }] },
      { q: "🔮 Predict: The cat will ______.", choices: [{ text: "eat the fish! 🐟😋", correct: true }, { text: "wash dishes 🧼", correct: false }] }
    ]
  },
  {
    id: 24, unit: 4, title: "Jay's Trip", emoji: "⛺",
    lines: [
      { text: "Jay has a tent.", icon: "⛺" },
      { text: "Jay has a map.", icon: "🗺️" },
      { text: "Jay has a bag of food.", icon: "🥪" },
      { text: "Jay goes to the hill...", icon: "⛰️" }
    ],
    vocab: ["tent", "map", "food", "hill", "trip"],
    questions: [
      { q: "Who is this?", choices: [{ text: "Jay 👦", correct: true }, { text: "Jack 🧒", correct: false }] },
      { q: "Jay has a ______.", choices: [{ text: "mat 🧶", correct: false }, { text: "tent ⛺", correct: true }] },
      { q: "What's in the bag?", choices: [{ text: "food 🥪", correct: true }, { text: "books 📚", correct: false }] },
      { q: "🔮 Predict: Jay will ______.", choices: [{ text: "sleep in the tent ⛺", correct: true }, { text: "ride a boat ⛵", correct: false }] }
    ]
  },
  {
    id: 25, unit: 4, title: "Bell the Cook", emoji: "👩‍🍳",
    lines: [
      { text: "Bell likes to cook.", icon: "🍳" },
      { text: "Bell is in the kitchen.", icon: "🥣" },
      { text: "She opens a cook book.", icon: "📖" },
      { text: "She puts on a cook hat...", icon: "👩‍🍳" }
    ],
    vocab: ["cook", "kitchen", "book", "hat"],
    questions: [
      { q: "Bell likes to ______.", choices: [{ text: "cook 🍳", correct: true }, { text: "run 🏃", correct: false }] },
      { q: "Bell reads a ______.", choices: [{ text: "story book 📚", correct: false }, { text: "cook book 📖", correct: true }] },
      { q: "Bell puts on ______.", choices: [{ text: "a cook hat 👩‍🍳", correct: true }, { text: "shoes 👟", correct: false }] },
      { q: "🔮 Predict: Bell will ______.", choices: [{ text: "cook yummy food 🍳", correct: true }, { text: "draw pictures 🎨", correct: false }] }
    ]
  },
  {
    id: 26, unit: 4, title: "The Cinema", emoji: "🍿",
    lines: [
      { text: "I go to the cinema.", icon: "🎬" },
      { text: "I buy a ticket.", icon: "🎟️" },
      { text: "I buy popcorn.", icon: "🍿" },
      { text: "I sit down in my seat...", icon: "💺" }
    ],
    vocab: ["cinema", "ticket", "popcorn", "seat"],
    questions: [
      { q: "I go to ______.", choices: [{ text: "the park 🌳", correct: false }, { text: "the cinema 🎬", correct: true }] },
      { q: "I buy a ______.", choices: [{ text: "ticket 🎟️", correct: true }, { text: "DVD 💿", correct: false }] },
      { q: "I will eat ______.", choices: [{ text: "popcorn 🍿", correct: true }, { text: "cookies 🍪", correct: false }] },
      { q: "🔮 Predict: I will ______.", choices: [{ text: "watch a movie 🎥", correct: true }, { text: "read a book 📖", correct: false }] }
    ]
  },
  {
    id: 27, unit: 4, title: "Sad Bird", emoji: "🦜",
    lines: [
      { text: "I see a bird.", icon: "🐦" },
      { text: "It is in the cage.", icon: "🪤" },
      { text: "It looks sad.", icon: "😢" },
      { text: "I think it wants to fly...", icon: "🪽" }
    ],
    vocab: ["bird", "cage", "sad", "fly"],
    questions: [
      { q: "I see a ______.", choices: [{ text: "bird 🐦", correct: true }, { text: "duck 🦆", correct: false }] },
      { q: "Where is it?", choices: [{ text: "in the cage 🪤", correct: true }, { text: "in the tree 🌳", correct: false }] },
      { q: "The bird is ______.", choices: [{ text: "happy 😄", correct: false }, { text: "sad 😢", correct: true }] },
      { q: "🔮 Predict: I will ______.", choices: [{ text: "open the cage to let it fly 🕊️", correct: true }, { text: "sing to it in cage 🎶", correct: false }] }
    ]
  },
  {
    id: 28, unit: 4, title: "Spaceman", emoji: "🚀",
    lines: [
      { text: "This is Billy.", icon: "👨‍🚀" },
      { text: "Billy is a spaceman.", icon: "🌌" },
      { text: "He is in a spaceship.", icon: "🚀" },
      { text: "He puts on a spacesuit...", icon: "🧑‍🚀" }
    ],
    vocab: ["Billy", "spaceman", "spaceship", "spacesuit"],
    questions: [
      { q: "Who is he?", choices: [{ text: "Billy 🧑‍🚀", correct: true }, { text: "Joe 👦", correct: false }] },
      { q: "Billy is a ______.", choices: [{ text: "spaceman 👨‍🚀", correct: true }, { text: "spacesuit 🥼", correct: false }] },
      { q: "Billy is in a ______.", choices: [{ text: "car 🚗", correct: false }, { text: "spaceship 🚀", correct: true }] },
      { q: "🔮 Predict: He will ______.", choices: [{ text: "walk in space 🌌", correct: true }, { text: "swim in pool 🏊", correct: false }] }
    ]
  },

  // ================= UNIT 5: Character Map (6 เรื่อง: หน้า 30-35) =================
  {
    id: 29, unit: 5, title: "Good Boy", emoji: "👦",
    lines: [
      { text: "Ben is a good boy.", icon: "👦" },
      { text: "He helps his dad.", icon: "👨" },
      { text: "He makes the bed.", icon: "🛏️" },
      { text: "He feeds the goat.", icon: "🐐" }
    ],
    vocab: ["good", "helps", "bed", "goat", "boy"],
    questions: [
      { q: "Who is this?", choices: [{ text: "Ben 👦", correct: true }, { text: "Tom 🧒", correct: false }] },
      { q: "Ben helps ______.", choices: [{ text: "his mom 👩", correct: false }, { text: "his dad 👨", correct: true }] },
      { q: "Ben feeds the ______.", choices: [{ text: "goat 🐐", correct: true }, { text: "pig 🐷", correct: false }] },
      { q: "Ben is a ______ boy.", choices: [{ text: "good 💖", correct: true }, { text: "bad 👿", correct: false }] }
    ]
  },
  {
    id: 30, unit: 5, title: "Funny Pig", emoji: "🐷",
    lines: [
      { text: "I have a pig.", icon: "🐷" },
      { text: "My pig is funny.", icon: "😜" },
      { text: "He likes to dig.", icon: "🌱" },
      { text: "He likes to sit in the mud.", icon: "💩" }
    ],
    vocab: ["pig", "funny", "dig", "mud"],
    questions: [
      { q: "What is this?", choices: [{ text: "a mouse 🐭", correct: false }, { text: "a pig 🐷", correct: true }] },
      { q: "He likes to ______.", choices: [{ text: "sleep 😴", correct: false }, { text: "dig 🌱", correct: true }] },
      { q: "He likes to sit ______.", choices: [{ text: "in the mud 💩", correct: true }, { text: "on my lap 👖", correct: false }] },
      { q: "My pig is ______.", choices: [{ text: "funny 😜", correct: true }, { text: "sleepy 🥱", correct: false }] }
    ]
  },
  {
    id: 31, unit: 5, title: "Little Tina", emoji: "👧",
    lines: [
      { text: "Tina is my sister.", icon: "👧" },
      { text: "She is five years old.", icon: "5️⃣" },
      { text: "She has red hair.", icon: "👩‍🦰" },
      { text: "She does not like spiders.", icon: "🕷️" }
    ],
    vocab: ["Tina", "sister", "five", "hair", "spiders"],
    questions: [
      { q: "Her name is ______.", choices: [{ text: "Tina 👧", correct: true }, { text: "Bob 👦", correct: false }] },
      { q: "How old is she?", choices: [{ text: "8 years old 8️⃣", correct: false }, { text: "5 years old 5️⃣", correct: true }] },
      { q: "Her hair is ______.", choices: [{ text: "blue 🔵", correct: false }, { text: "red 🔴", correct: true }] },
      { q: "Does Tina like spiders?", choices: [{ text: "No! ☹️", correct: true }, { text: "Yes! 🙂", correct: false }] }
    ]
  },
  {
    id: 32, unit: 5, title: "My Friend", emoji: "✈️",
    lines: [
      { text: "Jill is my friend.", icon: "👧" },
      { text: "She is 12 years old.", icon: "🔢" },
      { text: "She has black hair.", icon: "💇‍♀️" },
      { text: "She likes to fly in a plane.", icon: "✈️" }
    ],
    vocab: ["Jill", "friend", "twelve", "hair", "plane"],
    questions: [
      { q: "Her name is ______.", choices: [{ text: "Bell 👩", correct: false }, { text: "Jill 👧", correct: true }] },
      { q: "How old is she?", choices: [{ text: "five 5️⃣", correct: false }, { text: "twelve 1️⃣2️⃣", correct: true }] },
      { q: "Her hair is ______.", choices: [{ text: "black ⚫", correct: true }, { text: "red 🔴", correct: false }] },
      { q: "Does Jill like to fly?", choices: [{ text: "Yes! 🙂", correct: true }, { text: "No! ☹️", correct: false }] }
    ]
  },
  {
    id: 33, unit: 5, title: "Lazy Tom", emoji: "😴",
    lines: [
      { text: "Tom is a boy.", icon: "👦" },
      { text: "He is very lazy.", icon: "🦥" },
      { text: "He sleeps until noon.", icon: "🕛" },
      { text: "His mom is not happy.", icon: "😠" }
    ],
    vocab: ["Tom", "lazy", "sleeps", "noon", "happy"],
    questions: [
      { q: "Who is this?", choices: [{ text: "Tom 👦", correct: true }, { text: "Tim 🧒", correct: false }] },
      { q: "He sleeps until ______.", choices: [{ text: "noon 🕛", correct: true }, { text: "6 o'clock 🕕", correct: false }] },
      { q: "Who is not happy?", choices: [{ text: "Tom 👦", correct: false }, { text: "his mom 👩", correct: true }] },
      { q: "Tom is a ______ boy.", choices: [{ text: "funny 😄", correct: false }, { text: "lazy 🦥", correct: true }] }
    ]
  },
  {
    id: 34, unit: 5, title: "Smart Seal", emoji: "🦭",
    lines: [
      { text: "I see a seal at the zoo.", icon: "🦭" },
      { text: "It has a big ball.", icon: "🏐" },
      { text: "The ball is on its nose.", icon: "👃" },
      { text: "The seal is smart!", icon: "🧠" }
    ],
    vocab: ["seal", "zoo", "ball", "nose", "smart"],
    questions: [
      { q: "I see a ______.", choices: [{ text: "lion 🦁", correct: false }, { text: "seal 🦭", correct: true }] },
      { q: "It has a ______.", choices: [{ text: "big ball 🏐", correct: true }, { text: "big fish 🐟", correct: false }] },
      { q: "Where is the ball?", choices: [{ text: "on its head 🧑", correct: false }, { text: "on its nose 👃", correct: true }] },
      { q: "The seal is ______.", choices: [{ text: "smart 🧠", correct: true }, { text: "lazy 🦥", correct: false }] }
    ]
  },

  // ================= UNIT 6: Compare & Contrast (6 เรื่อง: หน้า 36-41) =================
  {
    id: 35, unit: 6, title: "Apples", emoji: "🍎",
    lines: [
      { text: "My apple is red.", icon: "🍎" },
      { text: "Your apple is green.", icon: "🍏" },
      { text: "They grow on trees.", icon: "🌳" },
      { text: "They have sweet juice.", icon: "🧃" }
    ],
    vocab: ["apple", "red", "green", "trees", "juice"],
    questions: [
      { type: "venn", q: "Where does 'Grow on trees' go?", item: "grow on trees 🌳", target: "both", left: "My apple 🍎", right: "Your apple 🍏" },
      { type: "venn", q: "Where does 'Red' go?", item: "red 🍎", target: "left", left: "My apple 🍎", right: "Your apple 🍏" },
      { type: "venn", q: "Where does 'Green' go?", item: "green 🍏", target: "right", left: "My apple 🍎", right: "Your apple 🍏" }
    ]
  },
  {
    id: 36, unit: 6, title: "Sheep and Cows", emoji: "🐑",
    lines: [
      { text: "Sheep give us wool.", icon: "🧶" },
      { text: "Cows give us milk.", icon: "🥛" },
      { text: "They have four legs.", icon: "🐾" },
      { text: "They live on the farm.", icon: "🚜" }
    ],
    vocab: ["sheep", "wool", "cows", "milk", "farm"],
    questions: [
      { type: "venn", q: "Where does 'Give us wool' go?", item: "wool 🧶", target: "left", left: "Sheep 🐑", right: "Cows 🐄" },
      { type: "venn", q: "Where does 'Give us milk' go?", item: "milk 🥛", target: "right", left: "Sheep 🐑", right: "Cows 🐄" },
      { type: "venn", q: "Where does 'Live on the farm' go?", item: "farm 🚜", target: "both", left: "Sheep 🐑", right: "Cows 🐄" }
    ]
  },
  {
    id: 37, unit: 6, title: "Bike and Car", emoji: "🚲",
    lines: [
      { text: "A bike has two wheels.", icon: "🚲" },
      { text: "A car has four wheels.", icon: "🚗" },
      { text: "They can go fast.", icon: "💨" },
      { text: "They take you to fun places.", icon: "🎡" }
    ],
    vocab: ["bike", "car", "wheels", "fast", "places"],
    questions: [
      { type: "venn", q: "Where does 'Two wheels' go?", item: "two wheels 🚲", target: "left", left: "Bike 🚲", right: "Car 🚗" },
      { type: "venn", q: "Where does 'Four wheels' go?", item: "four wheels 🚗", target: "right", left: "Bike 🚲", right: "Car 🚗" },
      { type: "venn", q: "Where does 'Go fast' go?", item: "go fast 💨", target: "both", left: "Bike 🚲", right: "Car 🚗" }
    ]
  },
  {
    id: 38, unit: 6, title: "Kim and Tim", emoji: "⚽",
    lines: [
      { text: "Tim and Kim like football.", icon: "⚽" },
      { text: "Tim is tall.", icon: "🦒" },
      { text: "Kim is fast.", icon: "🐆" },
      { text: "They win the game.", icon: "🏆" },
      { text: "They make a good team!", icon: "🤝" }
    ],
    vocab: ["football", "tall", "fast", "team", "game"],
    questions: [
      { type: "venn", q: "Where does 'Tall' go?", item: "tall 🦒", target: "left", left: "Tim 👦", right: "Kim 👧" },
      { type: "venn", q: "Where does 'Fast' go?", item: "fast 🐆", target: "right", left: "Tim 👦", right: "Kim 👧" },
      { type: "venn", q: "Where does 'Like football' go?", item: "football ⚽", target: "both", left: "Tim 👦", right: "Kim 👧" }
    ]
  },
  {
    id: 39, unit: 6, title: "Whale and Mouse", emoji: "🐋",
    lines: [
      { text: "A whale is big.", icon: "🐋" },
      { text: "A mouse is small.", icon: "🐭" },
      { text: "They have babies.", icon: "👶" },
      { text: "The babies drink milk.", icon: "🍼" }
    ],
    vocab: ["whale", "big", "mouse", "small", "babies"],
    questions: [
      { type: "venn", q: "Where does 'Big' go?", item: "big 🐋", target: "left", left: "Whale 🐋", right: "Mouse 🐭" },
      { type: "venn", q: "Where does 'Small' go?", item: "small 🐭", target: "right", left: "Whale 🐋", right: "Mouse 🐭" },
      { type: "venn", q: "Where does 'Have babies' go?", item: "have babies 👶", target: "both", left: "Whale 🐋", right: "Mouse 🐭" }
    ]
  },
  {
    id: 40, unit: 6, title: "Fun Park", emoji: "🎡",
    lines: [
      { text: "Sam and Ben go to the fun park.", icon: "🎡" },
      { text: "Sam likes the castle.", icon: "🏰" },
      { text: "Ben likes the go-kart.", icon: "🏎️" },
      { text: "They like the hot dogs.", icon: "🌭" }
    ],
    vocab: ["park", "castle", "kart", "hot dogs"],
    questions: [
      { type: "venn", q: "Where does 'Go-kart' go?", item: "go-kart 🏎️", target: "left", left: "Ben 👦", right: "Sam 🧒" },
      { type: "venn", q: "Where does 'Castle' go?", item: "castle 🏰", target: "right", left: "Ben 👦", right: "Sam 🧒" },
      { type: "venn", q: "Where does 'Like hot dogs' go?", item: "hot dogs 🌭", target: "both", left: "Ben 👦", right: "Sam 🧒" }
    ]
  },

  // ================= UNIT 7: Identifying Facts (6 เรื่อง: หน้า 42-47) =================
  {
    id: 41, unit: 7, title: "Penguins", emoji: "🐧",
    lines: [
      { text: "Penguins are birds.", icon: "🐧" },
      { text: "Penguins have wings.", icon: "🪽" },
      { text: "Penguins cannot fly.", icon: "❌" },
      { text: "Penguins love to swim!", icon: "🏊" }
    ],
    vocab: ["penguins", "birds", "wings", "fly", "swim"],
    questions: [
      { q: "Fact Check: 'Penguins are birds.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'Penguins are fish.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'Penguins have wings.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'Penguins cannot fly.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'Penguins love to swim.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] }
    ]
  },
  {
    id: 42, unit: 7, title: "The Beach", emoji: "🏖️",
    lines: [
      { text: "I go to the beach.", icon: "🏖️" },
      { text: "I make a sandcastle.", icon: "🏰" },
      { text: "I swim in the sea.", icon: "🌊" },
      { text: "I see many fish.", icon: "🐟" }
    ],
    vocab: ["beach", "sandcastle", "swim", "sea", "fish"],
    questions: [
      { q: "Fact Check: 'I go to the beach.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'I make a cake.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'I swim in the sea.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'I see many birds.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'I see many fish.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] }
    ]
  },
  {
    id: 43, unit: 7, title: "Our Homes", emoji: "🏠",
    lines: [
      { text: "Bears live in caves.", icon: "🕳️" },
      { text: "Birds live in trees.", icon: "🌳" },
      { text: "Ants live in the ground.", icon: "🐜" },
      { text: "I live in a house.", icon: "🏠" }
    ],
    vocab: ["caves", "trees", "ground", "house", "live"],
    questions: [
      { q: "Fact Check: 'Bears live in caves.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'Bears live in the ground.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'Birds live in trees.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'Ants live in the ground.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'I live in a house.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] }
    ]
  },
  {
    id: 44, unit: 7, title: "Three Eggs", emoji: "🥚",
    lines: [
      { text: "We find 3 eggs in the yard.", icon: "🏡" },
      { text: "Are they goose eggs?", icon: "🪿" },
      { text: "Are they bird eggs?", icon: "🐦" },
      { text: "Oh, they are duck eggs!", icon: "🦆" }
    ],
    vocab: ["yard", "goose", "bird", "duck", "eggs"],
    questions: [
      { q: "Fact Check: 'We find three eggs.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'We find five eggs.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'They are goose eggs.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'They are bird eggs.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'They are duck eggs.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] }
    ]
  },
  {
    id: 45, unit: 7, title: "The Sun", emoji: "☀️",
    lines: [
      { text: "The sun is big.", icon: "☀️" },
      { text: "The sun is hot.", icon: "♨️" },
      { text: "The sun is round.", icon: "🟠" },
      { text: "The sun is far, far away.", icon: "✨" }
    ],
    vocab: ["sun", "big", "hot", "round", "away"],
    questions: [
      { q: "Fact Check: 'The sun is small.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'The sun is big.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'The sun is hot.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'The sun is flat.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'The sun is far away.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] }
    ]
  },
  {
    id: 46, unit: 7, title: "The Rocket", emoji: "🚀",
    lines: [
      { text: "I see a rocket.", icon: "🚀" },
      { text: "The rocket is fast.", icon: "💨" },
      { text: "The rocket is white.", icon: "⚪" },
      { text: "The rocket goes to the moon.", icon: "🌙" }
    ],
    vocab: ["rocket", "fast", "white", "moon", "ship"],
    questions: [
      { q: "Fact Check: 'I see a rocket.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'I see a ship.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'The rocket is black.'", choices: [{ text: "✅ TRUE", correct: false }, { text: "❌ FALSE", correct: true }] },
      { q: "Fact Check: 'The rocket is fast.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] },
      { q: "Fact Check: 'The rocket goes to the moon.'", choices: [{ text: "✅ TRUE", correct: true }, { text: "❌ FALSE", correct: false }] }
    ]
  },

  // ================= UNIT 8: Classifying Details (6 เรื่อง: หน้า 48-53) =================
  {
    id: 47, unit: 8, title: "How Are You?", emoji: "😊",
    lines: [
      { text: "How are you today?", icon: "❓" },
      { text: "Ben is sad.", icon: "😢" },
      { text: "John is happy.", icon: "😄" },
      { text: "Emma is sleepy.", icon: "🥱" }
    ],
    vocab: ["sad", "happy", "sleepy", "today"],
    questions: [
      { q: "Ben is ______.", choices: [{ text: "sad 😢", correct: true }, { text: "happy 😄", correct: false }] },
      { q: "John is ______.", choices: [{ text: "sleepy 🥱", correct: false }, { text: "happy 😄", correct: true }] },
      { q: "Emma is ______.", choices: [{ text: "sleepy 🥱", correct: true }, { text: "sad 😢", correct: false }] }
    ]
  },
  {
    id: 48, unit: 8, title: "Lunch Time", emoji: "🌭",
    lines: [
      { text: "It's lunch time.", icon: "⏰" },
      { text: "Sam eats a pizza.", icon: "🍕" },
      { text: "Jen eats a hot dog.", icon: "🌭" },
      { text: "Mat eats a big bone.", icon: "🦴" }
    ],
    vocab: ["lunch", "pizza", "hot dog", "bone", "eats"],
    questions: [
      { q: "Sam eats ______.", choices: [{ text: "a pizza 🍕", correct: true }, { text: "a bone 🦴", correct: false }] },
      { q: "Jen eats ______.", choices: [{ text: "a pizza 🍕", correct: false }, { text: "a hot dog 🌭", correct: true }] },
      { q: "Mat eats ______.", choices: [{ text: "a big bone 🦴", correct: true }, { text: "a hot dog 🌭", correct: false }] }
    ]
  },
  {
    id: 49, unit: 8, title: "Sports Day", emoji: "🏃",
    lines: [
      { text: "Today is Sports Day.", icon: "🏅" },
      { text: "Max will run.", icon: "🏃" },
      { text: "Tony will jump.", icon: "🦘" },
      { text: "Kate will throw a disc.", icon: "🥏" }
    ],
    vocab: ["sports", "run", "jump", "throw", "disc"],
    questions: [
      { q: "Max will ______.", choices: [{ text: "run 🏃", correct: true }, { text: "jump 🦘", correct: false }] },
      { q: "Tony will ______.", choices: [{ text: "throw 🥏", correct: false }, { text: "jump 🦘", correct: true }] },
      { q: "Kate will ______.", choices: [{ text: "throw a disc 🥏", correct: true }, { text: "run 🏃", correct: false }] }
    ]
  },
  {
    id: 50, unit: 8, title: "Lucy the Bear", emoji: "🐻",
    lines: [
      { text: "Lucy is a bear.", icon: "🐻" },
      { text: "Lucy has a cub.", icon: "🧸" },
      { text: "Lucy eats fish.", icon: "🐟" },
      { text: "Lucy can climb.", icon: "🧗" }
    ],
    vocab: ["bear", "cub", "fish", "climb"],
    questions: [
      { q: "Lucy is a ______.", choices: [{ text: "bear 🐻", correct: true }, { text: "cub 🧸", correct: false }] },
      { q: "Lucy has a ______.", choices: [{ text: "fish 🐟", correct: false }, { text: "cub 🧸", correct: true }] },
      { q: "Lucy eats ______.", choices: [{ text: "fish 🐟", correct: true }, { text: "tree 🌳", correct: false }] },
      { q: "Lucy can ______.", choices: [{ text: "climb 🧗", correct: true }, { text: "fly 🪽", correct: false }] }
    ]
  },
  {
    id: 51, unit: 8, title: "Jobs", emoji: "🚒",
    lines: [
      { text: "My dad is a fireman.", icon: "👨‍🚒" },
      { text: "He drives a red truck.", icon: "🚒" },
      { text: "My mom is a vet.", icon: "👩‍⚕️" },
      { text: "She drives a green van.", icon: "🚐" }
    ],
    vocab: ["fireman", "truck", "vet", "van", "drives"],
    questions: [
      { q: "My dad is a ______.", choices: [{ text: "fireman 👨‍🚒", correct: true }, { text: "vet 👩‍⚕️", correct: false }] },
      { q: "Dad drives a ______.", choices: [{ text: "red truck 🚒", correct: true }, { text: "green van 🚐", correct: false }] },
      { q: "My mom is a ______.", choices: [{ text: "fireman 👨‍🚒", correct: false }, { text: "vet 👩‍⚕️", correct: true }] },
      { q: "Mom drives a ______.", choices: [{ text: "green van 🚐", correct: true }, { text: "red truck 🚒", correct: false }] }
    ]
  },
  {
    id: 52, unit: 8, title: "Brother and Sister", emoji: "🏀",
    lines: [
      { text: "Joe is my brother.", icon: "👦" },
      { text: "He likes basketball.", icon: "🏀" },
      { text: "Jane is my sister.", icon: "👧" },
      { text: "She likes horse riding.", icon: "🏇" }
    ],
    vocab: ["brother", "sister", "basketball", "horse"],
    questions: [
      { q: "Joe is my ______.", choices: [{ text: "brother 👦", correct: true }, { text: "sister 👧", correct: false }] },
      { q: "Joe likes ______.", choices: [{ text: "basketball 🏀", correct: true }, { text: "horse riding 🏇", correct: false }] },
      { q: "Jane is my ______.", choices: [{ text: "brother 👦", correct: false }, { text: "sister 👧", correct: true }] },
      { q: "Jane likes ______.", choices: [{ text: "horse riding 🏇", correct: true }, { text: "basketball 🏀", correct: false }] }
    ]
  },

  // ================= UNIT 9: Making Inferences (4 เรื่อง: หน้า 54-57) =================
  {
    id: 53, unit: 9, title: "How Many?", emoji: "🐠",
    lines: [
      { text: "The blue fish is swimming.", icon: "🐟" },
      { text: "The red fish is eating.", icon: "🥩" },
      { text: "The white fish is sleeping.", icon: "💤" },
      { text: "The black fish is looking at me.", icon: "👀" }
    ],
    vocab: ["blue", "red", "white", "black", "fish"],
    questions: [
      { q: "Who is swimming?", choices: [{ text: "the blue fish 🐟", correct: true }, { text: "the red fish 🐠", correct: false }] },
      { q: "The red fish is ______.", choices: [{ text: "eating 🥩", correct: true }, { text: "swimming 🏊", correct: false }] },
      { q: "Who is sleeping?", choices: [{ text: "the white fish 💤", correct: true }, { text: "the black fish 👀", correct: false }] },
      { q: "💡 Count: How many fish in all?", choices: [{ text: "four (4) 🐠", correct: true }, { text: "three (3) 🐟", correct: false }] }
    ]
  },
  {
    id: 54, unit: 9, title: "A Nice Bath", emoji: "🛁",
    lines: [
      { text: "Mom opens the tap.", icon: "🚰" },
      { text: "Mom fills the tub.", icon: "🛁" },
      { text: "Mom makes bubbles.", icon: "🫧" },
      { text: "Mom has a nice bath.", icon: "🧖‍♀️" }
    ],
    vocab: ["tap", "tub", "bubbles", "bath"],
    questions: [
      { q: "Mom opens ______.", choices: [{ text: "the tap 🚰", correct: true }, { text: "the door 🚪", correct: false }] },
      { q: "Mom fills the ______.", choices: [{ text: "glass 🥛", correct: false }, { text: "tub 🛁", correct: true }] },
      { q: "Mom makes ______.", choices: [{ text: "bubbles 🫧", correct: true }, { text: "soup 🍲", correct: false }] },
      { q: "💡 Infer: Where is Mom?", choices: [{ text: "in the bathroom 🛁", correct: true }, { text: "in the kitchen 🍳", correct: false }] }
    ]
  },
  {
    id: 55, unit: 9, title: "Magic", emoji: "🧙‍♀️",
    lines: [
      { text: "She has a black cat.", icon: "🐈‍⬛" },
      { text: "She has a magic ball.", icon: "🔮" },
      { text: "She has a magic wand.", icon: "🪄" },
      { text: "She has a magic broom.", icon: "🧹" }
    ],
    vocab: ["black", "magic", "wand", "broom", "cat"],
    questions: [
      { q: "The cat is ______.", choices: [{ text: "black 🐈‍⬛", correct: true }, { text: "white 🐈", correct: false }] },
      { q: "She has a ______.", choices: [{ text: "magic ball 🔮", correct: true }, { text: "beach ball 🏖️", correct: false }] },
      { q: "She has a ______.", choices: [{ text: "magic car 🚗", correct: false }, { text: "magic wand 🪄", correct: true }] },
      { q: "💡 Infer: Who is she?", choices: [{ text: "a witch 🧙‍♀️", correct: true }, { text: "a doctor 👩‍⚕️", correct: false }] }
    ]
  },
  {
    id: 56, unit: 9, title: "Birthday", emoji: "🎂",
    lines: [
      { text: "I am 7 years old.", icon: "7️⃣" },
      { text: "Dad is 40 years old.", icon: "4️⃣0️⃣" },
      { text: "Our birthday is on April 4.", icon: "📅" },
      { text: "Happy Birthday!", icon: "🎂" }
    ],
    vocab: ["birthday", "seven", "forty", "April"],
    questions: [
      { q: "I am ______ years old.", choices: [{ text: "seven 7️⃣", correct: true }, { text: "forty 4️⃣0️⃣", correct: false }] },
      { q: "Who is 40 years old?", choices: [{ text: "Dad 👨", correct: true }, { text: "Grandpa 👴", correct: false }] },
      { q: "Our birthday is on ______.", choices: [{ text: "April 4 📅", correct: true }, { text: "April 7 📅", correct: false }] },
      { q: "💡 Math clue: Next year, I will be ______.", choices: [{ text: "8 years old 8️⃣", correct: true }, { text: "41 years old 4️⃣1️⃣", correct: false }] }
    ]
  },

  // ================= UNIT 10: Cause & Effect (4 เรื่อง: หน้า 58-61) =================
  {
    id: 57, unit: 10, title: "Windy Day", emoji: "🍂",
    lines: [
      { text: "It is a windy day.", icon: "💨" },
      { text: "The leaves fall off.", icon: "🍂" },
      { text: "The leaves are everywhere.", icon: "🍁" },
      { text: "Sandy has to rake them.", icon: "🧹" }
    ],
    vocab: ["windy", "leaves", "fall", "rake"],
    questions: [
      { q: "Cause: It is a windy day 💨 ➔ Effect: ______", choices: [{ text: "The leaves fall off 🍂", correct: true }, { text: "The sun shines ☀️", correct: false }] },
      { q: "Cause: Leaves are everywhere 🍁 ➔ Effect: ______", choices: [{ text: "Sandy has to rake them 🧹", correct: true }, { text: "Go to sleep 😴", correct: false }] }
    ]
  },
  {
    id: 58, unit: 10, title: "Scary Dragon", emoji: "🐉",
    lines: [
      { text: "The dragon is scary.", icon: "🐉" },
      { text: "Everyone is scared.", icon: "😱" },
      { text: "A prince kills the dragon.", icon: "🤴" },
      { text: "Everyone is safe!", icon: "🛡️" }
    ],
    vocab: ["dragon", "scary", "prince", "safe", "kills"],
    questions: [
      { q: "Cause: The dragon is scary 🐉 ➔ Effect: ______", choices: [{ text: "Everyone is scared 😱", correct: true }, { text: "Everyone laughs 😂", correct: false }] },
      { q: "Cause: Prince defeats dragon 🤴 ➔ Effect: ______", choices: [{ text: "Everyone is safe! 🛡️", correct: true }, { text: "Dragon wins 🐉", correct: false }] }
    ]
  },
  {
    id: 59, unit: 10, title: "New Year Balloons", emoji: "🎈",
    lines: [
      { text: "Today is New Year's Day.", icon: "🎉" },
      { text: "I blow the balloons.", icon: "🎈" },
      { text: "I blow them too big.", icon: "😮" },
      { text: "The balloons pop!", icon: "💥" }
    ],
    vocab: ["balloons", "blow", "big", "pop"],
    questions: [
      { q: "Cause: Today is New Year's Day 🎉 ➔ Effect: ______", choices: [{ text: "I blow the balloons 🎈", correct: true }, { text: "I sleep 😴", correct: false }] },
      { q: "Cause: I blow them too big 😮 ➔ Effect: ______", choices: [{ text: "The balloons pop! 💥", correct: true }, { text: "They freeze 🧊", correct: false }] }
    ]
  },
  {
    id: 60, unit: 10, title: "Rabbit Problem", emoji: "🐇",
    lines: [
      { text: "Joe grows carrots.", icon: "🥕" },
      { text: "The rabbits eat the carrots.", icon: "🐰" },
      { text: "Joe puts up a fence.", icon: "🪵" },
      { text: "The rabbits dig a hole!", icon: "🕳️" }
    ],
    vocab: ["grows", "carrots", "rabbits", "fence", "dig"],
    questions: [
      { q: "Cause: Joe grows carrots 🥕 ➔ Effect: ______", choices: [{ text: "Rabbits eat the carrots 🐰", correct: true }, { text: "Apples grow 🍏", correct: false }] },
      { q: "Cause: Joe puts up a fence 🪵 ➔ Effect: ______", choices: [{ text: "Rabbits dig a hole! 🕳️", correct: true }, { text: "Rabbits fly 🪽", correct: false }] }
    ]
  },

  // ================= UNIT 11: Story Elements (3 เรื่อง: หน้า 62-64) =================
  {
    id: 61, unit: 11, title: "Catch the Rat", emoji: "🐀",
    lines: [
      { text: "A rat is in the kitchen.", icon: "🐀" },
      { text: "Dad cannot catch it.", icon: "👨" },
      { text: "Mom cannot catch it.", icon: "👩" },
      { text: "Jack will catch the rat!", icon: "🐈" }
    ],
    vocab: ["rat", "kitchen", "catch", "cannot"],
    questions: [
      { q: "Setting: Where are they?", choices: [{ text: "in the kitchen 🍳", correct: true }, { text: "in the garden 🌺", correct: false }] },
      { q: "Conflict: Can Mom catch the rat?", choices: [{ text: "no ❌", correct: true }, { text: "yes ✅", correct: false }] },
      { q: "Solution: Who will catch the rat?", choices: [{ text: "Jack the cat 🐈", correct: true }, { text: "Dad 👨", correct: false }] }
    ]
  },
  {
    id: 62, unit: 11, title: "Dad's Leg", emoji: "🦵",
    lines: [
      { text: "Dad broke his leg.", icon: "🦵" },
      { text: "Mom makes soup for him.", icon: "🍲" },
      { text: "Jen makes cookies for him.", icon: "🍪" },
      { text: "Dad is very glad.", icon: "😄" }
    ],
    vocab: ["broke", "leg", "soup", "cookies", "glad"],
    questions: [
      { q: "Problem: Dad broke his ______.", choices: [{ text: "leg 🦵", correct: true }, { text: "arm 💪", correct: false }] },
      { q: "Action: Who makes the soup?", choices: [{ text: "Mom 👩", correct: true }, { text: "Jen 👧", correct: false }] },
      { q: "Resolution: Dad is very ______.", choices: [{ text: "glad 😄", correct: true }, { text: "sad 😢", correct: false }] }
    ]
  },
  {
    id: 63, unit: 11, title: "Missing Kid", emoji: "🐪",
    lines: [
      { text: "The kids are at the zoo.", icon: "🦒" },
      { text: "But where is Kim?", icon: "❓" },
      { text: "Everyone looks for Kim.", icon: "🔎" },
      { text: "Kim is on the camel!", icon: "🐪" }
    ],
    vocab: ["kids", "zoo", "looks", "camel", "missing"],
    questions: [
      { q: "Setting: Where are the kids?", choices: [{ text: "at the zoo 🦒", correct: true }, { text: "at school 🏫", correct: false }] },
      { q: "Problem: What's wrong?", choices: [{ text: "Kim is missing! 👧❓", correct: true }, { text: "It's raining 🌧️", correct: false }] },
      { q: "Resolution: Where is Kim?", choices: [{ text: "on the camel! 🐪", correct: true }, { text: "on a horse 🐎", correct: false }] }
    ]
  }
];

const UNITS_META = [
  { id: 1, title: "Story Details", icon: "🔍" },
  { id: 2, title: "Building a Picture", icon: "🎨" },
  { id: 3, title: "Story Sequence", icon: "🎬" },
  { id: 4, title: "Making Predictions", icon: "🔮" },
  { id: 5, title: "Character Map", icon: "💖" },
  { id: 6, title: "Compare & Contrast", icon: "⚖️" },
  { id: 7, title: "Identifying Facts", icon: "✔️" },
  { id: 8, title: "Classifying Details", icon: "🗂️" },
  { id: 9, title: "Making Inferences", icon: "💡" },
  { id: 10, title: "Cause & Effect", icon: "⚡" },
  { id: 11, title: "Story Elements", icon: "🧭" }
];
