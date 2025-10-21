/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- DOM ELEMENT REFERENCES ---
const setupContainer = document.getElementById('setup-container');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

const numQuestionsInput = document.getElementById('num-questions');
const startBtn = document.getElementById('start-btn');
const errorMessage = document.getElementById('error-message');
const questionCountInfo = document.getElementById('question-count-info');

const progressText = document.getElementById('progress-text');
const progressBarInner = document.getElementById('progress-bar-inner');
const timerText = document.getElementById('timer-text');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const nextBtn = document.getElementById('next-btn');

const scoreSummary = document.getElementById('score-summary');
const wrongQuestionsContainer = document.getElementById('wrong-questions-container');
const wrongQuestionsList = document.getElementById('wrong-questions-list');
const retakeFullBtn = document.getElementById('retake-full-btn');
const retakeWrongBtn = document.getElementById('retake-wrong-btn');


// --- STATE MANAGEMENT ---
const PRESET_QUESTIONS = [
    // Core Concepts & Definitions
    {
        question: "Which statement accurately describes the formation of a cation?",
        options: ["It is an exothermic process.", "The resulting ion is larger than its parent atom.", "It involves an atom losing one or more electrons.", "It involves an atom gaining one or more electrons."],
        answer: "It involves an atom losing one or more electrons."
    },
    {
        question: "The formation of a uni-negative anion is typically what kind of process?",
        options: ["Exothermic", "Endothermic", "Isothermic", "Neutral"],
        answer: "Exothermic"
    },
    {
        question: "What are isobars?",
        options: ["Atoms with the same number of protons but different neutrons.", "Atoms with the same number of neutrons but different protons.", "Atoms with the same mass number but different atomic numbers.", "Atoms with the same atomic number and mass number."],
        answer: "Atoms with the same mass number but different atomic numbers."
    },
    {
        question: "The species ¹⁴C and ¹⁴N are examples of:",
        options: ["Isotopes", "Isobars", "Isotones", "Allotropes"],
        answer: "Isobars"
    },
     {
        question: "The atoms ¹⁴C (Carbon-14) and ¹⁶O (Oxygen-16) both have 8 neutrons. They are examples of:",
        options: ["Isotopes", "Isobars", "Isotones", "Allotropes"],
        answer: "Isotones"
    },
    {
        question: "Which of the following elements naturally exists as a single isotope (is mono-isotopic)?",
        options: ["Carbon", "Chlorine", "Fluorine (F)", "Oxygen"],
        answer: "Fluorine (F)"
    },
    // The Mole & Numerical Problem-Solving
    {
        question: "What is the value of Avogadro's Number (N_A)?",
        options: ["6.022 x 10²²", "6.022 x 10²³", "3.011 x 10²³", "1.602 x 10⁻¹⁹"],
        answer: "6.022 x 10²³"
    },
    {
        question: "What is the molar volume of any ideal gas at Standard Temperature and Pressure (STP)?",
        options: ["22.414 dm³", "24.0 dm³", "1 dm³", "100 cm³"],
        answer: "22.414 dm³"
    },
    {
        question: "The simplest whole-number ratio of atoms in a compound is known as the:",
        options: ["Molecular Formula", "Structural Formula", "Ionic Formula", "Empirical Formula"],
        answer: "Empirical Formula"
    },
    {
        question: "If the empirical formula of a compound is CH₂O and its molecular mass is 180 g/mol, what is its molecular formula?",
        options: ["C₂H₄O₂", "C₃H₆O₃", "C₆H₁₂O₆", "C₇H₁₄O₇"],
        answer: "C₆H₁₂O₆"
    },
    {
        question: "In combustion analysis, what substance is commonly used to absorb H₂O?",
        options: ["Potassium Hydroxide (KOH)", "Magnesium perchlorate (Mg(ClO₄)₂)", "Sodium Chloride (NaCl)", "Sulfuric Acid (H₂SO₄)"],
        answer: "Magnesium perchlorate (Mg(ClO₄)₂)"
    },
    // Stoichiometry
    {
        question: "The reactant that is completely consumed in a chemical reaction and limits the amount of product formed is called the:",
        options: ["Excess Reactant", "Catalyst", "Limiting Reactant", "Product"],
        answer: "Limiting Reactant"
    },
    {
        question: "The maximum amount of product that can be formed from the given amounts of reactants is known as the:",
        options: ["Actual Yield", "Theoretical Yield", "Percentage Yield", "Experimental Yield"],
        answer: "Theoretical Yield"
    },
    {
        question: "Which of the following is NOT a reason for low actual yield in an experiment?",
        options: ["Side reactions occurring", "Incomplete reaction (equilibrium)", "Perfectly efficient filtration and crystallization", "Mechanical losses during transfer"],
        answer: "Perfectly efficient filtration and crystallization"
    },
    // Atomic Structure - Foundational Particles
    {
        question: "Who is credited with the discovery of positive rays (canal rays)?",
        options: ["J.J. Thomson", "James Chadwick", "Niels Bohr", "Eugene Goldstein"],
        answer: "Eugene Goldstein"
    },
    {
        question: "Where do positive rays originate in a modified Crookes tube?",
        options: ["From the cathode surface", "From the anode surface", "From the residual gas molecules in the tube", "From outside the tube"],
        answer: "From the residual gas molecules in the tube"
    },
    {
        question: "How does the charge-to-mass (e/m) ratio of positive rays compare to that of electrons?",
        options: ["It is identical.", "It is considerably larger.", "It is considerably smaller.", "It is always zero."],
        answer: "It is considerably smaller."
    },
    {
        question: "The e/m ratio of positive rays is not constant because:",
        options: ["Their charge changes.", "Their mass depends on the gas used.", "The electric field varies.", "The cathode material changes."],
        answer: "Their mass depends on the gas used."
    },
    {
        question: "Which gas, when used in a discharge tube, produces positive rays with the highest e/m ratio?",
        options: ["Helium", "Neon", "Hydrogen", "Oxygen"],
        answer: "Hydrogen"
    },
    {
        question: "Which subatomic particle has a relative mass of approximately 1/1836th of a proton?",
        options: ["Neutron", "Positron", "Electron", "Quark"],
        answer: "Electron"
    },
    // Atomic Structure - Bohr's Model & Spectra
    {
        question: "According to Bohr's model, what happens when an electron jumps from a higher energy orbit (E₂) to a lower energy orbit (E₁)?",
        options: ["It absorbs a photon of energy E₂ + E₁.", "It emits a photon of energy E₂ - E₁.", "It absorbs a photon of energy E₂ - E₁.", "It remains in a stable state without any energy change."],
        answer: "It emits a photon of energy E₂ - E₁."
    },
    {
        question: "The spectral lines in the Lyman series of the hydrogen spectrum are found in which region?",
        options: ["Visible", "Infrared", "Ultraviolet", "Microwave"],
        answer: "Ultraviolet"
    },
    {
        question: "An electron transition in a hydrogen atom results in the emission of a photon of green light. What is the principal quantum number (n) of the final state?",
        options: ["n=1", "n=2", "n=3", "n=4"],
        answer: "n=2"
    },
    {
        question: "In the Bohr model, the radius of an orbit (r_n) is directly proportional to:",
        options: ["n", "1/n", "n²", "1/n²"],
        answer: "n²"
    },
    {
        question: "In the Bohr model, how does the energy difference between consecutive orbits change as 'n' increases?",
        options: ["It increases.", "It decreases.", "It stays the same.", "It becomes zero."],
        answer: "It decreases."
    },
    // Quantum-Mechanical Model
    {
        question: "Which quantum number primarily determines the energy level and size of an orbital?",
        options: ["Azimuthal (l)", "Magnetic (m_l)", "Principal (n)", "Spin (m_s)"],
        answer: "Principal (n)"
    },
    {
        question: "What is the shape of a p-orbital?",
        options: ["Spherical", "Dumbbell", "Cloverleaf", "Complex multi-lobed"],
        answer: "Dumbbell"
    },
    {
        question: "For a given principal quantum number n=3, what are the possible values for the azimuthal quantum number (l)?",
        options: ["0, 1, 2, 3", "1, 2, 3", "0, 1, 2", "-2, -1, 0, 1, 2"],
        answer: "0, 1, 2"
    },
    {
        question: "If the azimuthal quantum number (l) is 2, what are the possible values for the magnetic quantum number (m_l)?",
        options: ["0, 1, 2", "-1, 0, +1", "0", "-2, -1, 0, +1, +2"],
        answer: "-2, -1, 0, +1, +2"
    },
    {
        question: "Which of the following sets of quantum numbers (n, l, m_l, m_s) is NOT allowed?",
        options: ["(3, 2, -1, +1/2)", "(4, 0, 0, -1/2)", "(2, 2, 1, +1/2)", "(5, 1, 0, +1/2)"],
        answer: "(2, 2, 1, +1/2)"
    },
    {
        question: "How many orbitals are in a d-subshell (l=2)?",
        options: ["1", "3", "5", "7"],
        answer: "5"
    },
    {
        question: "The d(z²) orbital is unique because its shape consists of a dumbbell along the z-axis and a:",
        options: ["Second dumbbell on the x-axis", "Torus (donut shape) in the xy-plane", "Four lobes between the axes", "Spherical node"],
        answer: "Torus (donut shape) in the xy-plane"
    },
    // Electron Arrangement
    {
        question: "The Aufbau principle states that electrons fill orbitals in order of:",
        options: ["Increasing atomic number", "Decreasing energy", "Increasing energy", "Alphabetical order of subshell"],
        answer: "Increasing energy"
    },
    {
        question: "What is the maximum number of electrons an orbital can hold, according to the Pauli Exclusion Principle?",
        options: ["1", "2", "6", "10"],
        answer: "2"
    },
    {
        question: "Hund's rule states that for degenerate orbitals, electrons will:",
        options: ["Pair up immediately", "Occupy separate orbitals with parallel spins before pairing", "Occupy separate orbitals with opposite spins before pairing", "Only occupy one orbital per subshell"],
        answer: "Occupy separate orbitals with parallel spins before pairing"
    },
    {
        question: "What is the correct electronic configuration for a neutral Copper atom (Cu, Z=29)?",
        options: ["[Ar] 4s² 3d⁹", "[Ar] 4s¹ 3d¹⁰", "[Ar] 4s⁰ 3d¹¹", "[Ar] 3d⁹ 4s²"],
        answer: "[Ar] 4s¹ 3d¹⁰"
    },
    {
        question: "What is the correct electronic configuration for the Fe²⁺ ion? (Fe, Z=26)",
        options: ["[Ar] 4s² 3d⁴", "[Ar] 4s⁰ 3d⁶", "[Ar] 4s¹ 3d⁵", "[Ar] 3d⁵"],
        answer: "[Ar] 4s⁰ 3d⁶"
    },
    {
        question: "The concept that half-filled and completely-filled subshells have extra stability explains the anomalous configuration of:",
        options: ["Sodium and Chlorine", "Chromium and Copper", "Helium and Neon", "Iron and Cobalt"],
        answer: "Chromium and Copper"
    },
    // Mixed Concept Questions
    {
        question: "An ion that is smaller than its parent atom and is formed through an endothermic process is a(n):",
        options: ["Anion", "Cation", "Isotope", "Molecule"],
        answer: "Cation"
    },
    {
        question: "Calculate the number of moles in 32 grams of Methane (CH₄). (Atomic masses: C=12, H=1)",
        options: ["1 mole", "2 moles", "0.5 moles", "4 moles"],
        answer: "2 moles"
    },
    {
        question: "The Balmer series corresponds to electron transitions ending at n=2. These transitions primarily emit light in what region of the spectrum?",
        options: ["Ultraviolet", "Infrared", "Visible", "X-ray"],
        answer: "Visible"
    },
    {
        question: "An orbital with n=4 and l=1 is designated as:",
        options: ["4s", "4p", "4d", "4f"],
        answer: "4p"
    },
    {
        question: "Which principle or rule dictates the filling order of orbitals using the (n+l) value?",
        options: ["Hund's Rule", "Pauli Exclusion Principle", "Aufbau Principle", "Bohr's Postulates"],
        answer: "Aufbau Principle"
    },
    {
        question: "The discovery of the neutron is credited to:",
        options: ["J.J. Thomson", "Ernest Rutherford", "Eugene Goldstein", "James Chadwick"],
        answer: "James Chadwick"
    },
    {
        question: "Which of the following describes a nodal plane?",
        options: ["A region of maximum electron probability.", "A region where the probability of finding an electron is exactly zero.", "The path an electron takes around the nucleus.", "The boundary surface of an orbital."],
        answer: "A region where the probability of finding an electron is exactly zero."
    },
    {
        question: "How many p-orbitals exist in a given energy level (for n > 1)?",
        options: ["1", "3", "5", "7"],
        answer: "3"
    },
    {
        question: "The percentage yield is calculated as:",
        options: ["(Theoretical Yield / Actual Yield) x 100", "(Actual Yield / Theoretical Yield) x 100", "Theoretical Yield - Actual Yield", "Actual Yield + Theoretical Yield"],
        answer: "(Actual Yield / Theoretical Yield) x 100"
    },
    {
        question: "The spin quantum number (m_s) can have which of the following values?",
        options: ["0 and 1", "-1, 0, +1", "Only +1/2", "+1/2 and -1/2"],
        answer: "+1/2 and -1/2"
    },
    {
        question: "Which subatomic particle has a positive charge and a mass of approximately 1 amu?",
        options: ["Electron", "Positron", "Proton", "Neutron"],
        answer: "Proton"
    },
    {
        question: "The Paschen series in the hydrogen spectrum involves electron transitions that end at which principal quantum number?",
        options: ["n=1", "n=2", "n=3", "n=4"],
        answer: "n=3"
    },
    {
        question: "Which orbital shape is described as 'cloverleaf'?",
        options: ["s-orbital", "p-orbital", "d-orbital", "f-orbital"],
        answer: "d-orbital"
    },
    {
        question: "When forming a cation from a main group element, electrons are removed from the:",
        options: ["Innermost shell", "Outermost shell", "d-subshell only", "s-subshell only"],
        answer: "Outermost shell"
    },
    {
        question: "Which of the following is an example of a molecular ion?",
        options: ["Na⁺", "Cl⁻", "CH₄⁺", "He"],
        answer: "CH₄⁺"
    },
    {
        question: "How many neutrons are in the isotope Bromine-81 (³⁵Br⁸¹)?",
        options: ["35", "81", "46", "116"],
        answer: "46"
    },
    {
        question: "The mass of an atom is concentrated almost entirely in its:",
        options: ["Electron cloud", "Outermost shell", "Nucleus", "Orbitals"],
        answer: "Nucleus"
    },
    {
        question: "Planck's theory states that energy is emitted or absorbed in discrete packets called:",
        options: ["Electrons", "Protons", "Quanta", "Orbits"],
        answer: "Quanta"
    },
    {
        question: "The angular momentum of an electron in a Bohr orbit is an integral multiple of:",
        options: ["h", "h / 2π", "2π / h", "h²"],
        answer: "h / 2π"
    },
    {
        question: "The f-subshell (l=3) first appears in which principal energy level?",
        options: ["n=2", "n=3", "n=4", "n=5"],
        answer: "n=4"
    },
    {
        question: "How many unpaired electrons are in a neutral nitrogen atom (Z=7)?",
        options: ["0", "1", "2", "3"],
        answer: "3"
    },
    {
        question: "A positive ion produced from hydrogen gas (H₂) is simply a(n):",
        options: ["Electron", "Neutron", "Hydride ion", "Proton"],
        answer: "Proton"
    },
    {
        question: "Which of the following is NOT a property of positive rays?",
        options: ["They carry a positive charge.", "They are deflected by electric fields.", "They have a constant e/m ratio.", "Their penetration power is very low."],
        answer: "They have a constant e/m ratio."
    },
    {
        question: "A compound contains 63.63% Nitrogen and 36.36% Oxygen. What is its empirical formula? (Atomic masses: N=14, O=16)",
        options: ["NO", "NO₂", "N₂O", "N₂O₅"],
        answer: "N₂O"
    },
    {
        question: "The formula: Molecular Formula = n × (Empirical Formula) is known as:",
        options: ["The Ratio Formula", "The Linking Formula", "The Molar Formula", "Avogadro's Law"],
        answer: "The Linking Formula"
    },
    {
        question: "In the mass-mass calculation steps for stoichiometry, what is the first step?",
        options: ["Convert moles of reactant to mass.", "Use the mole ratio from the balanced equation.", "Convert the given mass of a substance to moles.", "Calculate the percentage yield."],
        answer: "Convert the given mass of a substance to moles."
    },
    {
        question: "The 'm' in the e/m ratio for a canal ray refers to the mass of:",
        options: ["A single electron", "A single proton", "The ion of the gas in the tube", "The cathode material"],
        answer: "The ion of the gas in the tube"
    },
    {
        question: "Which orbital is filled after the 3p orbital, according to the Aufbau principle?",
        options: ["3d", "4s", "4p", "3s"],
        answer: "4s"
    },
    {
        question: "A set of orbitals with the same energy level (e.g., the three p-orbitals) are called:",
        options: ["Isotopes", "Degenerate orbitals", "Valence orbitals", "Core orbitals"],
        answer: "Degenerate orbitals"
    },
    {
        question: "The defining characteristic of an element is its:",
        options: ["Mass number", "Number of neutrons", "Atomic number (number of protons)", "Number of isotopes"],
        answer: "Atomic number (number of protons)"
    },
    {
        question: "In which list are all elements mono-isotopic?",
        options: ["Gold, Carbon, Sodium", "Fluorine, Iodine, Arsenic", "Oxygen, Nitrogen, Fluorine", "Sodium, Chlorine, Gold"],
        answer: "Fluorine, Iodine, Arsenic"
    },
    {
        question: "A compound has an empirical formula of N₂O. This represents the:",
        options: ["Actual number of atoms in the molecule.", "Simplest whole-number ratio of atoms.", "Total mass of the compound.", "Number of covalent bonds."],
        answer: "Simplest whole-number ratio of atoms."
    },
    {
        question: "The concept that 'orbits are not equally spaced' is a key conclusion from which aspect of Bohr's model?",
        options: ["The energy formula (E_n ∝ 1/n²)", "The radius formula (r_n ∝ n²)", "The quantization of angular momentum", "The stability of stationary states"],
        answer: "The radius formula (r_n ∝ n²)"
    },
    {
        question: "What is the maximum number of electrons that can be accommodated in a shell with principal quantum number n=3?",
        options: ["2", "8", "18", "32"],
        answer: "18"
    },
    {
        question: "Which of the following orbitals does not exist?",
        options: ["1s", "3d", "2d", "4f"],
        answer: "2d"
    },
    {
        question: "The probability of finding an electron is uniform in all directions for which type of orbital?",
        options: ["p-orbital", "s-orbital", "d-orbital", "f-orbital"],
        answer: "s-orbital"
    },
    {
        question: "What is the total number of covalent bonds in one molecule of methane (CH₄)?",
        options: ["1", "2", "3", "4"],
        answer: "4"
    },
    {
        question: "If 10g of methane (molar mass = 16 g/mol) are used, how many molecules of methane are present? (N_A = 6.022 x 10²³)",
        options: ["3.76 x 10²³", "6.022 x 10²³", "1.6 x 10²⁴", "0.625"],
        answer: "3.76 x 10²³"
    },
    {
        question: "The modern quantum-mechanical model describes an electron's location in terms of:",
        options: ["A fixed circular path", "A region of high probability (orbital)", "An elliptical orbit", "A planetary model"],
        answer: "A region of high probability (orbital)"
    },
    {
        question: "For the p-subshell (l=1), the magnetic quantum number (m_l) can have values of -1, 0, and +1. This indicates that there are:",
        options: ["Three p-orbitals with different shapes", "Three p-orbitals with different sizes", "Three p-orbitals with different orientations", "One p-orbital that can hold three electrons"],
        answer: "Three p-orbitals with different orientations"
    },
    {
        question: "An element has the electron configuration [Ar] 4s² 3d⁵. This element is:",
        options: ["Chromium (Cr)", "Manganese (Mn)", "Iron (Fe)", "Vanadium (V)"],
        answer: "Manganese (Mn)"
    },
    {
        question: "A 'last-in, first-out' logic for removing electrons during ionization is a common fallacy for which group of elements?",
        options: ["Alkali metals", "Halogens", "Noble gases", "Transition metals"],
        answer: "Transition metals"
    },
    {
        question: "The chemical properties of isotopes of an element are nearly identical because they have the same:",
        options: ["Mass number", "Number of neutrons", "Number of electrons and protons", "Physical properties"],
        answer: "Number of electrons and protons"
    },
    {
        question: "What is the correct calculation for the number of moles (n) from a given number of particles (N)?",
        options: ["n = N × N_A", "n = N_A / N", "n = N / N_A", "n = N + N_A"],
        answer: "n = N / N_A"
    },
    {
        question: "The phenomenon where spectral lines split in a magnetic field is known as the:",
        options: ["Photoelectric effect", "Compton effect", "Zeeman effect", "Aufbau principle"],
        answer: "Zeeman effect"
    },
    {
        question: "How many nodal planes does a p_x orbital have?",
        options: ["0", "1", "2", "3"],
        answer: "1"
    },
    {
        question: "The formation of poly-negative ions (like O²⁻ from O⁻) is an endothermic process due to:",
        options: ["Increased nuclear charge", "Repulsion between the negative ion and the incoming electron", "The small size of the atom", "The high ionization energy"],
        answer: "Repulsion between the negative ion and the incoming electron"
    },
    {
        question: "Which of these represents a set of isoelectronic species (having the same number of electrons)?",
        options: ["Na⁺, Mg²⁺, F⁻", "Li, Be, B", "Cl⁻, Br⁻, I⁻", "Fe²⁺, Fe³⁺, Co²⁺"],
        answer: "Na⁺, Mg²⁺, F⁻"
    },
    {
        question: "Which of the following is the 'cardinal rule' for ionizing transition metals?",
        options: ["Remove electrons from the d-orbital first.", "Remove electrons from the highest principal quantum number (n) shell first.", "Remove electrons in the reverse order of filling.", "Remove one electron from s and one from d."],
        answer: "Remove electrons from the highest principal quantum number (n) shell first."
    },
    {
        question: "The Brackett series in the hydrogen spectrum, found in the infrared region, corresponds to transitions ending at:",
        options: ["n=2", "n=3", "n=4", "n=5"],
        answer: "n=4"
    },
    {
        question: "The quantum number 'l' determines the shape of the orbital. What is the letter designation for l=3?",
        options: ["s", "p", "d", "f"],
        answer: "f"
    },
    {
        question: "The energy of a photon is directly proportional to its:",
        options: ["Wavelength", "Velocity", "Frequency", "Amplitude"],
        answer: "Frequency"
    },
    {
        question: "Which of the d-orbitals have their lobes oriented *along* the coordinate axes?",
        options: ["d(xy), d(yz), d(xz)", "d(x²-y²), d(z²)", "All five d-orbitals", "Only the d(xy) orbital"],
        answer: "d(x²-y²), d(z²)"
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
    questionCountInfo.textContent = `Total MCQs available: 91`;
}

/**
 * Adds all necessary event listeners.
 */
function addEventListeners() {
    startBtn.addEventListener('click', handleStartTest);
    optionsList.addEventListener('click', handleOptionSelect);
    nextBtn.addEventListener('click', handleNextQuestion);
    retakeFullBtn.addEventListener('click', () => handleRetake(false));
    retakeWrongBtn.addEventListener('click', () => handleRetake(true));
    document.addEventListener('keydown', handleKeyPress);
}

/**
 * Validates inputs and starts the test.
 */
function handleStartTest() {
    errorMessage.textContent = '';
    
    // Validate number of questions to attempt
    let numToAttempt = parseInt(numQuestionsInput.value, 10);
    if (isNaN(numToAttempt) || numToAttempt <= 0) {
        numToAttempt = 1;
        numQuestionsInput.value = '1';
    }
    // FIX: Use `allQuestions` for validation and messaging.
    if (numToAttempt > allQuestions.length) {
        numToAttempt = allQuestions.length;
        numQuestionsInput.value = String(allQuestions.length);
        errorMessage.textContent = `Max questions available is ${allQuestions.length}. Capped automatically.`;
    }

    // Setup and start the quiz
    // FIX: Use `allQuestions` to source the quiz questions.
    originalTestQuestions = shuffleArray([...allQuestions]).slice(0, numToAttempt);
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

    const progressPercentage = ((currentQuestionIndex + 1) / currentTestQuestions.length) * 100;
    progressBarInner.style.width = `${progressPercentage}%`;

    const currentQuestion = currentTestQuestions[currentQuestionIndex];
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentTestQuestions.length}`;
    questionText.textContent = currentQuestion.question;

    optionsList.innerHTML = '';
    // Shuffle options for variety
    const shuffledOptions = shuffleArray([...currentQuestion.options]);
    shuffledOptions.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.dataset.option = option;
        optionsList.appendChild(li);
    });

    nextBtn.classList.add('hidden');
}

/**
 * Handles the user selecting an option.
 */
function handleOptionSelect(e) {
    const target = e.target;
    if (target.tagName !== 'LI' || target.classList.contains('disabled')) return;

    const selectedOption = target.dataset.option;
    const correctAnswer = currentTestQuestions[currentQuestionIndex].answer;

    // Disable all options
    Array.from(optionsList.children).forEach(child => {
        const li = child;
        li.classList.add('disabled');
        if (li.dataset.option === correctAnswer) {
            li.classList.add('correct');
        }
    });

    if (selectedOption === correctAnswer) {
        score++;
    } else {
        target.classList.add('incorrect');
        wrongAnswers.push(currentTestQuestions[currentQuestionIndex]);
    }
    
    nextBtn.classList.remove('hidden');
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
    timerText.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function endTest() {
    clearInterval(timer);
    displayResults();
    switchView(resultContainer);
}

function displayResults() {
    const total = currentTestQuestions.length;
    const percentage = total > 0 ? (score / total * 100).toFixed(1) : 0;
    scoreSummary.innerHTML = `
        <span>Correct: <strong>${score}</strong></span>
        <span>Wrong: <strong>${total - score}</strong></span>
        <span>Score: <strong>${percentage}%</strong></span>
    `;

    if (wrongAnswers.length > 0) {
        wrongQuestionsContainer.classList.remove('hidden');
        retakeWrongBtn.classList.remove('hidden');
        wrongQuestionsList.innerHTML = '';
        wrongAnswers.forEach(q => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="wrong-q-text">${q.question}</div>
                <div class="wrong-q-answer">Correct Answer: ${q.answer}</div>
            `;
            wrongQuestionsList.appendChild(li);
        });
    } else {
        wrongQuestionsContainer.classList.add('hidden');
        retakeWrongBtn.classList.add('hidden');
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
    if (!quizContainer.classList.contains('active')) return;

    if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const optionIndex = parseInt(e.key, 10) - 1;
        const optionElements = optionsList.querySelectorAll('li');
        if (optionIndex < optionElements.length && !optionElements[optionIndex].classList.contains('disabled')) {
            optionElements[optionIndex].click();
        }
    }

    if (e.key === 'Enter' && !nextBtn.classList.contains('hidden')) {
        e.preventDefault();
        nextBtn.click();
    }
}

// --- UTILITY FUNCTIONS ---

function switchView(activeContainer) {
    [setupContainer, quizContainer, resultContainer].forEach(container => {
        container.classList.remove('active');
    });
    activeContainer.classList.add('active');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', init);