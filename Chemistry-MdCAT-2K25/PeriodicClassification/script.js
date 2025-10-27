/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- DOM ELEMENT REFERENCES ---
const setupContainer = document.getElementById("setup-container");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");

const numQuestionsInput = document.getElementById("num-questions");
const startBtn = document.getElementById("start-btn");
const errorMessage = document.getElementById("error-message");
const questionCountInfo = document.getElementById("question-count-info");

const progressText = document.getElementById("progress-text");
const progressBarInner = document.getElementById("progress-bar-inner");
const timerText = document.getElementById("timer-text");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const nextBtn = document.getElementById("next-btn");

const scoreSummary = document.getElementById("score-summary");
const wrongQuestionsContainer = document.getElementById(
  "wrong-questions-container"
);
const wrongQuestionsList = document.getElementById("wrong-questions-list");
const retakeWrongBtn = document.getElementById("retake-wrong-btn");
const externalLink = document.getElementById("external-link");

// --- STATE MANAGEMENT ---
const PRESET_QUESTIONS = [
  {
    "question": "In the Medeleev's periodic law the properties of elements are periodic function of their:",
    "options": [
      "Volume",
      "Densities",
      "Atomic number",
      "Atomic masses"
    ],
    "answer": "Atomic masses"
  },
  {
    "question": "The basis of Modern periodic table is:",
    "options": [
      "electron affinity",
      "atomic mass",
      "Ionization energy",
      "atomic number"
    ],
    "answer": "atomic number"
  },
  {
    "question": "The concept of atomic number was introduced by:",
    "options": [
      "Alrazi",
      "Mendeleeve",
      "Moseley",
      "Dobereiner"
    ],
    "answer": "Moseley"
  },
  {
    "question": "How many elements are present in 5th period of the periodic table:",
    "options": [
      "32",
      "8",
      "18",
      "28"
    ],
    "answer": "18"
  },
  {
    "question": "The number of A-subgroups present in modern periodic table are:",
    "options": [
      "8",
      "7",
      "6",
      "5"
    ],
    "answer": "8"
  },
  {
    "question": "Transition elements in 4th period are:",
    "options": [
      "18",
      "10",
      "8",
      "6"
    ],
    "answer": "10"
  },
  {
    "question": "The basis of Modern periodic law is:",
    "options": [
      "electron affinity",
      "atomic mass",
      "Ionization energy",
      "atomic number"
    ],
    "answer": "atomic number"
  },
  {
    "question": "Which is the longest period of periodic table?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "6"
  },
  {
    "question": "6th period contains the number of elements:",
    "options": [
      "18",
      "32",
      "8",
      "10"
    ],
    "answer": "32"
  },
  {
    "question": "The decrease in atomic sizes is not much prominent across rows containing elements of:",
    "options": [
      "s- Block",
      "p-Block",
      "d-Block",
      "f- Block"
    ],
    "answer": "d-Block"
  },
  {
    "question": "Keeping in view the size of atoms, which order is the correct one:",
    "options": [
      "Mg>Sr",
      "Ba> Mg",
      "Li> Na",
      "Cl> I"
    ],
    "answer": "Ba> Mg"
  },
  {
    "question": "Smaller the size of an ion:",
    "options": [
      "Lesser is the hydration energy",
      "Lesser is the polarizing power",
      "Greater in the electron affinity",
      "Greater in the energy of hydration"
    ],
    "answer": "Greater in the energy of hydration"
  },
  {
    "question": "Which of the following statement is correct?",
    "options": [
      "Na atom is smaller than Na+",
      "Na atom is larger than K atom",
      "F atom is smaller than F-",
      "F atom is larger than F-"
    ],
    "answer": "F atom is smaller than F-"
  },
  {
    "question": "Mark the correct statement:",
    "options": [
      "Na+ is smaller than Na atom",
      "Na+ is larger than Na atom",
      "Cl- is smaller than Cl atom",
      "Cl (ion) and CI (atom) are equal in size"
    ],
    "answer": "Na+ is smaller than Na atom"
  },
  {
    "question": "Keeping in view the size of atoms, which order is the correct one:",
    "options": [
      "Mg>Sr",
      "Ba > Mg",
      "Lu >Ce",
      "Cl> I"
    ],
    "answer": "Ba > Mg"
  },
  {
    "question": "Keeping in view the size of atoms which order is correct.",
    "options": [
      "N>P",
      "Br > I",
      "Ca> Be",
      "Mg >Sr"
    ],
    "answer": "Mg >Sr"
  },
  {
    "question": "Which of the following elements has lowest ionization energy:",
    "options": [
      "Beryllium",
      "Boron",
      "Carbon",
      "Oxygen"
    ],
    "answer": "Boron"
  },
  {
    "question": "Among the elements of VA group which has highest ionization energy:",
    "options": [
      "Nitrogen",
      "Phosphorus",
      "Antimony",
      "Bismith"
    ],
    "answer": "Nitrogen"
  },
  {
    "question": "The ionization energy of calcium is:",
    "options": [
      "Lower than that of Barium",
      "Lower than that of Magnesium",
      "Higher than that of Beryllium",
      "Lower than that of Strontium"
    ],
    "answer": "Lower than that of Magnesium"
  },
  {
    "question": "Choose the correct statement.",
    "options": [
      "Metallic character increase down the group",
      "Metallic character decrease down the group",
      "does not change",
      "First increase then decrease"
    ],
    "answer": "Metallic character increase down the group"
  },
  {
    "question": "Which of the following element has lowest melting point:",
    "options": [
      "Beryllium",
      "Magnesium",
      "Calcium",
      "Barium"
    ],
    "answer": "Magnesium"
  },
  {
    "question": "Which of the following has the highest boiling point:",
    "options": [
      "Be",
      "Ra",
      "Ba",
      "Rn"
    ],
    "answer": "Be"
  },
  {
    "question": "Mark the correct statement:",
    "options": [
      "All lanthanides are present in the same group",
      "All Halogens are present in the same period",
      "All the alkali Metals are present in the same group",
      "All the noble gases are present in the same period"
    ],
    "answer": "All the alkali Metals are present in the same group"
  },
  {
    "question": "Which statement is incorrect:",
    "options": [
      "All the metals are good conductor of electricity",
      "All metals are good conductor of heat",
      "All the metals form positive ions",
      "All the metals form acidic oxide"
    ],
    "answer": "All the metals form acidic oxide"
  },
  {
    "question": "Which ion will have maximum value of heat of hydration?",
    "options": [
      "Na+1",
      "Cs+",
      "Ba+2",
      "Mg+2"
    ],
    "answer": "Mg+2"
  },
  {
    "question": "Which of the following ion has maximum hydration energy:",
    "options": [
      "Li+",
      "Na+",
      "K+",
      "Cs+"
    ],
    "answer": "Li+"
  },
  {
    "question": "The intermediate Hydride is:",
    "options": [
      "CsH",
      "ZnH2",
      "BH3",
      "HF"
    ],
    "answer": "HF"
  },
  {
    "question": "Which one is ionic hydride?",
    "options": [
      "NaH",
      "AlH3",
      "NH3",
      "CH4"
    ],
    "answer": "NaH"
  },
  {
    "question": "The hydrides of group I-A are:",
    "options": [
      "ionic",
      "covalent",
      "metallic",
      "interstil"
    ],
    "answer": "ionic"
  },
  {
    "question": "Which of the following metal gives an amphoteric oxide?",
    "options": [
      "Ca",
      "Fe",
      "Cu",
      "Zn"
    ],
    "answer": "Zn"
  },
  {
    "question": "Coinage metals are present in the periodic table in group.",
    "options": [
      "I-A",
      "I-B",
      "II-A",
      "II-B"
    ],
    "answer": "I-B"
  },
  {
    "question": "The oxides of non-metals are:",
    "options": [
      "acidic",
      "basic",
      "amphoteric",
      "neutral"
    ],
    "answer": "acidic"
  },
  {
    "question": "Which one is amphoteric oxide?",
    "options": [
      "SO3",
      "CaO",
      "ZnO",
      "Li2O"
    ],
    "answer": "ZnO"
  },
  {
    "question": "Zinc Oxide is an example of:",
    "options": [
      "Neutral",
      "Amphoteric",
      "Acidic",
      "Basic"
    ],
    "answer": "Amphoteric"
  },
  {
    "question": "Which one of the following elements forms weakly acidic oxide:",
    "options": [
      "Aluminium",
      "Phosphorous",
      "Sulphur",
      "Chlorine"
    ],
    "answer": "Phosphorous"
  },
  {
    "question": "The element which forms Amphoteric oxide is:",
    "options": [
      "Beryllium (Be)",
      "Sodium(Na)",
      "Magnesium(Mg)",
      "Calcium"
    ],
    "answer": "Beryllium (Be)"
  },
  {
    "question": "Which of the following form amphoteric oxide:",
    "options": [
      "Na",
      "Mg",
      "C",
      "Zn"
    ],
    "answer": "Zn"
  },
  {
    "question": "Which oxide is amphoteric in nature?",
    "options": [
      "Al2O3",
      "Cl2O7",
      "MgO",
      "SO3"
    ],
    "answer": "Al2O3"
  },
  {
    "question": "The oxides of Beryllium are:",
    "options": [
      "acidic",
      "basic",
      "amphoteric",
      "none of t..."
    ],
    "answer": "amphoteric"
  },
  {
    "question": "Aluminium oxide is:",
    "options": [
      "Acidic oxide",
      "Basic oxide",
      "Amphoteric oxide",
      "None of these"
    ],
    "answer": "Amphoteric oxide"
  },
  {
    "question": "Keeping in view atomic and ionic radii, mark the correct statement",
    "options": [
      "Na < Na+",
      "Cl- < Cl",
      "Cl- = Cl",
      "Na+ > Na"
    ],
    "answer": "Cl- < Cl"
  },
  {
    "question": "Pick the element having least ionization energy value:",
    "options": [
      "Nitrogen",
      "Oxygen",
      "Fluorine",
      "Neon"
    ],
    "answer": "Neon"
  },
  {
    "question": "Which compound is the most reactive one?",
    "options": [
      "Benzene",
      "Ethane",
      "Ethene",
      "Ethyne"
    ],
    "answer": "Ethyne"
  },
  {
    "question": "Elements of periodic table are classified into blocks:",
    "options": [
      "Three",
      "Four",
      "Five",
      "Six"
    ],
    "answer": "Four"
  },
  {
    "question": "Ionization energy of an atom does not depend on:",
    "options": [
      "Magnitude of nuclear charge",
      "Size of atom",
      "Physical state",
      "Shielding effect"
    ],
    "answer": "Physical state"
  },
  {
    "question": "Which statement is correct:",
    "options": [
      "Na atom is smaller than Na+ ion",
      "Na atom is larger than K atom",
      "F atom is smaller than F-",
      "F atom is larger than F-"
    ],
    "answer": "F atom is smaller than F-"
  },
  {
    "question": "Select the two normal elements are present in 5th period:",
    "options": [
      "Rb, Sr",
      "Cs, Ba",
      "Fr, Ra",
      "La, Hf"
    ],
    "answer": "Rb, Sr"
  },
  {
    "question": "Select the two normal elements are present in 4th period:",
    "options": [
      "K, Ca",
      "Rb, Sr",
      "Cs, Ba",
      "Fr, Ra"
    ],
    "answer": "K, Ca"
  },
  {
    "question": "Classification of elements in the modern periodic table is based on:",
    "options": [
      "Law of triads",
      "Law of octaves",
      "Moseley law",
      "Mendeleev's periodic law"
    ],
    "answer": "Moseley law"
  },
  {
    "question": "Which of the following metal does not form ionic hydride?",
    "options": [
      "Ba",
      "Mg",
      "Ca",
      "Sr"
    ],
    "answer": "Mg"
  },
  {
    "question": "Select the two elements which are present in 3rd period?",
    "options": [
      "Li, Be",
      "Na, Mg",
      "K, Ca",
      "Ra, Sr"
    ],
    "answer": "Na, Mg"
  },
  {
    "question": "Select the two normal elements present in sixth period:",
    "options": [
      "K, Ca",
      "Rb, Sr",
      "Cs, Ba",
      "La, Hf"
    ],
    "answer": "Cs, Ba"
  },
  {
    "question": "Select the two normal elements are present in seventh period:",
    "options": [
      "Rb, Sr",
      "Cs, Ba",
      "Fr, Ra",
      "La, Hf"
    ],
    "answer": "Fr, Ra"
  },
  {
    "question": "Which of the element gives acidic oxide?",
    "options": [
      "P",
      "As",
      "Sb",
      "Bi"
    ],
    "answer": "P"
  },
  {
    "question": "which of the following elements form acidic oxide only?",
    "options": [
      "P",
      "Al",
      "Sn",
      "Br"
    ],
    "answer": "Br"
  },
  {
    "question": "Amphoteric oxide is formed by:",
    "options": [
      "Na",
      "Al",
      "Fe",
      "Cu"
    ],
    "answer": "Al"
  },
  {
    "question": "Hydrogen resembles in properties with groups:",
    "options": [
      "I-A, V-A, VII-A elements",
      "I-A, IV-A, VII-A elements",
      "I-A, III-A, V-A elements",
      "I-A, II-A elements"
    ],
    "answer": "I-A, IV-A, VII-A elements"
  },
  {
    "question": "The most metallic element from the following is:",
    "options": [
      "Nitrogen",
      "Oxygen",
      "Antimony",
      "Bismuth"
    ],
    "answer": "Bismuth"
  },
  {
    "question": "Alkali metals are:",
    "options": [
      "acidic in nature",
      "Amphoteric nature",
      "Strong oxidizing agent",
      "Strong reducing agents"
    ],
    "answer": "Strong reducing agents"
  },
  {
    "question": "Non-metals are present in which block of periodic table?",
    "options": [
      "s-block",
      "p-block",
      "d-block",
      "f-block"
    ],
    "answer": "p-block"
  },
  {
    "question": "Which is more acidic oxide in the following?",
    "options": [
      "MnO",
      "Mn3O4",
      "MnO2",
      "Mn2O7"
    ],
    "answer": "Mn2O7"
  },
  {
    "question": "Which one is not a periodic property:",
    "options": [
      "Ionization Energy",
      "Density",
      "Atomic Radii",
      "Hydration Energy"
    ],
    "answer": "Density"
  },
  {
    "question": "Which one of the following oxides is more basic:",
    "options": [
      "BeO",
      "SrO",
      "CaO",
      "MgO"
    ],
    "answer": "SrO"
  },
  {
    "question": "Mark the correct statement:",
    "options": [
      "Metallic character increases down the group",
      "Metallic character increases from left to right along a period",
      "Metallic character remains the same from left to right along a period",
      "Metallic character remains the same down the group."
    ],
    "answer": "Metallic character increases down the group"
  },
  {
    "question": "An aqueous solution of an organic compound reacts with Na2CO3 to produce CO2. Which one of the following could be organic compound",
    "options": [
      "H3C – CH = CH2",
      "CH3CH2COOH",
      "CH3COCH3",
      "CH3CHO"
    ],
    "answer": "CH3CH2COOH"
  },
  {
    "question": "Which among the following has highest value of heat of hydration:",
    "options": [
      "Li+",
      "K+",
      "Mg2+",
      "Al3+"
    ],
    "answer": "Al3+"
  },
  {
    "question": "The most non-metallic element of the periodic table is:",
    "options": [
      "Nitrogen",
      "Fluorine",
      "Oxygen",
      "Carbon"
    ],
    "answer": "Fluorine"
  },
  {
    "question": "Mark the correct statement:",
    "options": [
      "The ionization energy of calcium is lower than that of Barium.",
      "The ionization energy of calcium is lower than that of Magnesium.",
      "The ionization energy of calcium is higher than that of Beryllium.",
      "The ionization energy of calcium is lower than that of strontium."
    ],
    "answer": "The ionization energy of calcium is lower than that of Magnesium."
  },
  {
    "question": "Among alkali metal ions, minimum hydration energy is shown by:",
    "options": [
      "Li+",
      "Na+",
      "Rb+",
      "K+"
    ],
    "answer": "Rb+"
  },
  {
    "question": "Which among following oxides is amphoteric:",
    "options": [
      "B2O3",
      "MgO",
      "SO3",
      "ZnO"
    ],
    "answer": "ZnO"
  },
  {
    "question": "The number of Elements classified by Newlands in the Periodic Table are :",
    "options": [
      "82",
      "62",
      "92",
      "85"
    ],
    "answer": "62"
  },
  {
    "question": "The oxides of metals are:",
    "options": [
      "Acidic",
      "Basic",
      "Amphoteric",
      "Neutral"
    ],
    "answer": "Basic"
  }
];

