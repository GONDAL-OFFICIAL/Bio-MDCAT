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
const retakeWrongBtn = document.getElementById('retake-wrong-btn');
const externalLink = document.getElementById('external-link');


// --- STATE MANAGEMENT ---
const PRESET_QUESTIONS = [
    // Section 1.1: Core Concepts of Equilibrium
    {
        question: "What is the defining condition of a chemical equilibrium?",
        options: ["The concentrations of reactants and products are equal.", "The forward and reverse reaction rates are equal.", "All molecular motion has ceased.", "The limiting reactants are fully consumed."],
        answer: "The forward and reverse reaction rates are equal."
    },
    {
        question: "A system at dynamic equilibrium is characterized by:",
        options: ["Constant macroscopic properties.", "A genuinely static state at the molecular level.", "A reaction that has gone to completion.", "Zero reaction rate in both directions."],
        answer: "Constant macroscopic properties."
    },
    {
        question: "Which of the following is a necessary requirement for establishing chemical equilibrium?",
        options: ["The presence of a catalyst.", "The system must be open to the atmosphere.", "The system must be closed.", "The reaction must be irreversible."],
        answer: "The system must be closed."
    },
    // Section 1.2: Law of Mass Action and Equilibrium Constant
    {
        question: "The equilibrium constant, K_c, is dependent only on which factor?",
        options: ["Initial concentrations", "Pressure", "Presence of a catalyst", "Temperature"],
        answer: "Temperature"
    },
    {
        question: "If the value of the equilibrium constant K_c is much larger than 1 (K_c >> 1), what does this imply?",
        options: ["The equilibrium lies far to the left, favoring reactants.", "The reaction is very slow.", "The equilibrium lies far to the right, favoring products.", "The concentrations of reactants and products are nearly equal."],
        answer: "The equilibrium lies far to the right, favoring products."
    },
    {
        question: "For a gaseous reaction, when is the value of K_p equal to K_c?",
        options: ["When the reaction is endothermic.", "When the reaction is exothermic.", "When the change in the number of moles of gas (Δn) is zero.", "When the temperature is 298 K."],
        answer: "When the change in the number of moles of gas (Δn) is zero."
    },
    {
        question: "How does a catalyst affect a system at equilibrium?",
        options: ["It increases the value of K_c.", "It shifts the equilibrium to favor products.", "It increases the rates of both forward and reverse reactions equally.", "It decreases the activation energy of the forward reaction only."],
        answer: "It increases the rates of both forward and reverse reactions equally."
    },
    // Section 1.3: Le Chatelier's Principle
    {
        question: "Consider the exothermic reaction: N₂(g) + 3H₂(g) ⇌ 2NH₃(g). How will the equilibrium shift if the temperature is increased?",
        options: ["Shift to the right (favoring products)", "Shift to the left (favoring reactants)", "No change in equilibrium position", "The value of K_c will increase"],
        answer: "Shift to the left (favoring reactants)"
    },
    {
        question: "For the reaction PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), how will an increase in pressure affect the equilibrium?",
        options: ["Shift to the right", "Shift to the left", "No change", "It will increase the rate constant"],
        answer: "Shift to the left"
    },
    {
        question: "If the reaction quotient Q_c is less than K_c, the reaction must:",
        options: ["Proceed to the left to reach equilibrium.", "Proceed to the right to reach equilibrium.", "Already be at equilibrium.", "Stop completely."],
        answer: "Proceed to the right to reach equilibrium."
    },
    {
        question: "Which of the following stresses will change the value of the equilibrium constant, K_c?",
        options: ["Changing the concentration of a reactant.", "Changing the pressure of the system.", "Adding a catalyst.", "Changing the temperature."],
        answer: "Changing the temperature."
    },
    // Section 1.4: Aqueous Equilibria
    {
        question: "What is the Common Ion Effect?",
        options: ["The increase in solubility of a salt when a common ion is added.", "The decrease in the ionization of a weak electrolyte when a common ion is added.", "A solution that resists pH change.", "The product of ion concentrations in a saturated solution."],
        answer: "The decrease in the ionization of a weak electrolyte when a common ion is added."
    },
    {
        question: "A buffer solution is typically composed of:",
        options: ["A strong acid and a strong base.", "A weak acid and its conjugate base.", "A salt dissolved in water.", "Two different strong acids."],
        answer: "A weak acid and its conjugate base."
    },
    {
        question: "According to the Henderson-Hasselbalch equation, the pH of an acidic buffer is equal to the pK_a when:",
        options: ["The concentration of the weak acid is zero.", "The concentration of the conjugate base is zero.", "The concentrations of the weak acid and its conjugate base are equal.", "The solution is completely neutralized."],
        answer: "The concentrations of the weak acid and its conjugate base are equal."
    },
    {
        question: "The solubility product constant, K_sp, represents the equilibrium between:",
        options: ["A weak acid and its ions.", "A gas and its dissolved form.", "An undissolved solid and its dissociated ions in solution.", "Reactants and products in a reversible reaction."],
        answer: "An undissolved solid and its dissociated ions in solution."
    },
    // Section 2.1-2.2: Reaction Rates and Rate Law
    {
        question: "The rate of a chemical reaction is defined as:",
        options: ["The total time the reaction takes to complete.", "The change in concentration of a species per unit of time.", "The energy released during the reaction.", "The point at which equilibrium is reached."],
        answer: "The change in concentration of a species per unit of time."
    },
    {
        question: "In the rate law, Rate = k[A]ˣ[B]ʸ, the exponents x and y are known as:",
        options: ["Stoichiometric coefficients", "Rate constants", "Orders of reaction", "Activation energies"],
        answer: "Orders of reaction"
    },
    {
        question: "How are the orders of reaction (x and y in the rate law) determined?",
        options: ["From the stoichiometric coefficients of the balanced equation.", "By measuring the temperature change.", "Experimentally.", "By calculating the equilibrium constant."],
        answer: "Experimentally."
    },
    {
        question: "What are the units of the rate constant 'k' for a second-order reaction?",
        options: ["s⁻¹", "mol⋅dm⁻³⋅s⁻¹", "dm³⋅mol⁻¹⋅s⁻¹", "dm⁶⋅mol⁻²⋅s⁻¹"],
        answer: "dm³⋅mol⁻¹⋅s⁻¹"
    },
    {
        question: "If doubling the concentration of reactant [A] quadruples the reaction rate, the reaction is what order with respect to A?",
        options: ["Zero order", "First order", "Second order", "Third order"],
        answer: "Second order"
    },
    // Section 2.3: Integrated Rate Laws and Half-Life
    {
        question: "The half-life of a first-order reaction is:",
        options: ["Directly proportional to the initial concentration.", "Inversely proportional to the initial concentration.", "Independent of the initial concentration.", "Equal to the rate constant."],
        answer: "Independent of the initial concentration."
    },
    {
        question: "For a certain reaction, the half-life is observed to decrease as the initial concentration is increased. What is the order of the reaction?",
        options: ["Zero order", "First order", "Second order", "Cannot be determined"],
        answer: "Second order"
    },
    {
        question: "If a reaction is 50% complete in 100 seconds and 75% complete in 200 seconds, what is the order of the reaction?",
        options: ["Zero order", "First order", "Second order", "Third order"],
        answer: "First order"
    },
    {
        question: "Which plot gives a straight line for a zero-order reaction?",
        options: ["[A] vs. t", "ln[A] vs. t", "1/[A] vs. t", "log(k) vs. 1/T"],
        answer: "[A] vs. t"
    },
    // Section 2.4: Collision Theory and Activation Energy
    {
        question: "According to collision theory, what two conditions must be met for a collision to be effective?",
        options: ["Sufficient energy and high pressure.", "Sufficient energy and correct orientation.", "High concentration and high temperature.", "Correct orientation and the presence of a catalyst."],
        answer: "Sufficient energy and correct orientation."
    },
    {
        question: "What is the activation energy (E_a) of a reaction?",
        options: ["The total energy released by the reaction.", "The minimum energy required for reactants to turn into products.", "The energy difference between products and reactants.", "The average kinetic energy of the molecules."],
        answer: "The minimum energy required for reactants to turn into products."
    },
    {
        question: "How does an increase in temperature always affect the reaction rate and rate constant (k)?",
        options: ["It decreases the rate and k.", "It increases the rate and k.", "It increases the rate but decreases k.", "It has no effect on the rate or k."],
        answer: "It increases the rate and k."
    },
    {
        question: "The Arrhenius equation describes the relationship between:",
        options: ["Rate constant, temperature, and activation energy.", "Equilibrium constant and pressure.", "Concentration and time.", "Half-life and reaction order."],
        answer: "Rate constant, temperature, and activation energy."
    },
    {
        question: "On a potential energy diagram, the peak of the energy barrier represents the:",
        options: ["Reactants", "Products", "Enthalpy change (ΔH)", "Activated complex (transition state)"],
        answer: "Activated complex (transition state)"
    },
    {
        question: "For an endothermic reaction, which statement is true?",
        options: ["The products have lower potential energy than the reactants.", "The activation energy of the forward reaction is less than the reverse reaction.", "The enthalpy change (ΔH) is positive.", "The reaction releases heat to the surroundings."],
        answer: "The enthalpy change (ΔH) is positive."
    },
     // More Mixed/Applied Questions
    {
        question: "For the reaction 2A(g) ⇌ B(g) + C(g), what is the correct expression for the equilibrium constant K_c?",
        options: ["[B][C] / [A]", "[B][C] / [A]²", "[A]² / [B][C]", "[A] / [B][C]"],
        answer: "[B][C] / [A]²"
    },
    {
        question: "If you add more of reactant A to an equilibrium mixture, the reaction will shift to the right to consume the added A. This is an application of:",
        options: ["The Law of Mass Action", "The Arrhenius Equation", "Le Chatelier's Principle", "The Henderson-Hasselbalch Equation"],
        answer: "Le Chatelier's Principle"
    },
    {
        question: "A buffer works by consuming added strong acid with its ____ component and added strong base with its ____ component.",
        options: ["acidic, basic", "basic, acidic", "acidic, acidic", "basic, basic"],
        answer: "basic, acidic"
    },
    {
        question: "The 'instantaneous rate' of a reaction at a specific time is determined by:",
        options: ["The overall change in concentration divided by total time.", "The rate at the very beginning of the reaction.", "The slope of the tangent to the concentration-time curve at that time.", "Averaging the rates at the beginning and end."],
        answer: "The slope of the tangent to the concentration-time curve at that time."
    },
    {
        question: "The discrepancy between stoichiometric coefficients and experimentally determined reaction orders is evidence that:",
        options: ["The reaction is at equilibrium.", "The reaction occurs through a multi-step mechanism.", "The temperature is too low.", "The law of mass action is incorrect."],
        answer: "The reaction occurs through a multi-step mechanism."
    },
    {
        question: "The overall order of the reaction with the rate law: Rate = k[X][Y]² is:",
        options: ["1", "2", "3", "4"],
        answer: "3"
    },
    {
        question: "In an 'ICE' table used for equilibrium problems, what does 'C' stand for?",
        options: ["Concentration", "Constant", "Catalyst", "Change"],
        answer: "Change"
    },
    {
        question: "A reaction with a very high activation energy will likely be:",
        options: ["Very fast at room temperature.", "Very slow at room temperature.", "Spontaneous regardless of temperature.", "Strongly exothermic."],
        answer: "Very slow at room temperature."
    },
    {
        question: "What is the relationship between the enthalpy change (ΔH) and the activation energies of the forward (Ea,fwd) and reverse (Ea,rev) reactions?",
        options: ["ΔH = Ea,fwd + Ea,rev", "ΔH = Ea,fwd / Ea,rev", "ΔH = Ea,fwd - Ea,rev", "ΔH = Ea,rev - Ea,fwd"],
        answer: "ΔH = Ea,fwd - Ea,rev"
    },
    {
        question: "What is the pH of a solution where the concentration of H+ is 1.0 x 10⁻⁴ M?",
        options: ["10", "4", "-4", "1"],
        answer: "4"
    },
    {
        question: "Which factor does NOT influence the rate of a reaction?",
        options: ["Temperature", "Concentration of reactants", "The equilibrium constant (K_c)", "Presence of a catalyst"],
        answer: "The equilibrium constant (K_c)"
    },
    {
        question: "For a zero-order reaction, the rate is:",
        options: ["Directly proportional to the concentration.", "Directly proportional to the square of the concentration.", "Independent of the concentration.", "Inversely proportional to the concentration."],
        answer: "Independent of the concentration."
    },
    {
        question: "If the forward reaction is endothermic, how will decreasing the temperature affect the equilibrium?",
        options: ["Shift right", "Shift left", "No effect", "Increase K_c"],
        answer: "Shift left"
    },
    {
        question: "The rate-determining step in a reaction mechanism is always the:",
        options: ["First step", "Last step", "Fastest step", "Slowest step"],
        answer: "Slowest step"
    },
    {
        question: "What is the conjugate base of the weak acid H₂CO₃?",
        options: ["CO₃²⁻", "HCO₃⁻", "H₃CO₃⁺", "OH⁻"],
        answer: "HCO₃⁻"
    },
    {
        question: "The rate law provides a 'window' into the reaction mechanism because it reflects the composition of the:",
        options: ["Overall balanced reaction", "Final products", "Rate-determining step", "Initial reactants"],
        answer: "Rate-determining step"
    },
    {
        question: "If K_c for the reaction A + B ⇌ C is 4.0, what is K_c for the reaction C ⇌ A + B?",
        options: ["4.0", "2.0", "0.25", "-4.0"],
        answer: "0.25"
    },
    {
        question: "Adding an inert gas (like Argon) to a gaseous equilibrium at constant volume will:",
        options: ["Shift the equilibrium to the right", "Shift the equilibrium to the left", "Increase the total pressure but not shift the equilibrium", "Decrease the total pressure and shift the equilibrium"],
        answer: "Increase the total pressure but not shift the equilibrium"
    },
    {
        question: "The half-life of a zero-order reaction is:",
        options: ["Independent of initial concentration", "Directly proportional to initial concentration", "Inversely proportional to initial concentration", "Equal to 0.693/k"],
        answer: "Directly proportional to initial concentration"
    },
    {
        question: "A high activation energy corresponds to a ____ rate constant (k), and a ____ reaction rate.",
        options: ["large, fast", "small, slow", "small, fast", "large, slow"],
        answer: "small, slow"
    },
    {
        question: "For a reaction to occur, the pre-exponential factor 'A' in the Arrhenius equation relates to the frequency and ____ of collisions.",
        options: ["energy", "orientation", "temperature", "pressure"],
        answer: "orientation"
    },
    {
        question: "In the expression K_p = K_c(RT)Δⁿ, what does 'R' represent?",
        options: ["The reaction rate", "The universal gas constant", "The reactant concentration", "The reaction quotient"],
        answer: "The universal gas constant"
    },
    {
        question: "If a strong base like NaOH is added to an acetic acid buffer (CH₃COOH/CH₃COO⁻), which component will react with it?",
        options: ["The acetate ion (CH₃COO⁻)", "The acetic acid (CH₃COOH)", "The sodium ion (Na⁺)", "Water (H₂O)"],
        answer: "The acetic acid (CH₃COOH)"
    },
    {
        question: "The study of reaction rates and mechanisms is called:",
        options: ["Thermodynamics", "Stoichiometry", "Reaction Kinetics", "Chemical Equilibrium"],
        answer: "Reaction Kinetics"
    },
    {
        question: "What is the overall reaction order for Rate = k?",
        options: ["Zero order", "First order", "Second order", "Cannot be determined"],
        answer: "Zero order"
    },
    {
        question: "The value of K_sp for AgCl is 1.8 x 10⁻¹⁰. This small value indicates that AgCl is:",
        options: ["Highly soluble in water", "Slightly soluble in water", "A strong electrolyte", "A gas at room temperature"],
        answer: "Slightly soluble in water"
    },
    {
        question: "If a reaction is exothermic, what is the sign of its enthalpy change (ΔH)?",
        options: ["Positive", "Negative", "Zero", "Depends on temperature"],
        answer: "Negative"
    },
    {
        question: "If doubling the concentration of a reactant has no effect on the reaction rate, the reaction is what order with respect to that reactant?",
        options: ["Zero order", "First order", "Second order", "Negative order"],
        answer: "Zero order"
    },
    {
        question: "The state where a reaction appears to have stopped macroscopically but is still occurring at the molecular level is called:",
        options: ["Static equilibrium", "The transition state", "Dynamic equilibrium", "The rate-determining step"],
        answer: "Dynamic equilibrium"
    },
    {
        question: "Which of the following describes the 'active mass' of a substance as defined by the Law of Mass Action?",
        options: ["Total mass in grams", "Molar concentration", "Density", "Partial pressure"],
        answer: "Molar concentration"
    },
    {
        question: "In the reaction H₂(g) + I₂(g) ⇌ 2HI(g), how does the equilibrium shift when the volume is decreased (pressure is increased)?",
        options: ["Shifts left", "Shifts right", "No shift", "Reaction stops"],
        answer: "No shift"
    },
    {
        question: "What is the conjugate acid of the weak base ammonia (NH₃)?",
        options: ["NH₂⁻", "NH₄⁺", "H₃O⁺", "N₂H₄"],
        answer: "NH₄⁺"
    },
    {
        question: "Integrated rate laws relate which two variables?",
        options: ["Rate and concentration", "Concentration and time", "Rate and temperature", "Rate constant and activation energy"],
        answer: "Concentration and time"
    },
    {
        question: "If a reaction has a negative ΔH, increasing the temperature will cause the equilibrium constant K_c to:",
        options: ["Increase", "Decrease", "Remain constant", "Become negative"],
        answer: "Decrease"
    },
    {
        question: "Which of the following can be monitored to measure the rate of a reaction?",
        options: ["Change in color", "Change in pressure", "Change in concentration via titration", "All of the above"],
        answer: "All of the above"
    },
    {
        question: "In a plot of ln[A] vs. time for a first-order reaction, the slope of the line is equal to:",
        options: ["k", "-k", "E_a", "t₁/₂"],
        answer: "-k"
    },
    {
        question: "If K_c is approximately equal to 1, the equilibrium mixture consists of:",
        options: ["Mostly products", "Mostly reactants", "Comparable amounts of reactants and products", "Only reactants"],
        answer: "Comparable amounts of reactants and products"
    },
    {
        question: "For the exothermic reaction A ⇌ B, which has a higher activation energy?",
        options: ["The forward reaction (A → B)", "The reverse reaction (B → A)", "Both are equal", "Cannot be determined"],
        answer: "The reverse reaction (B → A)"
    },
    {
        question: "If you remove a product from an equilibrium system, the reaction will:",
        options: ["Shift left to produce more reactants", "Shift right to produce more product", "Stop", "Be unaffected"],
        answer: "Shift right to produce more product"
    },
    {
        question: "The rate law for a reaction is found to be Rate = k[A]. What happens to the rate if [A] is tripled?",
        options: ["It triples", "It is 1/3 of the original rate", "It increases by a factor of 9", "It does not change"],
        answer: "It triples"
    },
    {
        question: "Which type of reaction has a constant half-life?",
        options: ["Zero-order", "First-order", "Second-order", "All of the above"],
        answer: "First-order"
    },
    {
        question: "A solution that resists drastic changes in pH is known as a:",
        options: ["Neutral solution", "Saturated solution", "Buffer solution", "Standard solution"],
        answer: "Buffer solution"
    },
    {
        question: "If a reaction is endothermic (ΔH > 0), what does a potential energy diagram look like?",
        options: ["Products are at a lower energy level than reactants.", "Products are at a higher energy level than reactants.", "Reactants and products are at the same energy level.", "There is no activation energy barrier."],
        answer: "Products are at a higher energy level than reactants."
    },
    {
        question: "The expression for the reaction quotient, Q_c, is identical to K_c, but it is calculated using concentrations that are:",
        options: ["Only at equilibrium", "Not necessarily at equilibrium", "Only for the initial conditions", "Only for gases"],
        answer: "Not necessarily at equilibrium"
    },
    {
        question: "If a reaction is first order in A and second order in B, what is the overall reaction order?",
        options: ["First", "Second", "Third", "Fourth"],
        answer: "Third"
    },
    {
        question: "Adding a soluble salt containing a common ion to a solution of a slightly soluble salt will:",
        options: ["Increase its solubility", "Decrease its solubility", "Have no effect on its solubility", "Change its color"],
        answer: "Decrease its solubility"
    },
    // --- NEW NUMERICAL PROBLEMS ---
    {
        question: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), at equilibrium in a 2.0 L container, you have 0.50 mol of N₂, 1.50 mol of H₂, and 0.20 mol of NH₃. What is K_c?",
        options: ["0.095", "10.5", "0.237", "1.50"],
        answer: "0.095"
    },
    {
        question: "A first-order reaction has a half-life of 30 minutes. What percentage of the reactant will remain after 90 minutes?",
        options: ["50%", "25%", "12.5%", "6.25%"],
        answer: "12.5%"
    },
    {
        question: "The half-life of a first-order reaction is 69.3 s. What is the value of the rate constant (k)? (k = 0.693 / t₁/₂)",
        options: ["1.0 s⁻¹", "0.1 s⁻¹", "0.01 s⁻¹", "10.0 s⁻¹"],
        answer: "0.01 s⁻¹"
    },
    {
        question: "A reaction starts with 0.50 M of A. For the reaction A ⇌ 2B, the equilibrium concentration of B is 0.40 M. What is the equilibrium concentration of A?",
        options: ["0.10 M", "0.20 M", "0.30 M", "0.50 M"],
        answer: "0.30 M"
    },
    {
        question: "For the reaction 2SO₂(g) + O₂(g) ⇌ 2SO₃(g) at 500 K, what is the relationship between Kp and Kc?",
        options: ["Kp = Kc", "Kp = Kc(RT)", "Kp = Kc(RT)⁻¹", "Kp = Kc(RT)²"],
        answer: "Kp = Kc(RT)⁻¹"
    },
    {
        question: "Reaction X doubles its rate from 298K to 308K. Reaction Y triples its rate over the same temperature range. Which statement is correct?",
        options: ["Reaction X has a higher Ea than Y", "Reaction Y has a higher Ea than X", "Both have the same Ea", "Ea cannot be determined"],
        answer: "Reaction Y has a higher Ea than X"
    },
    {
        question: "A first-order reaction has a rate constant of 0.02 min⁻¹. How long will it take for the concentration to drop from 0.8 M to 0.1 M?",
        options: ["50 min", "75 min", "104 min", "208 min"],
        answer: "104 min"
    },
    {
        question: "What are the units for the rate constant of a third-order reaction?",
        options: ["s⁻¹", "dm³⋅mol⁻¹⋅s⁻¹", "dm⁶⋅mol⁻²⋅s⁻¹", "mol⋅dm⁻³⋅s⁻¹"],
        answer: "dm⁶⋅mol⁻²⋅s⁻¹"
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
    startBtn.addEventListener('click', handleStartTest);
    optionsList.addEventListener('click', handleOptionSelect);
    nextBtn.addEventListener('click', handleNextQuestion);
    retakeWrongBtn.addEventListener('click', () => handleRetake(true));
    document.addEventListener('keydown', handleKeyPress);
}

/**
 * Validates inputs and starts the test.
 */
function handleStartTest() {
    errorMessage.textContent = '';
    const numToAttempt = parseInt(numQuestionsInput.value, 10);

    if (isNaN(numToAttempt)) {
        errorMessage.textContent = 'Please enter a valid number.';
        return;
    }

    if (numToAttempt < 1) {
        errorMessage.textContent = 'You must attempt at least 1 question.';
        return;
    }

    if (numToAttempt > allQuestions.length) {
        errorMessage.textContent = `You can attempt a maximum of ${allQuestions.length} questions.`;
        return;
    }

    // Setup and start the quiz
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

    const progressPercentage = (currentQuestionIndex / currentTestQuestions.length) * 100;
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

    if (quizContainer.classList.contains('active')) {
        externalLink.classList.add('hidden');
    } else {
        externalLink.classList.remove('hidden');
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
document.addEventListener('DOMContentLoaded', init);
