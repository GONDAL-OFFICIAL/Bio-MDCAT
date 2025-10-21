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
    "question": "In a P-type semiconductor, what are the majority and minority charge carriers, respectively?",
    "options": ["Electrons, Holes", "Holes, Electrons", "Holes, Protons", "Electrons, Neutrons"],
    "correctAnswer": 1
  },
  {
    "question": "Which type of doping is used to create an N-type semiconductor?",
    "options": ["Trivalent doping", "Pentavalent doping", "Divalent doping", "Monovalent doping"],
    "correctAnswer": 1
  },
  {
    "question": "A P-type semiconductor acts as an ________ site due to the presence of holes.",
    "options": ["acceptor", "donor", "neutral", "insulator"],
    "correctAnswer": 0
  },
  {
    "question": "What is the approximate potential barrier for a Germanium (Ge) PN junction diode?",
    "options": ["0.1 V", "0.3 V", "0.7 V", "1.1 V"],
    "correctAnswer": 1
  },
  {
    "question": "For a Silicon (Si) diode, the potential barrier is approximately:",
    "options": ["0.3 V", "0.5 V", "0.7 V", "0.9 V"],
    "correctAnswer": 2
  },
  {
    "question": "How must a PN junction be connected for it to be forward-biased?",
    "options": ["P-type to negative, N-type to positive", "P-type to positive, N-type to negative", "Both to positive", "Both to negative"],
    "correctAnswer": 1
  },
  {
    "question": "What happens to the width of the potential barrier in a forward-biased diode?",
    "options": ["It increases", "It remains the same", "It decreases gradually", "It becomes infinite"],
    "correctAnswer": 2
  },
  {
    "question": "In a reverse-biased PN junction:",
    "options": ["The barrier width decreases, and current is maximum.", "The barrier width increases, and current is minimal.", "The P-type is connected to the positive terminal.", "The external field supports the barrier field."],
    "correctAnswer": 1
  },
  {
    "question": "An N-type semiconductor has a high concentration of electrons and acts as a ________ site.",
    "options": ["acceptor", "insulating", "neutral", "donor"],
    "correctAnswer": 3
  },
  {
    "question": "What is the primary function of a diode in an electronic circuit?",
    "options": ["To amplify a signal", "To act as a rectifier", "To store charge", "To provide resistance"],
    "correctAnswer": 1
  },
  {
    "question": "The process of converting an alternating current (AC) into a direct current (DC) is called:",
    "options": ["Amplification", "Oscillation", "Rectification", "Modulation"],
    "correctAnswer": 2
  },
  {
    "question": "If the input frequency to a half-wave rectifier is 60 Hz, what is the output frequency?",
    "options": ["30 Hz", "60 Hz", "120 Hz", "0 Hz"],
    "correctAnswer": 1
  },
  {
    "question": "What is the maximum theoretical efficiency of a half-wave rectifier?",
    "options": ["100%", "81.2%", "50%", "40.6%"],
    "correctAnswer": 3
  },
  {
    "question": "The ripple factor of a half-wave rectifier is:",
    "options": ["0.48", "1.0", "1.21", "2.0"],
    "correctAnswer": 2
  },
  {
    "question": "A half-wave rectifier has a peak output voltage (V₀) of 10 V. What is its RMS voltage (V_RMS)?",
    "options": ["10 V", "7.07 V", "5 V", "14.1 V"],
    "correctAnswer": 2
  },
  {
    "question": "The peak inverse voltage (PIV) across the diode in a half-wave rectifier is equal to:",
    "options": ["V₀ / 2", "V₀", "2V₀", "V₀ / √2"],
    "correctAnswer": 1
  },
  {
    "question": "The peak factor of a half-wave rectifier is:",
    "options": ["1.21", "√2", "1", "2"],
    "correctAnswer": 3
  },
  {
    "question": "If an AC signal of 50 Hz is applied to a full-wave rectifier, what will be the frequency of the output DC signal?",
    "options": ["25 Hz", "50 Hz", "100 Hz", "200 Hz"],
    "correctAnswer": 2
  },
  {
    "question": "What is the maximum efficiency of a full-wave rectifier?",
    "options": ["40.6%", "75.5%", "81.2%", "95.1%"],
    "correctAnswer": 2
  },
  {
    "question": "A full-wave rectifier has a significantly lower ripple factor than a half-wave rectifier. What is its value?",
    "options": ["1.21", "1.0", "0.81", "0.48"],
    "correctAnswer": 3
  },
  {
    "question": "For a full-wave rectifier, if the peak voltage is V₀, the RMS voltage (V_RMS) is:",
    "options": ["V₀ / 2", "V₀", "2V₀", "V₀ / √2"],
    "correctAnswer": 3
  },
  {
    "question": "A full-wave bridge rectifier is connected to a transformer with a peak output voltage of 12 V. What is the PIV for the diodes?",
    "options": ["6 V", "12 V", "24 V", "17 V"],
    "correctAnswer": 1
  },
  {
    "question": "A full-wave rectifier using a centre-tap transformer has a peak voltage of 15 V across each half of the secondary winding. What is the PIV for each diode?",
    "options": ["15 V", "7.5 V", "30 V", "10.6 V"],
    "correctAnswer": 2
  },
  {
    "question": "The peak factor for a full-wave rectified sine wave is:",
    "options": ["2", "√2", "1.21", "0.48"],
    "correctAnswer": 1
  },
  {
    "question": "A full-wave rectifier has a peak output voltage (V₀) of 20 V. What is its approximate RMS voltage (V_RMS)?",
    "options": ["20 V", "10 V", "28.2 V", "14.14 V"],
    "correctAnswer": 3
  },
  {
    "question": "Comparing rectifiers, which statement is true?",
    "options": ["Half-wave has higher efficiency than full-wave.", "Full-wave has a higher ripple factor than half-wave.", "Full-wave output frequency is double the input frequency.", "Half-wave PIV is always higher than full-wave PIV."],
    "correctAnswer": 2
  },
  {
    "question": "Who first introduced the concept of light energy being composed of discrete packets, or 'quanta,' to explain blackbody radiation?",
    "options": ["Albert Einstein", "Max Planck", "Louis de Broglie", "Carl Anderson"],
    "correctAnswer": 1
  },
  {
    "question": "According to modern physics, what is the rest mass of a photon?",
    "options": ["Equal to an electron's mass", "Infinitesimally small but not zero", "Zero", "Dependent on its energy"],
    "correctAnswer": 2
  },
  {
    "question": "The energy of a photon is given by the formula E = hf. This means a photon's energy is directly proportional to its:",
    "options": ["Wavelength", "Speed", "Frequency", "Mass"],
    "correctAnswer": 2
  },
  {
    "question": "Despite having no rest mass, a photon carries momentum. What is the formula for a photon's momentum (p)?",
    "options": ["p = hf", "p = h/λ", "p = mc²", "p = E/c²"],
    "correctAnswer": 1
  },
  {
    "question": "How do photons behave in the presence of an electric or magnetic field?",
    "options": ["They are deflected towards the positive pole.", "They are deflected towards the negative pole.", "They are not deflected.", "They oscillate within the field."],
    "correctAnswer": 2
  },
  {
    "question": "The photoelectric effect is the emission of ________ from a metal surface when light shines on it.",
    "options": ["protons", "photons", "neutrons", "electrons"],
    "correctAnswer": 3
  },
  {
    "question": "In the photoelectric effect, increasing the intensity of the light will:",
    "options": ["Increase the kinetic energy of the emitted electrons.", "Increase the number of emitted electrons.", "Increase both the number and kinetic energy of electrons.", "Have no effect on the emission."],
    "correctAnswer": 1
  },
  {
    "question": "What happens in the photoelectric effect if the frequency of the incident light is below the 'threshold frequency' (f₀)?",
    "options": ["Electrons are emitted with very low energy.", "Fewer electrons are emitted.", "No electrons are emitted, regardless of intensity.", "The metal becomes positively charged."],
    "correctAnswer": 2
  },
  {
    "question": "Einstein's photoelectric equation is K.E.max = hf - ϕ₀. What does the term ϕ₀ (work function) represent?",
    "options": ["The total energy of the incident photon.", "The kinetic energy of the electron.", "The energy required for an electron to escape the metal surface.", "The threshold frequency of the metal."],
    "correctAnswer": 2
  },
  {
    "question": "The nearly instantaneous emission of electrons in the photoelectric effect was a major failure of which theory?",
    "options": ["The particle theory of light", "The quantum theory", "The classical wave theory of light", "The theory of relativity"],
    "correctAnswer": 2
  },
  {
    "question": "The Compton effect involves the scattering of a high-energy photon by a(n):",
    "options": ["proton", "atomic nucleus", "electron", "neutron"],
    "correctAnswer": 2
  },
  {
    "question": "After a photon undergoes Compton scattering, its wavelength is observed to be:",
    "options": ["shorter (higher frequency)", "longer (lower frequency)", "unchanged", "zero"],
    "correctAnswer": 1
  },
  {
    "question": "The Compton effect is explained by treating the interaction as an elastic collision where both ________ and ________ are conserved.",
    "options": ["mass, charge", "energy, momentum", "wavelength, frequency", "charge, momentum"],
    "correctAnswer": 1
  },
  {
    "question": "The Compton shift (Δλ) is at its maximum when the photon is scattered at an angle of:",
    "options": ["0°", "45°", "90°", "180°"],
    "correctAnswer": 3
  },
  {
    "question": "The Compton effect provides definitive experimental proof that photons possess particle-like ________.",
    "options": ["mass", "charge", "momentum", "volume"],
    "correctAnswer": 2
  },
  {
    "question": "What is the name of the process where a high-energy photon transforms into an electron-positron pair?",
    "options": ["Annihilation", "Compton Scattering", "Pair Production", "Photoelectric Effect"],
    "correctAnswer": 2
  },
  {
    "question": "For pair production to occur, the incident photon must have a minimum energy of:",
    "options": ["0.51 MeV", "1.02 MeV", "1.21 GeV", "There is no minimum energy."],
    "correctAnswer": 1
  },
  {
    "question": "Why must pair production occur near a heavy atomic nucleus?",
    "options": ["To provide the necessary energy.", "To conserve momentum.", "To create a positron.", "To absorb excess electrons."],
    "correctAnswer": 1
  },
  {
    "question": "Annihilation is the process where a particle and its antiparticle collide, converting their mass into:",
    "options": ["a single, more massive particle", "a black hole", "energy, typically two photons", "a shower of quarks"],
    "correctAnswer": 2
  },
  {
    "question": "Who first predicted the existence of antimatter, such as the positron?",
    "options": ["Carl Anderson", "Albert Einstein", "Louis de Broglie", "P.A.M. Dirac"],
    "correctAnswer": 3
  },
  {
    "question": "How does an antiparticle, like a positron, compare to its corresponding particle, an electron?",
    "options": ["Same mass, opposite charge", "Opposite mass, same charge", "Different mass and charge", "Same mass and charge"],
    "correctAnswer": 0
  },
  {
    "question": "Who proposed the revolutionary idea that particles, like electrons, should also exhibit wave-like behavior?",
    "options": ["Max Planck", "Albert Einstein", "Louis de Broglie", "Davisson and Germer"],
    "correctAnswer": 2
  },
  {
    "question": "The de Broglie wavelength of a particle is given by λ = h/p. This means the wavelength is ________ proportional to the particle's momentum.",
    "options": ["directly", "inversely", "not", "exponentially"],
    "correctAnswer": 1
  },
  {
    "question": "Why is the wave nature of a macroscopic object like a baseball not observable?",
    "options": ["It travels too slowly.", "It has no charge.", "Its wavelength is infinitesimally small due to its large mass.", "It does not have a de Broglie wavelength."],
    "correctAnswer": 2
  },
  {
    "question": "The Davisson-Germer experiment provided the first direct proof of de Broglie's hypothesis by observing the ________ of electrons from a nickel crystal.",
    "options": ["reflection", "refraction", "annihilation", "diffraction"],
    "correctAnswer": 3
  },
  {
    "question": "The electron microscope can achieve much higher resolutions than a light microscope because:",
    "options": ["Electrons are larger than photons.", "The wavelength of electrons can be made much shorter than that of visible light.", "Electrons travel faster than light.", "The electron beam is more intense."],
    "correctAnswer": 1
  },
  {
    "question": "While a photon has zero rest mass, it possesses a 'kinetic mass' in motion. Which formula represents this kinetic mass?",
    "options": ["m = E/c", "m = hf", "m = cλ/h", "m = h/cλ"],
    "correctAnswer": 3
  },
  {
    "question": "In the context of the photoelectric effect, what is the 'stopping potential'?",
    "options": ["The potential that starts the electron flow.", "The potential of the metal surface.", "The negative potential required to stop the photoelectric current.", "The energy of the most energetic electron."],
    "correctAnswer": 2
  },
  {
    "question": "The value of the stopping potential in a photoelectric experiment depends directly on the:",
    "options": ["intensity of the incident light.", "frequency of the incident light.", "nature of the metal surface.", "time of illumination."],
    "correctAnswer": 1
  },
  {
    "question": "The work function (ϕ₀) of a metal is the minimum energy required for an electron to escape. What does its value depend on?",
    "options": ["The frequency of the incident light.", "The intensity of the incident light.", "The nature of the metal and its surface impurities.", "The temperature of the metal."],
    "correctAnswer": 2
  },
  {
    "question": "Which of these is a key observation of the photoelectric effect that classical wave theory could NOT explain?",
    "options": ["Light can be reflected.", "The instantaneous emission of electrons.", "Light exerts pressure.", "The color of the light affects the experiment."],
    "correctAnswer": 1
  },
  {
    "question": "The Compton effect is most readily observed using high-energy photons like:",
    "options": ["Radio waves", "Microwaves", "Visible light", "X-rays"],
    "correctAnswer": 3
  },
  {
    "question": "The term h/m₀c in the Compton shift formula is a constant known as the:",
    "options": ["Planck constant", "de Broglie wavelength of the photon", "Compton wavelength of the electron", "Work function of the electron"],
    "correctAnswer": 2
  },
  {
    "question": "At what scattering angle (θ) is the Compton shift equal to zero?",
    "options": ["θ = 180°", "θ = 90°", "θ = 45°", "θ = 0°"],
    "correctAnswer": 3
  },
  {
    "question": "The 'materialization of energy' refers to which process?",
    "options": ["Annihilation", "Pair Production", "Compton Effect", "Photoelectric Effect"],
    "correctAnswer": 1
  },
  {
    "question": "When an electron and a positron annihilate, they typically produce two photons traveling in opposite directions. Why opposite directions?",
    "options": ["To conserve energy", "To conserve charge", "To conserve momentum", "To create a magnetic field"],
    "correctAnswer": 2
  },
  {
    "question": "Each photon produced during electron-positron annihilation carries away how much energy?",
    "options": ["1.02 MeV", "0.51 MeV", "17.5 keV", "The total energy of the pair"],
    "correctAnswer": 1
  },
  {
    "question": "The existence of antimatter was first predicted by P.A.M. Dirac and later confirmed by Carl Anderson through the study of:",
    "options": ["blackbody radiation", "the photoelectric effect", "cosmic rays", "atomic spectra"],
    "correctAnswer": 2
  },
  {
    "question": "For a macroscopic object like a 200g ball moving at 5 m/hr, the de Broglie wavelength is practically undetectable because it is:",
    "options": ["extremely large", "infinitesimally small", "equal to the ball's diameter", "only present at light speed"],
    "correctAnswer": 1
  },
  {
    "question": "What was the accelerating potential used for the electron beam in the Davisson-Germer experiment?",
    "options": ["0.3 V", "0.7 V", "54 V", "1.02 MV"],
    "correctAnswer": 2
  },
  {
    "question": "In the Davisson-Germer experiment, the strong peak of diffracted electrons was observed at a scattering angle of:",
    "options": ["0°", "45°", "65°", "90°"],
    "correctAnswer": 2
  },
  {
    "question": "The Nobel Prize in Physics for the discovery of the wave nature of electrons was awarded to:",
    "options": ["Einstein and Planck", "Dirac and Anderson", "Hallwach and Compton", "Davisson and Thomson"],
    "correctAnswer": 3
  },
  {
    "question": "If a photon's rest mass is zero, what can be concluded about its momentum?",
    "options": ["Its momentum is also zero.", "Its momentum is non-zero and given by p = h/λ.", "Its momentum is infinite.", "Its momentum depends on its kinetic mass only."],
    "correctAnswer": 1
  },
  {
    "question": "What is the reverse process of pair production?",
    "options": ["Compton scattering", "The photoelectric effect", "Annihilation of matter", "Blackbody radiation"],
    "correctAnswer": 2
  },
  {
    "question": "If an electron and a proton have the same de Broglie wavelength, which particle must have a higher speed?",
    "options": ["The proton", "The electron", "They must have the same speed", "It is impossible for them to have the same wavelength"],
    "correctAnswer": 1
  },
  {
    "question": "If a proton and an alpha particle have the same de Broglie wavelength, what other physical quantity must also be the same for both?",
    "options": ["Their kinetic energy", "Their speed", "Their electric charge", "Their momentum"],
    "correctAnswer": 3
  },
  {
    "question": "Hallwach's early experiments with the photoelectric effect used a setup involving two zinc plates in a vacuum tube and ________ light.",
    "options": ["infrared", "visible", "ultraviolet", "microwave"],
    "correctAnswer": 2
  },
  {
    "question": "The principle that quantized energy applies to any oscillating system, not just light, was a key insight from:",
    "options": ["Einstein's photon theory", "Planck's work on blackbody radiation", "De Broglie's hypothesis", "The Compton effect"],
    "correctAnswer": 1
  },
  {
    "question": "The Compton wavelength of an electron has a specific, constant value. What is this approximate value?",
    "options": ["3.00 x 10^8 m", "1.66 x 10^-10 m", "2.43 x 10^-12 m", "9.11 x 10^-31 m"],
    "correctAnswer": 2
  },
  {
    "question": "What is the experimentally observed time lag between light incidence and electron emission in the photoelectric effect?",
    "options": ["Approximately 1 second", "Less than 10^-8 seconds", "Several minutes", "It depends on the light intensity"],
    "correctAnswer": 1
  },
  {
    "question": "The Davisson-Germer experiment used Bragg's law (2d sinθ = mλ) to analyze their results. What does this law describe?",
    "options": ["The conservation of momentum", "The conditions for constructive interference of waves", "The energy of a photon", "The rate of electron emission"],
    "correctAnswer": 1
  },
  {
    "question": "Which formula correctly relates the maximum kinetic energy of a photoelectron (K.E.max) to the stopping potential (V₀)?",
    "options": ["K.E.max = V₀ / e", "K.E.max = e / V₀", "K.E.max = eV₀", "K.E.max = V₀² / e"],
    "correctAnswer": 2
  },
  {
    "question": "What was the approximate atomic spacing (d) for the nickel crystal used in the Davisson-Germer experiment?",
    "options": ["1.66 x 10^-10 m", "2.43 x 10^-12 m", "54 x 10^-9 m", "0.91 x 10^-10 m"],
    "correctAnswer": 3
  },
  {
    "question": "How is the photoelectric current (i) related to the intensity of incident light (I)?",
    "options": ["i is inversely proportional to I", "i is proportional to I²", "i is directly proportional to I", "i is independent of I"],
    "correctAnswer": 2
  },
  {
    "question": "Which equation correctly describes energy conservation in pair production?",
    "options": ["hf = m₀c²", "hf = 2m₀c² + K.E.", "hf = K.E.e- + K.E.e+", "E = mc²"],
    "correctAnswer": 1
  },
  {
    "question": "The de Broglie wavelength for an electron accelerated through a potential difference (V) is given by:",
    "options": ["λ = h / mv", "λ = h / √(2mVe)", "λ = hc / E", "λ = 2d sinθ"],
    "correctAnswer": 1
  },
  {
    "question": "The work function (ϕ₀) can be calculated using the threshold frequency (f₀) with the formula:",
    "options": ["ϕ₀ = h / f₀", "ϕ₀ = f₀ / h", "ϕ₀ = hf₀", "ϕ₀ = c / f₀"],
    "correctAnswer": 2
  },
  {
    "question": "Einstein's mass variation equation shows a photon's rest mass is zero because for a photon, its velocity (v) equals the speed of light (c). What does this cause in the equation m₀ = m√(1 - v²/c²)?",
    "options": ["The term under the square root becomes 1", "The term under the square root becomes negative", "The term under the square root becomes zero", "The equation becomes invalid"],
    "correctAnswer": 2
  },
  {
    "question": "The Davisson-Germer experiment showed a remarkable agreement between the theoretical de Broglie wavelength and the experimental wavelength of electrons, which were approximately:",
    "options": ["1.66 Å and 1.65 Å", "2.43 pm and 2.41 pm", "0.91 Å and 0.90 Å", "54 nm and 53 nm"],
    "correctAnswer": 0
  },
  {
    "question": "The typical energy of X-ray photons used to observe the Compton effect is:",
    "options": ["Less than 1 eV", "Around 2-3 eV", "1.02 MeV", "Greater than or equal to 17.5 keV"],
    "correctAnswer": 3
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
