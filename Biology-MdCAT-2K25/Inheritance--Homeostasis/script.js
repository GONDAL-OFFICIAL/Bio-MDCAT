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
    // Excretory System & Genetics Questions
    {
      question:
        "Where does reabsorption due to the counter-current multiplier mechanism primarily occur?",
      options: [
        "Proximal convoluted tubule (PCT)",
        "Glomerulus",
        "Loop of Henle",
        "Collecting duct",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Antidiuretic hormone (ADH) promotes water reabsorption by changing the permeability of which structure?",
      options: [
        "Ascending loop of Henle",
        "Collecting tube",
        "Bowman’s capsule",
        "Proximal convoluted tubule",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "In which part of the nephron does the maximum amount of reabsorption take place?",
      options: [
        "Loop of Henle",
        "Distal tubule",
        "Collecting duct",
        "Proximal convoluted tubule (PCT)",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "The primary action sites for Antidiuretic hormone (ADH) are the:",
      options: [
        "Glomerulus and PCT",
        "PCT and Loop of Henle",
        "Distal tubule and collecting duct",
        "Ascending and descending limbs",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The process of filtration of blood to form the initial filtrate occurs at the:",
      options: [
        "Loop of Henle",
        "Collecting duct",
        "Glomerulus and Bowman’s capsule",
        "Peritubular capillaries",
      ],
      correctAnswer: 2,
    },
    {
      question: "From where is the Antidiuretic hormone (ADH) secreted?",
      options: [
        "Anterior pituitary gland",
        "Posterior pituitary gland",
        "Adrenal cortex",
        "Thyroid gland",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The outflow of water is actively inhibited from which part of the loop of Henle?",
      options: [
        "Descending loop",
        "The entire loop",
        "Ascending loop",
        "The turn of the loop",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "If the body has an excess of water, how does the level of ADH change and what is the effect?",
      options: [
        "ADH increases, less water elimination",
        "ADH decreases, less water elimination",
        "ADH increases, more water elimination",
        "ADH decreases, more water elimination",
      ],
      correctAnswer: 3,
    },
    {
      question: "How do plants protect themselves from chilling temperatures?",
      options: [
        "By decreasing saturated fatty acids",
        "By increasing unsaturated fatty acids",
        "By increasing their metabolic rate",
        "By shedding their leaves",
      ],
      correctAnswer: 1,
    },
    {
      question: "What are the excretory organs of earthworms called?",
      options: ["Kidneys", "Malpighian tubules", "Nephridia", "Flame cells"],
      correctAnswer: 2,
    },
    {
      question:
        "What is the term for the end stage of kidney failure, characterized by the buildup of waste products in the blood?",
      options: ["Anemia", "Uremia", "Pyelonephritis", "Glomerulonephritis"],
      correctAnswer: 1,
    },
    {
      question:
        "Which substance is NOT reabsorbed in the ascending limb of the loop of Henle?",
      options: ["Sodium", "Chloride", "Potassium", "Water"],
      correctAnswer: 3,
    },
    {
      question:
        'In a medical context, what does the term "dialysis" literally mean?',
      options: [
        "Kidney transplant",
        "Blood cleanliness",
        "Urine formation",
        "Fluid balance",
      ],
      correctAnswer: 1,
    },
    {
      question: "How do pyrogens cause a fever in the body?",
      options: [
        "By destroying pathogens directly",
        "By increasing the set point of the hypothalamus",
        "By decreasing metabolic rate",
        "By causing vasodilation",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What is the correct pathway of urine from the kidney to the outside of the body?",
      options: [
        "Kidney → Urethra → Urinary bladder → Ureter",
        "Kidney → Urinary bladder → Ureter → Urethra",
        "Kidney → Ureter → Urinary bladder → Urethra",
        "Kidney → Ureter → Urethra → Urinary bladder",
      ],
      correctAnswer: 2,
    },
    {
      question: "Why is a test cross necessary in cases of complete dominance?",
      options: [
        "Because phenotype and genotype are always the same",
        "Because the dominant allele is always expressed",
        "Because phenotype and genotype can differ",
        "Because it determines the sex of the offspring",
      ],
      correctAnswer: 2,
    },
    {
      question: "Who discovered the ABO blood group system?",
      options: ["Bernstein", "Mendel", "K. Landsteiner", "Watson and Crick"],
      correctAnswer: 2,
    },
    {
      question:
        'The ABO blood group system is based on a single polymorphic gene "I" located on which chromosome?',
      options: [
        "Chromosome 7",
        "Chromosome 9",
        "Chromosome 11",
        "X Chromosome",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Besides the ABO system, what other important blood factor did K. Landsteiner discover?",
      options: [
        "Hemoglobin",
        "Platelets",
        "The Rh factor",
        "White blood cells",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which gene is the primary determinant of whether a person's blood is Rh positive or Rh negative?",
      options: ["C gene", "D gene", "E gene", "I gene"],
      correctAnswer: 1,
    },
    {
      question:
        "Erythroblastosis fetalis can occur under which specific condition?",
      options: [
        "Rh- father, Rh+ mother, Rh- child",
        "Rh+ father, Rh- mother, Rh+ child",
        "Rh- father, Rh- mother, Rh+ child",
        "Rh+ father, Rh+ mother, Rh- child",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "According to the provided list, which set of diseases are all linked to Chromosome 10?",
      options: [
        "Sickle cell anemia, Leukemia, Albinism",
        "Color blindness, Gout, Hemophilia",
        "Hemophilia, Rickets, Gout",
        "Albinism, TFS, Color blindness",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Sickle cell anemia, Leukemia, and Albinism are all linked to which chromosome?",
      options: [
        "Chromosome 9",
        "Chromosome 10",
        "Chromosome 11",
        "Chromosome 4",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the definition of a pedigree in genetics?",
      options: [
        "A chart showing chromosome numbers",
        "A diagram of a single gene",
        "Tracing the inheritance of human traits",
        "The calculation of genetic combinations",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Hemophilia A, which accounts for 80% of cases, is linked to which chromosome and inheritance pattern?",
      options: [
        "Chromosome 8, X-linked recessive",
        "Chromosome 9, X-linked recessive",
        "Chromosome 11, autosomal",
        "Chromosome 4, autosomal",
      ],
      correctAnswer: 0,
    },
    {
      question: "Hemophilia B (20% of cases) is linked to which chromosome?",
      options: [
        "Chromosome 8",
        "Chromosome 9",
        "Chromosome 11",
        "X Chromosome",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which type of Hemophilia is autosomal and not X-linked?",
      options: [
        "Hemophilia A",
        "Hemophilia B",
        "Hemophilia C",
        "All are X-linked",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Hemophilia and color blindness are both classified as what type of genetic disorders?",
      options: [
        "Autosomal dominant",
        "Autosomal recessive",
        "X-linked dominant",
        "X-linked recessive",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Red and green color blindness are X-linked recessive, but blue color blindness is linked to which autosome?",
      options: [
        "Chromosome 4",
        "Chromosome 7",
        "Chromosome 9",
        "Chromosome 11",
      ],
      correctAnswer: 1,
    },
    {
      question: 'What defines a "true breeding" plant in genetics?',
      options: [
        "It is heterozygous for all traits",
        "It has homozygous dominant or recessive traits",
        "It can self-pollinate",
        "It produces a large number of offspring",
      ],
      correctAnswer: 1,
    },
    {
      question: "Why can homozygous chromosomes not be haploid?",
      options: [
        "Haploid cells have no chromosomes",
        "Haploid means having one set of chromosomes",
        "Homozygous refers to a single allele",
        "Haploid cells are always dominant",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Using the formula 2ⁿ, if n=3 heterozygotes, how many genetic combinations are possible?",
      options: ["4", "6", "8", "16"],
      correctAnswer: 2,
    },
    {
      question:
        "The 7 traits of the pea plant studied by Mendel are located on how many different chromosomes?",
      options: ["7", "14", "4", "2"],
      correctAnswer: 2,
    },
    {
      question:
        "Traits that show distinct categories, such as flower color (purple or white), are known as:",
      options: [
        "Quantitative traits",
        "Qualitative traits",
        "Polygenic traits",
        "Recessive traits",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Traits that show continuous variation, such as height and skin color, are called:",
      options: [
        "Mendelian traits",
        "Dominant traits",
        "Qualitative traits",
        "Quantitative traits",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "What is the term for a gamete that contains no sex chromosome?",
      options: ["Heterogamete", "Homogamete", "Null gamete", "Zygote"],
      correctAnswer: 2,
    },
    {
      question: "What is epistasis?",
      options: [
        "Interaction between alleles of the same gene",
        "The complete dominance of one allele",
        "Interaction between genes at different loci",
        "The linkage of genes on the same chromosome",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "How many homologous pairs of chromosomes does a Drosophila (fruit fly) have?",
      options: ["22", "11", "4", "3"],
      correctAnswer: 3,
    },
    {
      question:
        "In humans, how many pairs of chromosomes are homologous autosomes?",
      options: ["23", "46", "22", "1"],
      correctAnswer: 2,
    },
    {
      question: "What is the chromosome arrangement for a male grasshopper?",
      options: ["XY", "XX", "XO", "ZZ"],
      correctAnswer: 2,
    },
    {
      question:
        "In butterflies, birds, and moths, which sex is homogametic (ZZ)?",
      options: ["Male", "Female", "Both", "Neither"],
      correctAnswer: 0,
    },
    {
      question:
        "Unlike hemophilia and color blindness, rickets is what type of X-linked disease?",
      options: [
        "X-linked recessive",
        "X-linked dominant",
        "Autosomal recessive",
        "Autosomal dominant",
      ],
      correctAnswer: 1,
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

  // --- Event Listeners ---
  startBtn.addEventListener("click", startTest);
  nextBtn.addEventListener("click", handleNextQuestion);
  retakeWrongBtn.addEventListener("click", retakeWrongQuestions);

  // --- Initialization ---
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