// FIX: Added `allQuestions` and other state variables from index.tsx to consolidate state management.
let allQuestions = PRESET_QUESTIONS;
let currentTestQuestions = [];
let originalTestQuestions = [];
let wrongAnswers = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 0;

// --- CORE LOGIC ---

/**
 * Initializes the application.
 */
function init() {
  // FIX: Use `allQuestions` to set the max attribute dynamically.
  numQuestionsInput.max = allQuestions.length;
  addEventListeners();
  questionCountInfo.textContent = `Total MCQs available: ${allQuestions.length}`;
}

/**
 * Adds all necessary event listeners.
 */
function addEventListeners() {
  startBtn.addEventListener("click", handleStartTest);
  optionsList.addEventListener("click", handleOptionSelect);
  nextBtn.addEventListener("click", handleNextQuestion);
  retakeWrongBtn.addEventListener("click", () => handleRetake(true));
  document.addEventListener("keydown", handleKeyPress);
}

/**
 * Validates inputs and starts the test.
 */
function handleStartTest() {
  errorMessage.textContent = "";
  const numToAttempt = parseInt(numQuestionsInput.value, 10);

  if (isNaN(numToAttempt)) {
    errorMessage.textContent = "Please enter a valid number.";
    return;
  }

  if (numToAttempt < 1) {
    errorMessage.textContent = "You must attempt at least 1 question.";
    return;
  }

  if (numToAttempt > allQuestions.length) {
    errorMessage.textContent = `You can attempt a maximum of ${allQuestions.length} questions.`;
    return;
  }

  // Setup and start the quiz
  originalTestQuestions = shuffleArray([...allQuestions]).slice(
    0,
    numToAttempt
  );
  startQuiz(originalTestQuestions);
}

