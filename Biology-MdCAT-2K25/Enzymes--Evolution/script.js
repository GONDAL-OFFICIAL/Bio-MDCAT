document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const screens = {
    setup: document.getElementById("setup-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen"),
  };

  const homeBtn = document.getElementById("home-btn");
  const availableQuestionsCountSpan = document.getElementById(
    "available-questions-count"
  );
  const numQuestionsInput = document.getElementById("num-questions-input");
  const numQuestionsError = document.getElementById("num-questions-error");
  const startBtn = document.getElementById("start-btn");

  const progressCounter = document.getElementById("progress-counter");
  const progressBar = document.getElementById("progress-bar");
  const timerDisplay = document.getElementById("timer");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");
  const nextBtn = document.getElementById("next-btn");

  const correctCountSpan = document.getElementById("correct-count");
  const wrongCountSpan = document.getElementById("wrong-count");
  const percentageSpan = document.getElementById("percentage");
  const wrongQuestionsList = document.getElementById("wrong-questions-list");
  const retakeWrongBtn = document.getElementById("retake-wrong-btn");

  // --- State ---
  let allQuestions = [];
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let timerInterval;
  let wrongQuestionIndices = [];

  // --- Pre-defined Questions ---
  const defaultQuestions = [
    // Enzymes: Optimum pH
    {
      question:
        "What is the optimum pH for the enzyme Pepsin, which functions in the stomach?",
      options: ["2.0", "4.5", "6.8", "9.7"],
      correctAnswer: 0,
    },
    {
      question: "At which pH does the enzyme Sucrase function optimally?",
      options: ["2.0", "4.5", "7.6", "9.0"],
      correctAnswer: 1,
    },
    {
      question: "The optimum pH for Tyokinase is approximately:",
      options: ["2.0", "5.5", "7.6", "9.7"],
      correctAnswer: 1,
    },
    {
      question: "Salivary amylase, found in the mouth, works best at which pH?",
      options: ["2.0", "4.5", "6.8", "9.0"],
      correctAnswer: 2,
    },
    {
      question: "What is the optimum pH for Catalase?",
      options: ["4.5", "5.5", "7.6", "9.7"],
      correctAnswer: 2,
    },
    {
      question: "Which enzyme has a broad optimum pH range of 7 to 9?",
      options: ["Pepsin", "Sucrase", "Chymotrypsin", "Arginase"],
      correctAnswer: 2,
    },
    {
      question: "Pancreatic lipase functions optimally at a pH of:",
      options: ["4.5", "6.8", "9.0", "9.7"],
      correctAnswer: 2,
    },
    {
      question:
        "Which of the following enzymes functions best in a highly alkaline environment, with an optimum pH of 9.7?",
      options: ["Pepsin", "Salivary amylase", "Catalase", "Arginase"],
      correctAnswer: 3,
    },

    // Enzymes: Models and Characteristics
    {
      question:
        "Which enzyme operates based on the induced-fit model of interaction?",
      options: ["Carbonic anhydrase", "Lactase", "Urease", "Maltase"],
      correctAnswer: 0,
    },
    {
      question:
        "Lactase, urease, and maltase are examples of enzymes that work on which model?",
      options: [
        "Induced-fit model",
        "Lock and key model",
        "Fluid mosaic model",
        "Transition state model",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "In the 'lock and key' model of enzyme action, what does the 'key' represent?",
      options: [
        "The substrate",
        "The active site",
        "The enzyme",
        "The product",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "According to the 'lock and key' model, the 'lock' represents the:",
      options: ["Substrate", "Enzyme", "Coenzyme", "Allosteric site"],
      correctAnswer: 0,
    },
    {
      question: "In a typical cell, which type of enzymes are more abundant?",
      options: [
        "Free cytoplasmic enzymes",
        "Membrane-bound enzymes",
        "Nuclear enzymes",
        "Lysosomal enzymes",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is a zymogen?",
      options: [
        "An active enzyme",
        "An inactive enzyme precursor",
        "A coenzyme",
        "A competitive inhibitor",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The specificity of an enzyme for its substrate is determined by the:",
      options: [
        "Allosteric site",
        "Active site",
        "Overall size of the enzyme",
        "pH of the environment",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What type of bonds typically form between an enzyme and its substrate at the active site?",
      options: [
        "Covalent bonds",
        "Ionic bonds",
        "Non-covalent bonds",
        "Metallic bonds",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "During an enzyme-catalyzed reaction, the substrate's energy is highest at the:",
      options: [
        "Initial state",
        "Transition state",
        "Final product state",
        "Enzyme-substrate complex",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The active site of a protein-based enzyme is primarily composed of:",
      options: [
        "The entire polypeptide chain",
        "A few R groups of amino acids",
        "Carbohydrate chains",
        "Lipid molecules",
      ],
      correctAnswer: 1,
    },
    {
      question: 'What does the "optimum temperature" for an enzyme refer to?',
      options: [
        "The highest temperature it can withstand before denaturing",
        "The temperature at which it works most efficiently",
        "The lowest temperature at which it can function",
        "The average temperature of its environment",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the primary role of enzymes in a biological reaction?",
      options: [
        "To increase the activation energy",
        "To lower the activation energy",
        "To be consumed in the reaction",
        "To change the final product",
      ],
      correctAnswer: 1,
    },
    {
      question: "By lowering the activation energy, enzymes effectively:",
      options: [
        "Increase the reaction temperature",
        "Change the reaction pathway",
        "Are used up in the process",
        "Make the reaction endothermic",
      ],
      correctAnswer: 1,
    },

    // Enzymes: Coenzymes, Inhibitors, and Sites
    {
      question:
        "The coenzyme FAD⁺ is an essential aid for which enzyme involved in the Krebs cycle?",
      options: ["Pepsin", "Catalase", "Succinate dehydrogenase", "Arginase"],
      correctAnswer: 2,
    },
    {
      question: "The coenzyme NAD⁺ is associated with which vitamin?",
      options: [
        "Vitamin C",
        "Vitamin B1 (Thiamine)",
        "Vitamin B3 (Niacin)",
        "Vitamin D",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Peptidyl transferase, a critical component of ribosomes, is unique because it is composed of:",
      options: ["Protein", "RNA (a ribozyme)", "Lipid", "Carbohydrate"],
      correctAnswer: 1,
    },
    {
      question:
        "In a highly acidic medium, what electrical charge do amino acids typically exhibit?",
      options: ["Negative", "Neutral", "Positive", "It varies randomly"],
      correctAnswer: 2,
    },
    {
      question: "When an amino acid is in an acidic solution, it acts as a:",
      options: ["Base", "Acid", "Neutral buffer", "Catalyst"],
      correctAnswer: 0,
    },
    {
      question: "What is an allosteric site on an enzyme?",
      options: [
        "The main active site",
        "A regulatory site other than the active site",
        "The site where the substrate binds",
        "The site that binds cofactors permanently",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Non-competitive inhibitors regulate enzyme activity by binding to the:",
      options: [
        "Active site",
        "Allosteric site",
        "Substrate itself",
        "Coenzyme",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Malonic acid, which structurally resembles succinate, is a classic example of what?",
      options: [
        "Non-competitive inhibitor",
        "Allosteric activator",
        "Competitive inhibitor",
        "Zymogen",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Feedback inhibition, where a pathway's end product inhibits an early enzyme, typically occurs via binding at the:",
      options: [
        "Active site",
        "Allosteric site",
        "Transition state complex",
        "Substrate",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which of the following enzymes is known to function without requiring a cofactor?",
      options: [
        "Succinate dehydrogenase",
        "DNA polymerase",
        "Pepsin",
        "Carbonic anhydrase",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Cyanide is a lethal poison because it stops aerobic respiration by inhibiting:",
      options: [
        "Salivary amylase",
        "Pepsin",
        "Cytochrome c oxidase",
        "Pancreatic lipase",
      ],
      correctAnswer: 2,
    },
    {
      question: "Cytochrome c is a key respiratory protein found in:",
      options: [
        "All living organisms",
        "Only anaerobic organisms",
        "All aerobic organisms",
        "Only in vertebrates",
      ],
      correctAnswer: 2,
    },

    // Evolution: Early Ideas & Foundations
    {
      question:
        'Which ancient philosopher proposed the "Scala Naturae," or Scale of Nature, arranging organisms from simple to complex?',
      options: ["Plato", "Darwin", "Lamarck", "Aristotle"],
      correctAnswer: 3,
    },
    {
      question:
        "What is the likely evolutionary outcome if two populations of a single species become reproductively isolated and do not interbreed?",
      options: [
        "They merge back into one population",
        "They gradually form two new species",
        "They immediately become extinct",
        "One population will consume the other",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The endosymbiotic theory suggests that prokaryotes transformed into eukaryotes through:",
      options: [
        "Competition",
        "Predation",
        "Symbiosis",
        "Spontaneous generation",
      ],
      correctAnswer: 2,
    },
    {
      question:
        'Who proposed the first major theory of evolution, known as the "inheritance of acquired characteristics"?',
      options: [
        "Charles Darwin",
        "Jean-Baptiste Lamarck",
        "Alfred Russel Wallace",
        "Georges Cuvier",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The concept of catastrophism, which posits that sudden disasters caused extinctions, was proposed by the founder of paleontology, ...",
      options: ["Lamarck", "Lyell", "Cuvier", "Darwin"],
      correctAnswer: 2,
    },
    {
      question:
        "Charles Lyell's principle of uniformitarianism, which influenced Darwin, stated that:",
      options: [
        "Earth's features were shaped by sudden catastrophes",
        "Geological changes occur gradually over immense periods",
        "Species are fixed and do not change",
        "Evolution happens in rapid bursts",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which thinker's 'Essay on the Principle of Population' influenced Darwin's ideas about competition and resource limitation?",
      options: ["Lyell", "Lamarck", "Malthus", "Mendel"],
      correctAnswer: 2,
    },
    {
      question:
        "Whose foundational work on the laws of heredity was later integrated with Darwin's theory to form the modern evolutionary synthesis?",
      options: ["Darwin", "Mendel", "Lamarck", "Cuvier"],
      correctAnswer: 1,
    },

    // Evolution: Darwin and Natural Selection
    {
      question:
        'In what year did Charles Darwin publish his revolutionary book, "On the Origin of Species"?',
      options: ["1831", "1859", "1871", "1900"],
      correctAnswer: 1,
    },
    {
      question:
        "Darwin's core concept that species evolve over time from common ancestors is known as:",
      options: [
        "Catastrophism",
        "Inheritance of acquired traits",
        "Descent with modification",
        "Uniformitarianism",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "According to Darwin, survival and reproduction within a population are:",
      options: [
        "Completely random",
        "Not random; they depend on favorable inherited traits",
        "Determined by chance events alone",
        "Guaranteed for all individuals",
      ],
      correctAnswer: 1,
    },
    {
      question: "Natural selection can only act on traits that are:",
      options: [
        "Acquired during an organism's life",
        "Heritable",
        "Beneficial in every possible environment",
        "Completely new mutations",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Allopatric speciation, a concept explained by Darwin, occurs when new species form as a result of:",
      options: [
        "Geographic separation",
        "Competition within a single habitat",
        "Random mutations",
        "Symbiotic relationships",
      ],
      correctAnswer: 0,
    },
    {
      question: "Darwin described the process of natural selection as:",
      options: [
        "Global and occurring in short, rare bursts",
        "Local, constant, and acting continuously",
        "An event of the past that no longer occurs",
        "Only active in very large populations",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "A cornerstone of Darwin's theory of natural selection is the observation that:",
      options: [
        "Organisms produce fewer offspring than the environment can support",
        "All offspring survive and reproduce equally",
        "Organisms tend to produce more offspring than can survive",
        "Environmental resources are unlimited",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The presence of vestigial organs, such as the pelvic bones in whales, is explained by:",
      options: [
        "Lamarckism",
        "Darwinism",
        "Catastrophism",
        "Spontaneous generation",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Darwin's study of Galápagos organisms was crucial. The fact they resembled species on the South American mainland suggested:",
      options: [
        "Convergent evolution",
        "A recent, separate creation event",
        "Common ancestry with mainland species",
        "That they were identical species",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Darwin's observations of finches on the Galápagos Islands revealed continuous variation in what trait?",
      options: ["Feather color", "Beak shape", "Song complexity", "Nest size"],
      correctAnswer: 1,
    },

    // Evolution: Genetic & Evolutionary Concepts
    {
      question: 'The term "gene pool" refers to:',
      options: [
        "The genes of a single individual",
        "All the alleles for all genes in a population",
        "Only the dominant alleles in a species",
        "The DNA within a cell nucleus",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Migration of individuals between populations can lead to a loss or gain of alleles, a process known as:",
      options: ["Genetic drift", "Gene flow", "Natural selection", "Mutation"],
      correctAnswer: 1,
    },
    {
      question:
        "What is the primary function of reproductive isolation in the process of speciation?",
      options: [
        "It encourages interbreeding between different species",
        "It prevents gene flow, allowing populations to diverge",
        "It increases the size of the gene pool",
        "It eliminates all genetic variation",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The modern evolutionary synthesis is a unification of the principles of Darwinian evolution and:",
      options: [
        "Lamarckian inheritance",
        "Mendelian genetics",
        "Cell theory",
        "Catastrophism",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "How are close evolutionary relationships between different species reflected at the molecular level?",
      options: [
        "They will have very different habitats",
        "They will have identical diets",
        "Their DNA and protein sequences will be very similar",
        "Their population sizes will be comparable",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The fossil Archaeopteryx is a famous transitional form because it possesses features of both reptiles and birds, such as:",
      options: [
        "Feathers and a beak",
        "Claws, teeth, and feathers",
        "Scales and live birth",
        "A shell and wings",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Haeckel's biogenetic law, summarized as 'ontogeny recapitulates phylogeny,' suggests that:",
      options: [
        "An organism's development reflects its species' evolutionary history",
        "Evolution only happens in embryos",
        "All species are related to reptiles",
        "Genetics does not influence development",
      ],
      correctAnswer: 0,
    },
    {
      question:
        "The presence of gill pouches and a tail in the early embryos of humans, chickens, and fish is strong evidence from which field?",
      options: [
        "Paleontology",
        "Molecular Biology",
        "Comparative Embryology",
        "Biogeography",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which of the following is NOT typically considered a geographical barrier that can lead to allopatric speciation?",
      options: [
        "A mountain range",
        "An ocean",
        "A large desert",
        "The atmosphere",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Carpenter's study of howling monkeys is an example of research into what type of adaptation?",
      options: [
        "Physiological adaptation",
        "Anatomical adaptation",
        "Behavioral adaptation",
        "Molecular adaptation",
      ],
      correctAnswer: 2,
    },
  ];

  // --- Functions ---

  const showScreen = (screenName) => {
    Object.values(screens).forEach((screen) =>
      screen.classList.remove("active")
    );
    screens[screenName].classList.add("active");
    homeBtn.style.display = screenName === "quiz" ? "none" : "block";
  };

  const updateSetupUI = () => {
    const totalQuestions = allQuestions.length;
    availableQuestionsCountSpan.textContent = totalQuestions;
    numQuestionsInput.max = totalQuestions;
    if (numQuestionsInput) {
      numQuestionsInput.value = totalQuestions;
    }
  };

  const loadQuestions = () => {
    // For simplicity in this environment, we'll just use the default questions.
    // In a real app, you might fetch from a server or use localStorage.
    allQuestions = defaultQuestions;
    updateSetupUI();
  };

  const startTest = () => {
    const num = parseInt(numQuestionsInput.value);
    numQuestionsError.textContent = "";

    if (isNaN(num) || num < 1 || num > allQuestions.length) {
      numQuestionsError.textContent = `Please enter a number between 1 and ${allQuestions.length}.`;
      return;
    }

    resetState();

    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    currentQuestions = shuffled.slice(0, num);

    showScreen("quiz");
    displayQuestion();
    startTimer(num * 60);
  };

  const startTestWithQuestions = (questions) => {
    resetState();
    currentQuestions = questions;
    showScreen("quiz");
    displayQuestion();
    startTimer(questions.length * 60);
  };

  const displayQuestion = () => {
    if (currentQuestionIndex >= currentQuestions.length) {
      endTest();
      return;
    }

    questionContainer.classList.remove("fade-out");
    void questionContainer.offsetWidth;
    questionContainer.classList.add("fade-in");

    const question = currentQuestions[currentQuestionIndex];
    questionText.textContent = question.question;

    optionsList.innerHTML = "";
    question.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.dataset.index = String(index);
      li.addEventListener("click", handleOptionClick);
      optionsList.appendChild(li);
    });

    updateProgress();
    nextBtn.disabled = true;
  };

  const handleOptionClick = (e) => {
    const selectedOption = e.target;
    const selectedIndex = parseInt(selectedOption.dataset.index, 10);
    const correctIndex = currentQuestions[currentQuestionIndex].correctAnswer;

    Array.from(optionsList.children).forEach((li) => {
      li.classList.add("selected");
    });

    if (selectedIndex === correctIndex) {
      selectedOption.classList.add("correct");
      correctAnswers++;
    } else {
      selectedOption.classList.add("wrong");
      optionsList.children[correctIndex].classList.add("correct");
      wrongAnswers++;
      wrongQuestionIndices.push(currentQuestionIndex);
    }

    nextBtn.disabled = false;
  };

  const handleNextQuestion = () => {
    currentQuestionIndex++;
    questionContainer.classList.add("fade-out");
    setTimeout(() => {
      displayQuestion();
    }, 300);
  };

  const updateProgress = () => {
    const current = currentQuestionIndex + 1;
    const total = currentQuestions.length;
    progressCounter.textContent = `Question ${current} of ${total}`;
    progressBar.style.width = `${(current / total) * 100}%`;
  };

  const startTimer = (duration) => {
    let timeLeft = duration;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `Time: ${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (timeLeft <= 10) {
        timerDisplay.style.color = "var(--wrong-color)";
      }

      if (timeLeft <= 0) {
        endTest();
      }
    }, 1000);
  };

  const endTest = () => {
    clearInterval(timerInterval);
    showScreen("result");
    displayResults();
  };

  const displayResults = () => {
    const total = currentQuestions.length;
    const percentage =
      total > 0 ? ((correctAnswers / total) * 100).toFixed(1) : 0;

    animateValue(correctCountSpan, 0, correctAnswers, 500);
    animateValue(wrongCountSpan, 0, wrongAnswers, 500);
    animatePercentage(percentageSpan, 0, parseFloat(percentage), 1000);

    wrongQuestionsList.innerHTML = "";
    const wrongQuestionsContainer = document.getElementById(
      "wrong-questions-container"
    );
    if (wrongQuestionIndices.length > 0) {
      wrongQuestionsContainer.style.display = "block";
      wrongQuestionIndices.forEach((index, i) => {
        const question = currentQuestions[index];
        const item = document.createElement("div");
        item.className = "wrong-question-item";
        item.style.animationDelay = `${i * 0.1}s`;
        item.innerHTML = `
          <p>${question.question}</p>
          <p class="correct-answer">Correct Answer: ${
            question.options[question.correctAnswer]
          }</p>
        `;
        wrongQuestionsList.appendChild(item);
      });
    } else {
      wrongQuestionsContainer.style.display = "none";
    }

    retakeWrongBtn.style.display =
      wrongQuestionIndices.length > 0 ? "inline-block" : "none";
  };

  const retakeWrongQuestions = () => {
    const questionsToRetake = wrongQuestionIndices.map(
      (index) => currentQuestions[index]
    );
    startTestWithQuestions(questionsToRetake);
  };

  const resetState = () => {
    currentQuestions = [];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    wrongQuestionIndices = [];
    clearInterval(timerInterval);
    timerDisplay.style.color = "var(--secondary-text-color)";
  };

  function animateValue(obj, start, end, duration) {
    if (start === end) {
      obj.textContent = String(end);
      return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      obj.textContent = String(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function animatePercentage(obj, start, end, duration) {
    if (start === end) {
      obj.textContent = `${end}%`;
      return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = progress * (end - start) + start;
      obj.textContent = `${currentValue.toFixed(1)}%`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  startBtn.addEventListener("click", startTest);
  nextBtn.addEventListener("click", handleNextQuestion);
  retakeWrongBtn.addEventListener("click", retakeWrongQuestions);

  const init = () => {
    loadQuestions();
    showScreen("setup");
  };

  init();
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
