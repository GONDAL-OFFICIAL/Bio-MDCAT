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
    "question": "Under what condition does a charged particle experience the maximum magnetic force when moving in a magnetic field?",
    "options": ["When it moves parallel to the field (θ=0°)", "When it is stationary (v=0)", "When it moves perpendicular to the field (θ=90°)", "When it moves anti-parallel to the field (θ=180°)"],
    "correctAnswer": 2
  },
  {
    "question": "Why will a transformer not operate with a D.C. source connected to its primary coil?",
    "options": ["D.C. produces a constantly changing magnetic flux.", "D.C. produces a steady magnetic flux, and induction requires a changing flux.", "D.C. sources have zero voltage.", "The resistance of the primary coil is infinite for D.C."],
    "correctAnswer": 1
  },
  {
    "question": "Lenz's Law, which describes the direction of induced current, is a direct consequence of which fundamental principle?",
    "options": ["Law of Conservation of Momentum", "Law of Conservation of Charge", "Law of Mutual Induction", "Law of Conservation of Energy"],
    "correctAnswer": 3
  },
  {
    "question": "How are eddy current losses, which cause heat loss in a transformer's core, minimized?",
    "options": ["By using a solid soft iron core", "By using a laminated core made of insulated iron sheets", "By increasing the frequency of the A.C. supply", "By using thicker copper windings"],
    "correctAnswer": 1
  },
  {
    "question": "If a proton and an alpha particle enter a uniform magnetic field with the same momentum, how does the radius of the proton's path (r_p) compare to the alpha particle's path (r_a)? (Note: charge of alpha = 2e)",
    "options": ["r_p = 0.5 * r_a", "r_p = r_a", "r_p = 2 * r_a", "r_p = 4 * r_a"],
    "correctAnswer": 2
  },
  {
    "question": "If a proton (mass m, charge e) and an alpha particle (mass ≈ 4m, charge 2e) enter a magnetic field with the same kinetic energy, what is the ratio of their radii (r_p / r_a)?",
    "options": ["1:2", "2:1", "1:1", "1:4"],
    "correctAnswer": 2
  },
  {
    "question": "The M.K.S. (SI) unit for magnetic field strength (B) is the Tesla (T). Which of the following is an equivalent unit?",
    "options": ["Weber (Wb)", "Weber per square meter (Wb/m^2)", "Gauss (G)", "Volt (V)"],
    "correctAnswer": 1
  },
  {
    "question": "According to the provided conversions, one Tesla (T) is equal to how many Gauss (G)?",
    "options": ["10^2 G", "10^4 G", "10^-2 G", "10^-4 G"],
    "correctAnswer": 1
  },
  {
    "question": "In an A.C. generator, the induced EMF is maximum at the instant when:",
    "options": ["The plane of the coil is perpendicular to the magnetic field.", "The magnetic flux through the coil is maximum.", "The plane of the coil is parallel to the magnetic field.", "The coil stops rotating momentarily."],
    "correctAnswer": 2
  },
  {
    "question": "The time period (T) of a charged particle's circular motion in a uniform B-field is given by T = 2πm / qB. This implies that the time period is:",
    "options": ["Directly proportional to the particle's velocity.", "Inversely proportional to the particle's velocity.", "Dependent on the radius of the path.", "Independent of the particle's velocity and radius."],
    "correctAnswer": 3
  },
  {
    "question": "What is the correct expression for the total Lorentz force on a charge q in the presence of both an electric field E and a magnetic field B?",
    "options": ["F = qE", "F = q(v x B)", "F = qE + q(v x B)", "F = I(L x B)"],
    "correctAnswer": 2
  },
  {
    "question": "A charged particle moves undeflected through crossed electric (E) and magnetic (B) fields. What is its velocity (v)?",
    "options": ["v = EB", "v = E / B", "v = B / E", "v = qE / B"],
    "correctAnswer": 1
  },
  {
    "question": "A charged particle will move in a helical path (a spiral) in a uniform magnetic field if the angle between its velocity and the magnetic field is:",
    "options": ["Exactly 0°", "Exactly 90°", "Between 0° and 90°", "Exactly 180°"],
    "correctAnswer": 2
  },
  {
    "question": "When is the magnetic flux (φ = BA cosθ) through a plane surface at its minimum (zero) value?",
    "options": ["When the field is perpendicular to the plane (θ = 0°)", "When the field is parallel to the plane (θ = 90°)", "When the area A is minimized", "When B is at its maximum"],
    "correctAnswer": 1
  },
  {
    "question": "An ideal step-up transformer has a primary coil with 100 turns and a secondary coil with 300 turns. If the primary voltage is 50V, what is the secondary voltage?",
    "options": ["16.7 V", "50 V", "150 V", "300 V"],
    "correctAnswer": 2
  },
  {
    "question": "Which of the following statements accurately describes magnetic field lines?",
    "options": ["They originate from positive charges.", "They form closed loops.", "They are always perpendicular to the direction of the magnetic force.", "They are another name for electric field lines."],
    "correctAnswer": 1
  },
  {
    "question": "What is a key difference between the electric force and the magnetic force on a charged particle?",
    "options": ["The electric force acts on stationary charges, while the magnetic force does not.", "The magnetic force is always in the same direction as the magnetic field.", "The electric force is always weaker than the magnetic force.", "The magnetic force acts on neutral particles, but the electric force does not."],
    "correctAnswer": 0
  },
  {
    "question": "Among the common particles electron, proton, and neutron, which has the maximum e/m ratio?",
    "options": ["Proton", "Neutron", "Electron", "All have the same non-zero e/m ratio."],
    "correctAnswer": 2
  },
  {
    "question": "The energy lost due to repeated magnetization and demagnetization of a transformer's core is known as hysteresis loss. How is this specific type of loss minimized?",
    "options": ["By using a laminated core", "By using a soft iron core", "By using thicker windings", "By ensuring the flux per turn is constant"],
    "correctAnswer": 1
  },
  {
    "question": "Which of the following experiences zero magnetic force in a magnetic field?",
    "options": ["A neutron moving perpendicular to the field.", "A proton moving parallel to the field.", "An electron moving at 45° to the field.", "Both A and B"],
    "correctAnswer": 3
  },
  {
    "question": "What is the fundamental principle behind the operation of a transformer?",
    "options": ["Electromagnetic induction", "Mutual induction", "Self-induction", "Static electricity"],
    "correctAnswer": 1
  },
  {
    "question": "The e/m ratio of a neutron is zero because it has:",
    "options": ["Zero mass", "Zero velocity", "No charge", "A very small radius"],
    "correctAnswer": 2
  },
  {
    "question": "What is the SI unit of magnetic flux (φ)?",
    "options": ["Tesla", "Gauss", "Weber", "Volt"],
    "correctAnswer": 2
  },
  {
    "question": "What is the term for the heat loss (I²R) that occurs in the windings of a transformer?",
    "options": ["Eddy current losses", "Hysteresis losses", "Flux leakage", "Copper losses"],
    "correctAnswer": 3
  },
  {
    "question": "The 'pitch' of a helical path is the distance traveled parallel to the magnetic field in one rotation. What is its formula?",
    "options": ["x = (v sinθ) × T", "x = (v tanθ) × T", "x = (v cosθ) × T", "x = v × T"],
    "correctAnswer": 2
  },
  {
    "question": "An AC generator can be thought of as an electric motor with its:",
    "options": ["Input and output reversed", "Coil and magnets reversed", "Speed doubled", "Voltage halved"],
    "correctAnswer": 0
  },
  {
    "question": "What physical quantity is represented by 'Flux Linkages'?",
    "options": ["The magnetic flux per unit area", "The total magnetic field lines", "The product of the number of turns (N) and magnetic flux (φ)", "The rate of change of magnetic flux"],
    "correctAnswer": 2
  },
  {
    "question": "The North Pole of a bar magnet is attracted to which magnetic pole of the Earth?",
    "options": ["The geographic North Pole", "The magnetic North Pole", "The geographic South Pole", "The magnetic South Pole"],
    "correctAnswer": 3
  },
  {
    "question": "According to the fundamental concepts, a magnetic field arises due to:",
    "options": ["Stationary charges", "The presence of a conductor", "Moving charges", "A vacuum"],
    "correctAnswer": 2
  },
  {
    "question": "In a step-down transformer, how does the current in the secondary coil (I_s) relate to the primary current (I_p)?",
    "options": ["I_s < I_p", "I_s > I_p", "I_s = I_p", "I_s = 0"],
    "correctAnswer": 1
  },
  {
    "question": "What is another name for the magnetic field strength (B)?",
    "options": ["Magnetic Flux", "Magnetic Flux Density", "Flux Linkages", "Magnetic Potential"],
    "correctAnswer": 1
  },
  {
    "question": "How does the direction of the electric force compare to the electric field, and the magnetic force to the magnetic field?",
    "options": ["Both are parallel", "E-force is collinear, B-force is perpendicular", "E-force is perpendicular, B-force is collinear", "Both are perpendicular"],
    "correctAnswer": 1
  },
  {
    "question": "A center-tapped transformer, where the center tap wire is at zero volts, is often used in:",
    "options": ["Amplifier circuits", "Oscillator circuits", "Rectifier circuits", "Filter circuits"],
    "correctAnswer": 2
  },
  {
    "question": "The formula for the angular frequency (ω) of a charge q with mass m in a uniform magnetic field B is:",
    "options": ["ω = qB / m", "ω = m / qB", "ω = qm / B", "ω = B / qm"],
    "correctAnswer": 0
  },
  {
    "question": "If the momentum of a charged particle moving perpendicular to a magnetic field is doubled, the radius of its circular path will:",
    "options": ["Be halved", "Remain the same", "Be doubled", "Be quadrupled"],
    "correctAnswer": 2
  },
  {
    "question": "Why does the magnetic force on a charged particle perform no work?",
    "options": ["Because the magnetic field is a conservative field.", "Because the force is always zero.", "Because the force is always parallel to the velocity.", "Because the force is always perpendicular to the direction of motion."],
    "correctAnswer": 3
  },
  {
    "question": "According to the provided text, what is the standard AC frequency used in Pakistan?",
    "options": ["60 Hz", "120 Hz", "50 Hz", "100 Hz"],
    "correctAnswer": 2
  },
  {
    "question": "The kinetic energy of a particle moving in a circular path of radius r in a B-field can be expressed as:",
    "options": ["K.E. = r²q²B² / 2m", "K.E. = rqB / 2m", "K.E. = 2m / r²q²B²", "K.E. = mv / r"],
    "correctAnswer": 0
  },
  {
    "question": "If the rate of change of flux is given in weber/sec, the induced e.m.f. is measured in which unit?",
    "options": ["Amperes", "Teslas", "Webers", "Volts"],
    "correctAnswer": 3
  },
  {
    "question": "What is the core assumption made about the magnetic flux in an ideal transformer?",
    "options": ["The flux per turn is the same in both primary and secondary coils.", "The total flux is zero.", "The flux is directly proportional to the current.", "The flux is only present in the primary coil."],
    "correctAnswer": 0
  },
  {
    "question": "Iron losses are a category of core losses in a transformer that include:",
    "options": ["Copper loss and flux loss", "Eddy current loss and hysteresis loss", "Mechanical loss and heat loss", "Voltage loss and current loss"],
    "correctAnswer": 1
  },
  {
    "question": "The total charge (q) that flows in a circuit with N turns and resistance R due to a total change in flux (Δφ) depends on:",
    "options": ["The rate of change of flux", "The total change in flux", "The resistance only", "The number of turns only"],
    "correctAnswer": 1
  },
  {
    "question": "A charged particle moves in a straight line through a magnetic field. Which statement must be true?",
    "options": ["The particle is moving perpendicular to the field.", "The magnetic field is zero.", "The particle's velocity is parallel or anti-parallel to the field.", "The particle has no charge."],
    "correctAnswer": 2
  },
  {
    "question": "The efficiency of a transformer is defined as the ratio of:",
    "options": ["Primary power to secondary power", "Input power to output power", "Output power to input power", "Secondary voltage to primary voltage"],
    "correctAnswer": 2
  },
  {
    "question": "Which of the following is a C.G.S. unit for magnetic field strength?",
    "options": ["Tesla", "Weber", "Ampere-meter", "Gauss"],
    "correctAnswer": 3
  },
  {
    "question": "In a step-up transformer, the number of turns in the secondary (N_s) is greater than the primary (N_p). This results in:",
    "options": ["Decreased secondary voltage and decreased secondary current", "Increased secondary voltage and increased secondary current", "Increased secondary voltage and decreased secondary current", "Decreased secondary voltage and increased secondary current"],
    "correctAnswer": 2
  },
  {
    "question": "The force on a straight conductor of length L with current I in a uniform magnetic field B is given by:",
    "options": ["F = I(L ⋅ B)", "F = I(B x L)", "F = I(L x B)", "F = ILB cosθ"],
    "correctAnswer": 2
  },
  {
    "question": "A charged particle will enter a circular path in a uniform B-field if it enters at an angle of:",
    "options": ["0°", "45°", "90°", "180°"],
    "correctAnswer": 2
  },
  {
    "question": "Faraday's Law states that an e.m.f. is induced in a coil only when:",
    "options": ["A steady current flows through it", "The magnetic flux through it changes", "It is placed in a strong magnetic field", "The coil is made of a specific material"],
    "correctAnswer": 1
  },
  {
    "question": "When is the induced EMF in an AC generator's coil equal to zero?",
    "options": ["When the plane of the coil is parallel to the magnetic field", "When the coil cuts flux lines at the fastest rate", "When the plane of the coil is perpendicular to the magnetic field", "When the coil's angular velocity is maximum"],
    "correctAnswer": 2
  },
  {
    "question": "What is the specific charge (e/m) value for an electron?",
    "options": ["1.602 x 10^-19 C/kg", "9.11 x 10^-31 C/kg", "1.7588 x 10^11 C/kg", "6.022 x 10^23 C/kg"],
    "correctAnswer": 2
  },
  {
    "question": "If an electron and a proton enter a B-field with the same momentum, which will have a smaller radius of curvature?",
    "options": ["The proton", "The electron", "Both will have the same radius", "Neither will curve"],
    "correctAnswer": 2
  },
  {
    "question": "Magnetic force is velocity-dependent, whereas electric force:",
    "options": ["Is also velocity-dependent", "Acts on a charge whether it is at rest or moving", "Only acts on charges at rest", "Is always weaker"],
    "correctAnswer": 1
  },
  {
    "question": "What is the SI unit for the rate of change of flux (weber/sec)?",
    "options": ["Tesla", "Volt", "Farad", "Henry"],
    "correctAnswer": 1
  },
  {
    "question": "If a particle with charge 'q' and momentum 'p' moves in a B-field of strength 'B' and charge 'e', the radius 'r' is proportional to:",
    "options": ["p / e", "e / p", "p * e", "p * e²"],
    "correctAnswer": 0
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

document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calc-btn");
  const calcPopup = document.getElementById("calc-popup");
  const closeCalc = document.getElementById("close-calc");

  calcBtn.addEventListener("click", () => {
    calcPopup.classList.remove("hidden");
  });

  closeCalc.addEventListener("click", () => {
    calcPopup.classList.add("hidden");
  });

  // Optional: close popup if clicking outside
  calcPopup.addEventListener("click", (e) => {
    if (e.target === calcPopup) {
      calcPopup.classList.add("hidden");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calc-btn");
  const calcPopup = document.getElementById("calc-popup");
  const closeCalc = document.getElementById("close-calc");
  const calcContainer = document.querySelector(".calc-container");
  const header = document.querySelector(".calc-header");

  // --- Show and hide calculator ---
  calcBtn.addEventListener("click", () => {
    calcPopup.classList.remove("hidden");
  });

  closeCalc.addEventListener("click", () => {
    calcPopup.classList.add("hidden");
  });

  calcPopup.addEventListener("click", (e) => {
    if (e.target === calcPopup) {
      calcPopup.classList.add("hidden");
    }
  });

  // --- Dragging logic ---
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = calcContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    calcContainer.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    calcContainer.style.left = e.clientX - offsetX + "px";
    calcContainer.style.top = e.clientY - offsetY + "px";
    calcContainer.style.transform = "none"; // disable center transform after first move
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    calcContainer.style.cursor = "grab";
  });
});

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
