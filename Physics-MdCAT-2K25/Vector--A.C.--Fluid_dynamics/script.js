// Using an IIFE to encapsulate the script and avoid polluting the global namespace.
(function () {
  // --- STATE MANAGEMENT ---
  let allQuestions = [];
  let currentTestQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let wrongAnswers = [];
  let timerInterval;
  let timeLeft = 0;

  // --- DOM ELEMENTS ---
  const screens = {
    setup: document.getElementById("setup-screen"),
    test: document.getElementById("test-screen"),
    result: document.getElementById("result-screen"),
  };
  const homeBtn = document.getElementById("home-btn");
  const totalQuestionsInfo = document
    .getElementById("total-questions-info")
    .querySelector("strong");
  const numQuestionsInput = document.getElementById("num-questions-input");
  const numError = document.getElementById("num-error");
  const startTestBtn = document.getElementById("start-test-btn");
  const questionCounter = document.getElementById("question-counter");
  const timerDisplay = document.getElementById("timer");
  const progressBar = document.getElementById("progress-bar");
  const questionCard = document.querySelector(".question-card");
  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");
  const nextBtn = document.getElementById("next-btn");
  const scoreSummary = document.getElementById("score-summary");
  const wrongQuestionsContainer = document.getElementById(
    "wrong-questions-container"
  );
  const wrongQuestionsList = document.getElementById("wrong-questions-list");
  const retakeWrongBtn = document.getElementById("retake-wrong-btn");
  const backToSetupBtn = document.getElementById("back-to-setup-btn");
  const progressBarContainer = document.querySelector(
    ".progress-bar-container"
  );

  // --- PASTE OR EDIT YOUR QUESTIONS JSON HERE ---
  // This is now the primary source for the quiz questions.
  // Ensure the JSON format is correct.
  const questionsJSON = `[
  {
    "question": "Which statement best describes the nature of alternating current (A.C.)?",
    "options": ["It flows in one direction with constant magnitude.", "It changes direction and magnitude continuously.", "It flows only when a circuit is closed.", "It has a constant magnitude but changing direction."],
    "correctAnswer": 1
  },
  {
    "question": "How many times does A.C. reverse its direction in one complete cycle?",
    "options": ["Once", "Twice", "Four times", "It depends on the frequency."],
    "correctAnswer": 0
  },
  {
    "question": "A complete cycle of alternating current corresponds to a change in angle of how many radians?",
    "options": ["π / 2", "π", "2π", "4π"],
    "correctAnswer": 2
  },
  {
    "question": "The instantaneous voltage in an A.C. circuit is given by V = V₀ sin(θ). If the peak voltage (V₀) is 170V, what is the instantaneous voltage when θ = π/2 radians (90°)?",
    "options": ["0 V", "85 V", "170 V", "120 V"],
    "correctAnswer": 2
  },
  {
    "question": "An A.C. voltage has a peak value (V₀) of 200V. What is its peak-to-peak voltage (V_pp)?",
    "options": ["100 V", "200 V", "282 V", "400 V"],
    "correctAnswer": 3
  },
  {
    "question": "An A.C. voltage has a peak value (V₀) of 311V. What is its RMS value (V_rms)?",
    "options": ["311 V", "440 V", "220 V", "155.5 V"],
    "correctAnswer": 2
  },
  {
    "question": "If the RMS current (I_rms) in a circuit is 10 A, what is the peak current (I₀)?",
    "options": ["10 A", "7.07 A", "14.14 A", "20 A"],
    "correctAnswer": 2
  },
  {
    "question": "What does the RMS value of an A.C. quantity represent?",
    "options": ["The average value over one cycle", "The peak value", "The effective D.C. equivalent value", "The instantaneous value"],
    "correctAnswer": 2
  },
  {
    "question": "When two A.C. waveforms have a phase difference of π/2 radians (90°), they are said to be in:",
    "options": ["Phase", "Anti-phase", "Quadrature", "Resonance"],
    "correctAnswer": 2
  },
  {
    "question": "What is the phase difference between voltage and current in a purely resistive A.C. circuit?",
    "options": ["90° (π/2 radians)", "180° (π radians)", "45° (π/4 radians)", "0°"],
    "correctAnswer": 3
  },
  {
    "question": "How does the resistance of a pure resistor change with the frequency of the A.C. supply?",
    "options": ["It increases with frequency", "It decreases with frequency", "It is independent of frequency", "It becomes zero at high frequency"],
    "correctAnswer": 2
  },
  {
    "question": "In a purely capacitive A.C. circuit, what is the phase relationship between current and voltage?",
    "options": ["Current and voltage are in-phase", "Current leads voltage by 90°", "Voltage leads current by 90°", "Current lags voltage by 180°"],
    "correctAnswer": 1
  },
  {
    "question": "The capacitive reactance (X_C) is given by the formula:",
    "options": ["X_C = 2πfC", "X_C = 1 / (2πfC)", "X_C = C / (2πf)", "X_C = 2πf / C"],
    "correctAnswer": 1
  },
  {
    "question": "What is the average power consumed by a pure inductor over one complete A.C. cycle?",
    "options": ["V_rms * I_rms", "I_rms² * X_L", "0", "Infinite"],
    "correctAnswer": 2
  },
  {
    "question": "What is the formula for inductive reactance (X_L)?",
    "options": ["X_L = ω / L", "X_L = 1 / (ωL)", "X_L = ωL", "X_L = L / ω"],
    "correctAnswer": 2
  },
  {
    "question": "In a series R-L circuit, the impedance (Z) is calculated using:",
    "options": ["Z = R + X_L", "Z = √(R² + X_L²)", "Z = R - X_L", "Z = √(R² - X_L²)"],
    "correctAnswer": 1
  },
  {
    "question": "An R-L circuit has a resistance of 3 Ω and an inductive reactance of 4 Ω. What is its impedance?",
    "options": ["7 Ω", "1 Ω", "5 Ω", "12 Ω"],
    "correctAnswer": 2
  },
  {
    "question": "In a series R-C circuit, the voltage:",
    "options": ["Leads the current", "Is in-phase with the current", "Lags the current", "Is always zero"],
    "correctAnswer": 2
  },
  {
    "question": "An R-C circuit has a resistance R=8Ω and capacitive reactance Xc=6Ω. The tangent of the phase angle (tan φ) is:",
    "options": ["-0.75", "0.75", "-1.33", "1.33"],
    "correctAnswer": 0
  },
  {
    "question": "For a series R-L-C circuit, what is the condition for resonance?",
    "options": ["X_L > X_C", "X_C > X_L", "X_L = X_C", "R = 0"],
    "correctAnswer": 2
  },
  {
    "question": "In a series R-L-C circuit, if X_L > X_C, the circuit is predominantly:",
    "options": ["Resistive", "Capacitive (current leads voltage)", "Inductive (current lags voltage)", "At resonance"],
    "correctAnswer": 2
  },
  {
    "question": "In a series R-L-C circuit, R = 8 Ω, X_L = 12 Ω, and X_C = 6 Ω. What is the total impedance (Z)?",
    "options": ["26 Ω", "10 Ω", "14 Ω", "6 Ω"],
    "correctAnswer": 1
  },
  {
    "question": "In a phasor diagram for a series RLC circuit, V_R=30V, V_L=50V, and V_C=10V. What is the total voltage V?",
    "options": ["90V", "70V", "50V", "40V"],
    "correctAnswer": 2
  },
  {
    "question": "The power factor (cos φ) in a series A.C. circuit is defined as:",
    "options": ["Z / R", "R / Z", "X_L / R", "X_C / Z"],
    "correctAnswer": 1
  },
  {
    "question": "What is the power factor of a purely reactive circuit (containing only an inductor or capacitor)?",
    "options": ["1", "0", "-1", "0.707"],
    "correctAnswer": 1
  },
  {
    "question": "The real power consumed in an A.C. circuit is given by P = V_rms * I_rms * cos(φ). What does cos(φ) represent?",
    "options": ["Impedance", "Reactance", "Power Factor", "Phase Angle"],
    "correctAnswer": 2
  },
  {
    "question": "What is a key characteristic of electromagnetic (EM) waves?",
    "options": ["They require a medium to propagate", "They are longitudinal waves", "They do not need a medium to propagate", "Their electric and magnetic fields are parallel"],
    "correctAnswer": 2
  },
  {
    "question": "In an EM wave, the angle between the electric field (E), the magnetic field (B), and the direction of propagation is:",
    "options": ["0°", "45°", "90°", "180°"],
    "correctAnswer": 2
  },
  {
    "question": "Which of the following EM waves has the highest frequency?",
    "options": ["Visible Light", "Ultraviolet", "X-Rays", "Gamma Rays"],
    "correctAnswer": 3
  },
  {
    "question": "Which of the following is a scalar quantity?",
    "options": ["Force", "Velocity", "Mass", "Acceleration"],
    "correctAnswer": 2
  },
  {
    "question": "A force of 20 N makes an angle of 60° with the x-axis. What is the magnitude of its x-component (F_x)?",
    "options": ["20 N", "17.32 N", "10 N", "8.66 N"],
    "correctAnswer": 2
  },
  {
    "question": "If a vector has perpendicular components R_x = 6 units and R_y = 8 units, what is the magnitude of the resultant vector R?",
    "options": ["14 units", "10 units", "2 units", "48 units"],
    "correctAnswer": 1
  },
  {
    "question": "Vector A = 2i + 5j and Vector B = 3i - 1j. What is the resultant vector R = A + B?",
    "options": ["5i + 4j", "1i + 6j", "-1i + 6j", "5i + 6j"],
    "correctAnswer": 0
  },
  {
    "question": "Two forces of magnitude A=3N and B=4N act on a point with an angle of 60° between them. What is the magnitude of the resultant force R? (Use R² = A² + B² + 2ABcosθ)",
    "options": ["5 N", "7 N", "√37 N", "√13 N"],
    "correctAnswer": 2
  },
  {
    "question": "A vector lies in the third quadrant. What are the signs of its x and y components?",
    "options": ["x is positive, y is positive", "x is negative, y is positive", "x is negative, y is negative", "x is positive, y is negative"],
    "correctAnswer": 2
  },
  {
    "question": "The scalar (dot) product of two perpendicular vectors is:",
    "options": ["Maximum", "Minimum", "Zero", "Equal to their vector product"],
    "correctAnswer": 2
  },
  {
    "question": "Given vectors A = 3i + 2j and B = 2i - 4j, what is their scalar product (A · B)?",
    "options": ["14", "-2", "6", "-8"],
    "correctAnswer": 1
  },
  {
    "question": "What does the projection of vector A onto vector B represent?",
    "options": ["The magnitude of A", "The magnitude of B", "The component of A in the direction of B", "The cross product of A and B"],
    "correctAnswer": 2
  },
  {
    "question": "The direction of the vector (cross) product A × B is determined by:",
    "options": ["The Law of Cosines", "The Right-Hand Rule", "The scalar product", "The Pythagorean theorem"],
    "correctAnswer": 1
  },
  {
    "question": "What is the result of the cross product of unit vectors î × ĵ?",
    "options": ["0", "î", "ĵ", "k̂"],
    "correctAnswer": 3
  },
  {
    "question": "What is the result of the dot product of unit vectors ĵ · ĵ?",
    "options": ["0", "1", "î", "k̂"],
    "correctAnswer": 1
  },
  {
    "question": "The magnitude of the cross product |A × B| is maximum when the angle θ between the vectors is:",
    "options": ["0°", "45°", "90°", "180°"],
    "correctAnswer": 2
  },
  {
    "question": "How does the terminal velocity of a falling object change over time?",
    "options": ["It is always constant", "It decreases and then becomes zero", "It increases initially and then becomes constant", "It increases indefinitely"],
    "correctAnswer": 2
  },
  {
    "question": "The terminal velocity of a sphere is directly proportional to its mass (m) and the square of its radius (r²). If the mass of a sphere is doubled, its terminal velocity will:",
    "options": ["Be halved", "Be doubled", "Be quadrupled", "Remain the same"],
    "correctAnswer": 1
  },
  {
    "question": "Fluid flow that is smooth and orderly is called ________, while chaotic and irregular flow is called ________.",
    "options": ["Turbulent, Laminar", "Laminar, Turbulent", "Static, Dynamic", "Viscous, Non-viscous"],
    "correctAnswer": 1
  },
  {
    "question": "The drag force on a sphere in a laminar flow is given by F = 6πηrv. What are the dimensions of the viscosity constant (η)?",
    "options": ["MLT⁻²", "ML⁻¹T⁻¹", "ML⁻²T", "MT⁻¹"],
    "correctAnswer": 1
  },
  {
    "question": "How does an increase in temperature affect the viscosity of a liquid versus a gas?",
    "options": ["Decreases in both", "Increases in both", "Decreases in liquid, increases in gas", "Increases in liquid, decreases in gas"],
    "correctAnswer": 2
  },
  {
    "question": "The primary cause of viscosity in gases is:",
    "options": ["Cohesive forces between molecules", "Diffusion of molecules between layers", "Pressure applied to the gas", "Gravitational forces"],
    "correctAnswer": 1
  },
  {
    "question": "How does pressure generally affect the viscosity of a gas?",
    "options": ["It increases viscosity significantly", "It decreases viscosity significantly", "It has little to no effect", "It depends on the temperature"],
    "correctAnswer": 2
  },
  {
    "question": "Blood is approximately 3-5 times more viscous than water. This is primarily due to:",
    "options": ["Its higher temperature", "The presence of red blood cells", "Its lower density", "Its flow speed in arteries"],
    "correctAnswer": 1
  },
  {
    "question": "During blood pressure measurement, the 80 mmHg diastolic pressure corresponds to which type of blood flow?",
    "options": ["Turbulent flow", "No flow", "Laminar flow", "Streamline flow"],
    "correctAnswer": 3
  },
  {
    "question": "For a compressible fluid, the equation of continuity states that the ________ per unit time is constant.",
    "options": ["Volume", "Area", "Mass", "Velocity"],
    "correctAnswer": 2
  },
  {
    "question": "Bernoulli’s principle states that for a horizontal flow, as the speed of a fluid increases, its:",
    "options": ["Pressure increases", "Pressure decreases", "Pressure remains constant", "Density increases"],
    "correctAnswer": 1
  },
  {
    "question": "For a static fluid (V=0), Bernoulli's equation simplifies to:",
    "options": ["P + ρgH = constant", "P + ½ρV² = constant", "ρgH = constant", "P = constant"],
    "correctAnswer": 0
  },
  {
    "question": "A large water tank of height H=10m has a small leak at a height h=1m from the bottom. What is the range (R) of the water stream hitting the ground?",
    "options": ["18 m", "9 m", "6 m", "3 m"],
    "correctAnswer": 2
  },
  {
    "question": "The ability of a water strider or a needle to float on the surface of water, despite being denser, is due to:",
    "options": ["Viscosity", "Bernoulli's Principle", "Surface Tension", "Drag Force"],
    "correctAnswer": 2
  },
  {
    "question": "In which situation is the drag force on an object proportional to the square of its velocity (v²)?",
    "options": ["At very low speeds (laminar flow)", "At high speeds (turbulent flow)", "Only in gases", "When the object is stationary"],
    "correctAnswer": 1
  }
]`;

  // --- EVENT LISTENERS ---
  document.addEventListener("DOMContentLoaded", init);
  startTestBtn.addEventListener("click", () => startTest());
  optionsList.addEventListener("click", handleOptionSelect);
  nextBtn.addEventListener("click", nextQuestion);
  retakeWrongBtn.addEventListener("click", () => startTest(wrongAnswers));
  backToSetupBtn.addEventListener("click", () => showScreen("setup"));

  // --- INITIALIZATION ---
  function init() {
    loadQuestions();
    addKeyboardListeners();
  }

  // --- SCREEN MANAGEMENT ---
  function showScreen(screenName) {
    Object.values(screens).forEach((screen) =>
      screen.classList.remove("active")
    );
    screens[screenName].classList.add("active");

    if (screenName === "test") {
      homeBtn.classList.add("hidden");
    } else {
      homeBtn.classList.remove("hidden");
    }
  }

  // --- DATA HANDLING ---
  function loadQuestions() {
    try {
      const parsedQuestions = JSON.parse(questionsJSON);
      if (!Array.isArray(parsedQuestions))
        throw new Error("JSON is not an array.");
      // Basic validation
      parsedQuestions.forEach((q) => {
        if (
          !q.question ||
          !q.options ||
          q.options.length !== 4 ||
          q.correctAnswer === undefined
        ) {
          throw new Error("Invalid question format detected.");
        }
      });
      allQuestions = parsedQuestions;
    } catch (error) {
      console.error("Error parsing questions JSON:", error);
      allQuestions = [];
      totalQuestionsInfo.parentElement.innerHTML =
        '<strong style="color: var(--wrong-color);">Error loading questions! Check script.js.</strong>';
    }
    updateSetupUI();
  }

  function updateSetupUI() {
    if (allQuestions.length > 0) {
      totalQuestionsInfo.textContent = allQuestions.length;
      numQuestionsInput.max = allQuestions.length;
      numQuestionsInput.value = allQuestions.length; // Auto-set to max
    } else {
      numQuestionsInput.disabled = true;
      startTestBtn.disabled = true;
    }
  }

  // --- TEST LOGIC ---
  function startTest(questionsToUse = null) {
    numError.textContent = "";
    let questionsForTest;

    if (questionsToUse) {
      questionsForTest = [...questionsToUse];
    } else {
      const numToAttempt = parseInt(numQuestionsInput.value);
      if (isNaN(numToAttempt) || numToAttempt <= 0) {
        numError.textContent = "Please enter a valid number of questions.";
        return;
      }

      // NEW: Prevent start if user asks for more questions than available
      if (numToAttempt > allQuestions.length) {
        numError.textContent = `Input exceeds available questions. Please enter a number up to ${allQuestions.length}.`;
        return;
      }

      // Input is valid and within available range
      numQuestionsInput.value = numToAttempt;

      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      questionsForTest = shuffled.slice(0, numToAttempt);
    }

    if (questionsForTest.length === 0) {
      numError.textContent = "No questions available for this test.";
      return;
    }

    currentTestQuestions = questionsForTest;
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = [];
    timeLeft = currentTestQuestions.length * 60;

    showScreen("test");
    displayQuestion();
    startTimer();
  }

  function displayQuestion() {
    if (currentQuestionIndex >= currentTestQuestions.length) {
      endTest();
      return;
    }

    // Handle animation
    questionCard.classList.remove("animate-exit");
    questionCard.classList.add("animate-enter");
    questionCard.addEventListener(
      "animationend",
      () => {
        questionCard.classList.remove("animate-enter");
      },
      { once: true }
    );

    const question = currentTestQuestions[currentQuestionIndex];
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${
      currentTestQuestions.length
    }`;
    questionText.textContent = question.question;

    optionsList.innerHTML = "";
    question.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("tabindex", "0");
      li.textContent = option;
      li.dataset.index = index;
      optionsList.appendChild(li);
    });

    updateProgressBar();
    nextBtn.classList.add("hidden");
  }

  function handleOptionSelect(e) {
    if (e.target.tagName !== "LI" || optionsList.classList.contains("disabled"))
      return;

    const selectedOption = e.target;
    const selectedAnswerIndex = parseInt(selectedOption.dataset.index);
    const correctAnswerIndex =
      currentTestQuestions[currentQuestionIndex].correctAnswer;

    optionsList.classList.add("disabled");
    Array.from(optionsList.children).forEach((li) =>
      li.classList.add("disabled")
    );

    if (selectedAnswerIndex === correctAnswerIndex) {
      selectedOption.classList.add("selected", "correct");
      score++;
    } else {
      selectedOption.classList.add("selected", "wrong");
      optionsList.children[correctAnswerIndex].classList.add("correct");
      wrongAnswers.push(currentTestQuestions[currentQuestionIndex]);
    }

    setTimeout(() => {
      nextBtn.classList.remove("hidden");
      nextBtn.focus();
    }, 800); // Delay to show feedback
  }

  function nextQuestion() {
    questionCard.classList.add("animate-exit");

    setTimeout(() => {
      currentQuestionIndex++;
      optionsList.classList.remove("disabled");
      displayQuestion();
    }, 350); // Match animation duration
  }

  function updateProgressBar() {
    const progress = (currentQuestionIndex / currentTestQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBarContainer.setAttribute("aria-valuenow", progress);
  }

  // --- TIMER LOGIC ---
  function startTimer() {
    clearInterval(timerInterval);
    timerDisplay.classList.remove("warning");
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Time's up! The test will be submitted automatically.");
        endTest();
      } else if (timeLeft <= 10) {
        timerDisplay.classList.add("warning");
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  // --- END & RESULTS ---
  function endTest() {
    clearInterval(timerInterval);
    timerDisplay.classList.remove("warning");
    progressBar.style.width = "100%";
    progressBarContainer.setAttribute("aria-valuenow", 100);
    displayResults();
    showScreen("result");
  }

  function displayResults() {
    const total = currentTestQuestions.length;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    scoreSummary.innerHTML = `
            <p>Correct: <strong>${score}</strong></p>
            <p>Wrong: <strong>${total - score}</strong></p>
            <p>Total: <strong>${total}</strong></p>
            <p class="percentage">0%</p>
        `;

    const percentageEl = scoreSummary.querySelector(".percentage");
    animateValue(
      percentageEl,
      0,
      percentage,
      1500,
      percentage % 1 !== 0 ? 1 : 0
    );

    wrongQuestionsList.innerHTML = "";
    if (wrongAnswers.length > 0) {
      wrongQuestionsContainer.classList.remove("hidden");
      retakeWrongBtn.classList.remove("hidden");
      wrongAnswers.forEach((q) => {
        const item = document.createElement("div");
        item.className = "wrong-question-item";
        item.innerHTML = `
                    <p><strong>Q:</strong> ${q.question}</p>
                    <p class="correct-answer"><strong>Correct Answer:</strong> ${
                      q.options[q.correctAnswer]
                    }</p>
                `;
        wrongQuestionsList.appendChild(item);
      });
    } else {
      wrongQuestionsContainer.classList.add("hidden");
      retakeWrongBtn.classList.add("hidden");
    }
  }

  function animateValue(element, start, end, duration, decimals) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = progress * (end - start) + start;
      element.textContent = `${value.toFixed(decimals)}%`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // --- KEYBOARD SHORTCUTS ---
  function addKeyboardListeners() {
    document.addEventListener("keydown", (e) => {
      if (screens.test.classList.contains("active")) {
        const keyNum = parseInt(e.key);
        if (
          keyNum >= 1 &&
          keyNum <= 4 &&
          !optionsList.classList.contains("disabled")
        ) {
          const optionToSelect = optionsList.children[keyNum - 1];
          if (optionToSelect) optionToSelect.click();
        } else if (e.key === "Enter" && !nextBtn.classList.contains("hidden")) {
          nextBtn.click();
        }
      }
    });
  }
})();

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