/**
 * Sets up and begins a quiz session.
 */
function startQuiz(questions) {
  currentTestQuestions = questions;
  currentQuestionIndex = 0;
  score = 0;
  wrongAnswers = [];
  timeLeft = currentTestQuestions.length * 60;

  switchView(quizContainer);
  displayQuestion();
  startTimer();
}

/**
 * Displays the current question and its options.
 */
function displayQuestion() {
  if (currentQuestionIndex >= currentTestQuestions.length) {
    endTest();
    return;
  }

  const progressPercentage =
    (currentQuestionIndex / currentTestQuestions.length) * 100;
  progressBarInner.style.width = `${progressPercentage}%`;

  const currentQuestion = currentTestQuestions[currentQuestionIndex];
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
    currentTestQuestions.length
  }`;
  questionText.textContent = currentQuestion.question;

  optionsList.innerHTML = "";
  // Shuffle options for variety
  const shuffledOptions = shuffleArray([...currentQuestion.options]);
  shuffledOptions.forEach((option) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.dataset.option = option;
    optionsList.appendChild(li);
  });

  nextBtn.classList.add("hidden");
}

/**
 * Handles the user selecting an option.
 */
function handleOptionSelect(e) {
  const target = e.target;
  if (target.tagName !== "LI" || target.classList.contains("disabled")) return;

  const selectedOption = target.dataset.option;
  const correctAnswer = currentTestQuestions[currentQuestionIndex].answer;

  // Disable all options
  Array.from(optionsList.children).forEach((child) => {
    const li = child;
    li.classList.add("disabled");
    if (li.dataset.option === correctAnswer) {
      li.classList.add("correct");
    }
  });

  if (selectedOption === correctAnswer) {
    score++;
  } else {
    target.classList.add("incorrect");
    wrongAnswers.push(currentTestQuestions[currentQuestionIndex]);
  }

  nextBtn.classList.remove("hidden");
}

/**
 * Moves to the next question or ends the test.
 */
function handleNextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

function startTimer() {
  clearInterval(timer);
  updateTimerDisplay();
  timer = window.setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `Time: ${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function endTest() {
  clearInterval(timer);
  displayResults();
  switchView(resultContainer);
}

function displayResults() {
  const total = currentTestQuestions.length;
  const percentage = total > 0 ? ((score / total) * 100).toFixed(1) : 0;
  scoreSummary.innerHTML = `
        <span>Correct: <strong>${score}</strong></span>
        <span>Wrong: <strong>${total - score}</strong></span>
        <span>Score: <strong>${percentage}%</strong></span>
    `;

  if (wrongAnswers.length > 0) {
    wrongQuestionsContainer.classList.remove("hidden");
    retakeWrongBtn.classList.remove("hidden");
    wrongQuestionsList.innerHTML = "";
    wrongAnswers.forEach((q) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <div class="wrong-q-text">${q.question}</div>
                <div class="wrong-q-answer">Correct Answer: ${q.answer}</div>
            `;
      wrongQuestionsList.appendChild(li);
    });
  } else {
    wrongQuestionsContainer.classList.add("hidden");
    retakeWrongBtn.classList.add("hidden");
  }
}

/**
 * Handles retaking the test.
 */
function handleRetake(isWrongOnly) {
  const questionsForRetake = isWrongOnly ? wrongAnswers : originalTestQuestions;
  if (questionsForRetake.length > 0) {
    startQuiz(questionsForRetake);
  } else {
    // If retaking wrong but there are none, go back to setup
    switchView(setupContainer);
  }
}

/**
 * Handles keyboard shortcuts for navigation.
 */
function handleKeyPress(e) {
  if (!quizContainer.classList.contains("active")) return;

  if (e.key >= "1" && e.key <= "4") {
    e.preventDefault();
    const optionIndex = parseInt(e.key, 10) - 1;
    const optionElements = optionsList.querySelectorAll("li");
    if (
      optionIndex < optionElements.length &&
      !optionElements[optionIndex].classList.contains("disabled")
    ) {
      optionElements[optionIndex].click();
    }
  }

  if (e.key === "Enter" && !nextBtn.classList.contains("hidden")) {
    e.preventDefault();
    nextBtn.click();
  }
}

// --- UTILITY FUNCTIONS ---

function switchView(activeContainer) {
  [setupContainer, quizContainer, resultContainer].forEach((container) => {
    container.classList.remove("active");
  });
  activeContainer.classList.add("active");

  if (quizContainer.classList.contains("active")) {
    externalLink.classList.add("hidden");
  } else {
    externalLink.classList.remove("hidden");
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- APP INITIALIZATION ---
document.addEventListener("DOMContentLoaded", init);

// Disable right-click menu
document.addEventListener("contextmenu", (event) => event.preventDefault());

// Disable common copy shortcuts (Ctrl+C, Ctrl+U, Ctrl+S, etc.)
document.addEventListener("keydown", (event) => {
  if (
    event.ctrlKey &&
    ["c", "u", "s", "x", "a"].includes(event.key.toLowerCase())
  ) {
    event.preventDefault();
  }
});

// Optional: prevent drag selection
document.addEventListener("dragstart", (event) => event.preventDefault());
