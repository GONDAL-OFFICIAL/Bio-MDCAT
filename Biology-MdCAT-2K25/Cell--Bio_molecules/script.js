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
    {
      question:
        "Where do substances like newly synthesized proteins first arrive for processing and modification?",
      options: [
        "Smooth Endoplasmic Reticulum",
        "Rough Endoplasmic Reticulum (RER)",
        "Golgi Apparatus",
        "Lysosome",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the approximate resolution of the unaided human eye?",
      options: ["1 mm", "0.1 mm", "10 mm", "0.01 mm"],
      correctAnswer: 0,
    },
    {
      question: "The plant cell wall is secreted by which cellular component?",
      options: ["Nucleus", "Ribosomes", "Mitochondria", "Protoplasm"],
      correctAnswer: 3,
    },
    {
      question:
        "Which molecules on the cell surface are primarily responsible for cell-to-cell recognition?",
      options: [
        "Phospholipids and Cholesterol",
        "Glycoproteins and Glycolipids",
        "Actin and Myosin",
        "DNA and RNA",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which enzyme is responsible for converting ATP into cyclic AMP (cAMP)?",
      options: [
        "ATP Synthase",
        "Adenylate Cyclase",
        "DNA Polymerase",
        "Hexokinase",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which organelle is involved in forming lysosomes and assisting in plant cell wall formation?",
      options: [
        "Mitochondrion",
        "Peroxisome",
        "Golgi Apparatus",
        "Chloroplast",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The middle lamella between plant cells is primarily digested by which enzyme?",
      options: ["Lipase", "Amylase", "Pectinase", "Protease"],
      correctAnswer: 2,
    },
    {
      question:
        "What component is notably absent from the cell walls of prokaryotes?",
      options: ["Peptidoglycan", "Lipids", "Cellulose", "Proteins"],
      correctAnswer: 2,
    },
    {
      question: "What is the approximate thickness of the plasma membrane?",
      options: ["70 nm", "7 nm", "1 nm", "100 nm"],
      correctAnswer: 1,
    },
    {
      question: "Ergastroplasm is another term for which cellular structure?",
      options: [
        "Smooth Endoplasmic Reticulum",
        "Cytosol",
        "Rough Endoplasmic Reticulum (RER)",
        "Nucleolus",
      ],
      correctAnswer: 2,
    },
    {
      question: "In plant cells, the Golgi apparatus is often referred to as:",
      options: ["Tonoplast", "Dictyosomes", "Plasmodesmata", "Stroma"],
      correctAnswer: 1,
    },
    {
      question:
        "Cellulose, a major component of plant cell walls, has a strong affinity for what substance?",
      options: ["Lipids", "Acids", "Water", "Alcohols"],
      correctAnswer: 2,
    },
    {
      question:
        "Which molecule is primarily synthesized by free-floating ribosomes in the cytoplasm?",
      options: [
        "Secretory proteins",
        "DNA polymerase",
        "Hormones",
        "Membrane lipids",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which organelle is generally considered the heaviest within an animal cell?",
      options: ["Mitochondrion", "Ribosome", "Nucleus", "Lysosome"],
      correctAnswer: 2,
    },
    {
      question:
        "Cytoplasmic streaming movements have a direct and significant impact on the flow of materials within the RER.",
      options: [
        "True",
        "This is incorrect",
        "Only in plant cells",
        "Only during mitosis",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The Rough Endoplasmic Reticulum (RER) is structurally continuous with which other organelle?",
      options: [
        "Golgi Apparatus",
        "Plasma Membrane",
        "Nuclear Membrane",
        "Mitochondrion",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "In pancreatic cells, which organelle is responsible for forming secretory granules?",
      options: ["Nucleus", "Lysosome", "Golgi Complex", "Peroxisome"],
      correctAnswer: 2,
    },
    {
      question:
        "What is the shape of the forming (cis) face of the Golgi apparatus?",
      options: ["Concave", "Flat", "Irregular", "Convex"],
      correctAnswer: 3,
    },
    {
      question:
        "What is the characteristic shape of the maturing (trans) face of the Golgi apparatus?",
      options: ["Convex", "Concave", "Circular", "Undefined"],
      correctAnswer: 1,
    },
    {
      question:
        "Through which mechanism do fatty acids primarily enter the cell?",
      options: [
        "Active Transport",
        "Endocytosis",
        "Passive Transport",
        "Exocytosis",
      ],
      correctAnswer: 2,
    },
    {
      question: "Where is the mitochondrial matrix located?",
      options: [
        "Outside the outer membrane",
        "Between the inner and outer membranes",
        "Inside the inner membrane",
        "It is not a part of the mitochondrion",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Phosphatidylserine is a phospholipid typically found on which leaflet of the plasma membrane?",
      options: [
        "Outer leaflet",
        "Inner leaflet",
        "Both leaflets equally",
        "Embedded within proteins",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which type of RNA is the smallest in size?",
      options: [
        "mRNA (messenger RNA)",
        "rRNA (ribosomal RNA)",
        "tRNA (transfer RNA)",
        "siRNA (small interfering RNA)",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which statement best describes the structure of a tRNA molecule?",
      options: [
        "It is a perfect double helix",
        "It is single-stranded with duplex regions",
        "It is a long, linear, un-folded strand",
        "It is a circular molecule",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the characteristic 2D shape of a tRNA molecule?",
      options: ["Linear strand", "Hairpin loop", "Cloverleaf", "Spherical"],
      correctAnswer: 2,
    },
    {
      question:
        "The 5'-end of a tRNA molecule always terminates with which base?",
      options: ["Adenine (A)", "Cytosine (C)", "Guanine (G)", "Uracil (U)"],
      correctAnswer: 2,
    },
    {
      question:
        "What is the constant base sequence found at the 3'-end of every tRNA molecule?",
      options: ["AUG", "CCA", "GUC", "UAA"],
      correctAnswer: 1,
    },
    {
      question:
        "The anticodon, which is complementary to an mRNA codon, is located on which loop of the tRNA?",
      options: ["D-loop", "TψC loop", "Anticodon loop", "Variable loop"],
      correctAnswer: 2,
    },
    {
      question:
        "What is the function of the D-loop (Dihydrouridine loop) in a tRNA molecule?",
      options: [
        "Binds to the ribosome",
        "Recognizes the activation enzyme",
        "Carries the amino acid",
        "Pairs with mRNA",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The TψC loop (theta loop) of a tRNA molecule is responsible for recognizing the:",
      options: [
        "mRNA start codon",
        "Correct amino acid",
        "Binding site on the ribosome",
        "Aminoacyl-tRNA synthetase",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "How many specific types of tRNA molecules are required at a minimum?",
      options: [
        "One for all amino acids",
        "At least 20, one for each amino acid",
        "Exactly 64, one for each codon",
        "Around 100",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the primary function of tRNA in protein synthesis?",
      options: [
        "Carrying genetic code from the nucleus",
        "Forming the structure of ribosomes",
        "Picking up amino acids and transferring them to ribosomes",
        "Catalyzing peptide bond formation",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Approximately how many different types of tRNA molecules are found in human cells?",
      options: ["20", "61", "10", "45"],
      correctAnswer: 3,
    },
    {
      question: "Glucose is also commonly known by which other names?",
      options: [
        "Fructose and Maltose",
        "Dextrose and Grape Sugar",
        "Sucrose and Lactose",
        "Ribose and Deoxyribose",
      ],
      correctAnswer: 1,
    },
    {
      question: "Raffinose, found in beans and cabbage, is an example of a:",
      options: [
        "Monosaccharide",
        "Disaccharide",
        "Trisaccharide",
        "Polysaccharide",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the heat of vaporization of water?",
      options: ["100 kcal/kg", "574 kcal/kg", "212 kcal/kg", "1000 kcal/kg"],
      correctAnswer: 1,
    },
    {
      question:
        "What is the approximate normal concentration of glucose in human blood?",
      options: ["0.8%", "1.0%", "0.01%", "0.08%"],
      correctAnswer: 3,
    },
    {
      question:
        "How much solar energy is required for the formation of 10 grams of glucose?",
      options: ["7.176 kcal", "71.76 kcal", "717.6 kcal", "7176 kcal"],
      correctAnswer: 2,
    },
    {
      question: "A furanose ring, formed by pentoses and ketohexoses, is a:",
      options: [
        "Six-membered ring with 2 oxygens",
        "Five-membered ring with 1 oxygen",
        "Five-membered ring with 2 oxygens",
        "Six-membered ring with 1 oxygen",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "A pyranose ring is a six-membered ring structure typically formed by:",
      options: [
        "All monosaccharides",
        "Aldohexoses only",
        "Ketohexoses only",
        "Pentoses and ketohexoses",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Furanose and pyranose are ring structures of which type of carbohydrate?",
      options: [
        "Disaccharides",
        "Polysaccharides",
        "Monosaccharides",
        "Oligosaccharides",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Maltose is a disaccharide composed of two glucose units linked by what type of bond?",
      options: ["β(1→4)", "α(1→2)", "α(1→4)", "β(1→6)"],
      correctAnswer: 2,
    },
    {
      question:
        "Sucrose is formed by the linkage of glucose and fructose via which bond?",
      options: ["α(1→4)", "β(1→4)", "α(1→2)", "α(1→6)"],
      correctAnswer: 2,
    },
    {
      question:
        "Lactose, or milk sugar, is composed of glucose and galactose joined by a:",
      options: ["β(1→4) bond", "α(1→4) bond", "α(1→2) bond", "β(1→2) bond"],
      correctAnswer: 0,
    },
    {
      question: "Benedict’s and Fehling’s tests are used to identify:",
      options: [
        "All carbohydrates",
        "Polysaccharides",
        "Non-reducing sugars",
        "Reducing sugars",
      ],
      correctAnswer: 3,
    },
    {
      question: "Which of the following is considered a non-reducing sugar?",
      options: ["Glucose", "Maltose", "Fructose", "Sucrose"],
      correctAnswer: 3,
    },
    {
      question:
        "The hydrolysis of chitin, a polysaccharide, yields which substance?",
      options: ["Glucose", "Fructose", "N-acetylglucosamine", "Galactose"],
      correctAnswer: 2,
    },
    {
      question:
        "Chitin, found in the exoskeletons of arthropods, is classified as a:",
      options: [
        "Reducing polysaccharide",
        "Monosaccharide",
        "Non-reducing polysaccharide",
        "Disaccharide",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Sacs of phospholipids that contain water and act as drug carriers are known as:",
      options: ["Micelles", "Liposomes", "Vesicles", "Vacuoles"],
      correctAnswer: 1,
    },
    {
      question:
        "The high energy content of lipids is attributed to the high concentration of:",
      options: ["C-O bonds", "O-H bonds", "C-H bonds", "N-H bonds"],
      correctAnswer: 2,
    },
    {
      question: "In a phospholipid, the fatty acid tails are described as:",
      options: [
        "Polar and hydrophilic",
        "Non-polar and hydrophilic",
        "Polar and hydrophobic",
        "Non-polar and hydrophobic",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "The choline head group in a phospholipid contains which element that is not typically found in fatty acids?",
      options: ["Sulfur", "Nitrogen", "Phosphorus", "Iron"],
      correctAnswer: 1,
    },
    {
      question:
        "During the formation of an ester bond in a lipid, which molecules donate the H and OH groups?",
      options: [
        "Glycerol donates OH, fatty acid donates H",
        "Glycerol donates H, fatty acid donates OH",
        "Both donate OH",
        "Both donate H",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "A monoterpene, such as menthol, is composed of how many terpene (isoprene) units?",
      options: ["One", "Two", "Three", "Four"],
      correctAnswer: 1,
    },
    {
      question:
        "Vitamin A is classified as a diterpene, which means it is formed from how many terpene units?",
      options: ["Two", "Four", "Six", "Eight"],
      correctAnswer: 1,
    },
    {
      question:
        "A triterpene like amberine is constructed from how many terpene units?",
      options: ["Three", "Four", "Six", "Eight"],
      correctAnswer: 2,
    },
    {
      question: "The word 'protein' is derived from which language?",
      options: ["Latin", "Greek", "German", "English"],
      correctAnswer: 1,
    },
    {
      question: "What is the R group (side chain) for the amino acid Alanine?",
      options: ["H", "CH₃", "CH₂OH", "SH"],
      correctAnswer: 1,
    },
    {
      question:
        "Which amino acid is the simplest, having only a hydrogen atom as its R group?",
      options: ["Alanine", "Leucine", "Glycine", "Proline"],
      correctAnswer: 2,
    },
    {
      question:
        "The amino acid serine is a component of which two major classes of biomolecules?",
      options: [
        "Carbohydrates and Nucleic Acids",
        "Proteins and Phospholipids",
        "Lipids and Carbohydrates",
        "Steroids and Proteins",
      ],
      correctAnswer: 1,
    },
    {
      question: "The enzyme Renin, found in the stomach, is classified as a:",
      options: ["Lipase", "Amylase", "Protease", "Nuclease"],
      correctAnswer: 2,
    },
    {
      question: "Ribozymes are unique enzymes because they are made of:",
      options: ["Protein", "Lipids", "Carbohydrates", "Catalytic RNA"],
      correctAnswer: 3,
    },
    {
      question:
        "Most bodily secretions, such as mucus, are what type of conjugated protein?",
      options: [
        "Lipoproteins",
        "Chromoproteins",
        "Glycoproteins",
        "Nucleoproteins",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the most abundant fibrous protein in the human body?",
      options: ["Keratin", "Elastin", "Collagen", "Myosin"],
      correctAnswer: 2,
    },
    {
      question:
        "The hardness of nails and bones is significantly contributed by disulfide bonds from which amino acid?",
      options: ["Methionine", "Cysteine", "Proline", "Serine"],
      correctAnswer: 1,
    },
    {
      question:
        "Catabolism and anabolism, the two arms of metabolism, are chemically linked by which molecule?",
      options: ["Glucose", "Water", "ADP/ATP", "NAD+/NADH"],
      correctAnswer: 2,
    },
    {
      question: "Which statement is true about the energy in ADP?",
      options: [
        "It has no high-energy bonds",
        "It contains high-energy bonds that release energy on hydrolysis",
        "It stores more energy than ATP",
        "It cannot be converted to ATP",
      ],
      correctAnswer: 1,
    },
    {
      question: "The attraction between two water molecules is an example of:",
      options: ["Adhesion", "Cohesion", "Covalence", "Ionic bonding"],
      correctAnswer: 1,
    },
    {
      question:
        "A diet rich in green vegetables is associated with a reduced risk of what condition?",
      options: ["Heart disease", "Type 2 Diabetes", "Asthma", "Osteoporosis"],
      correctAnswer: 1,
    },
    {
      question:
        "Tetrose sugars, a type of carbohydrate with four carbon atoms, can be found in:",
      options: ["Plants", "Humans", "Viruses", "Bacteria"],
      correctAnswer: 3,
    },
    {
      question: "Who discovered the molecular basis of Sickle Cell Anemia?",
      options: ["Watson and Crick", "Linus Pauling", "Ingram", "Sanger"],
      correctAnswer: 2,
    },
    {
      question:
        "Sickle Cell Anemia is caused by a point mutation that substitutes valine for which amino acid?",
      options: ["Alanine", "Leucine", "Glutamic acid", "Glycine"],
      correctAnswer: 2,
    },
    {
      question:
        "Avidin, a protein in raw egg whites, tightly binds to which vitamin, making it inactive?",
      options: ["Vitamin C", "Vitamin A", "Biotin (B₇)", "Vitamin D"],
      correctAnswer: 2,
    },
    {
      question: "A nucleoside is composed of which two components?",
      options: [
        "Phosphate + Sugar",
        "Nitrogenous base + Phosphate",
        "Nitrogenous base + Sugar",
        "Base + Sugar + Phosphate",
      ],
      correctAnswer: 2,
    },
    {
      question: "A nucleotide is composed of which three components?",
      options: [
        "Base + Sugar",
        "Base + Phosphate",
        "Sugar + Phosphate",
        "Base + Sugar + Phosphate",
      ],
      correctAnswer: 3,
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
