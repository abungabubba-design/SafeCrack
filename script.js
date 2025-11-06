// --- SAFECRACK GAME SCRIPT: PROGRESSIVE DIFFICULTY + DYNAMIC QUESTIONS ---

// Difficulty pools
const difficulties = {
  easy: [
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What color is the sky on a clear day?", answer: "blue" },
    { question: "What is 5 - 3?", answer: "2" },
  ],
  medium: [
    { question: "I speak without a mouth. What am I?", answer: "echo" },
    { question: "What has keys but can't open locks?", answer: "piano" },
    { question: "What runs but never walks?", answer: "water" },
  ],
  hard: [
    { question: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },
    { question: "I am always hungry and must be fed. What am I?", answer: "fire" },
    { question: "What has hands but can't clap?", answer: "clock" },
  ],
  insane: [
    { question: "What disappears as soon as you say its name?", answer: "silence" },
    { question: "I can fly without wings. What am I?", answer: "time" },
    { question: "I am taken from a mine, and shut up in a wooden case, from which I am never released. What am I?", answer: "pencil lead" },
  ]
};

// Dynamic math question generator
function generateMathQuestion(level) {
  const a = Math.floor(Math.random() * (level * 10)) + 1;
  const b = Math.floor(Math.random() * (level * 10)) + 1;
  return {
    question: `What is ${a} + ${b}?`,
    answer: (a + b).toString()
  };
}

// Game state
let currentDifficulty = "easy";
let streak = 0;
let score = parseInt(localStorage.getItem("safecrackScore")) || 0;
let currentRiddle = null;

// DOM elements
const riddleText = document.getElementById("riddleText");
const answerInput = document.getElementById("answerInput");
const submitAnswer = document.getElementById("submitAnswer");
const miniSafe = document.getElementById("miniSafe");
const streakDisplay = document.getElementById("streakDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");

// Sounds
const clickSound = document.getElementById("clickSound");
const successSound = document.getElementById("successSound");
const vaultSound = document.getElementById("vaultSound");

// --- Helper functions ---
function getRandomQuestion() {
  // 30% chance to generate a math question for variety
  if (Math.random() < 0.3) {
    let level = { easy:1, medium:2, hard:3, insane:5 }[currentDifficulty];
    return generateMathQuestion(level);
  }

  const pool = difficulties[currentDifficulty];
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function updateDifficulty() {
  if (streak >= 10) {
    currentDifficulty = "insane";
  } else if (streak >= 7) {
    currentDifficulty = "hard";
  } else if (streak >= 4) {
    currentDifficulty = "medium";
  } else {
    currentDifficulty = "easy";
  }

  // Update body class to trigger CSS theme
  document.body.className = currentDifficulty;
}

function loadRiddle() {
  currentRiddle = getRandomQuestion();
  riddleText.textContent = currentRiddle.question;
  answerInput.value = "";
  answerInput.focus();
  scoreDisplay.textContent = score;
  streakDisplay.textContent = "Streak: " + streak;
}

// --- Event listener ---
submitAnswer.addEventListener("click", () => {
  clickSound.play();
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = currentRiddle.answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    successSound.play();
    score += 10;
    streak++;

    if (streak % 5 === 0) { // Bonus every 5 correct answers
      vaultSound.play();
      score += 50;
      miniSafe.src = "images/safe-golden.png";
      setTimeout(() => { miniSafe.src = "images/safe-locked.png"; }, 2000);
    } else {
      miniSafe.src = "images/safe-unlocked.png";
      setTimeout(() => { miniSafe.src = "images/safe-locked.png"; }, 1000);
    }
  } else {
    streak = 0;
  }

  updateDifficulty();
  loadRiddle();
  localStorage.setItem("safecrackScore", score);
});

// --- Start game ---
loadRiddle();
