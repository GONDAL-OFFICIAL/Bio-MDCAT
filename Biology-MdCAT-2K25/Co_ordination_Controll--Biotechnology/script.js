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
        "Biotechnology products like Insulin, Human Growth Hormone, and Hepatitis B Vaccine are commercially produced using:",
      options: [
        "Animal cloning techniques",
        "Recombinant bacteria in large vats called bioreactors",
        "Ex vivo gene therapy on human cells",
        "Traditional agricultural cross-breeding",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "A specific strain of bacteria was modified to efficiently produce phenylalanine, which is a key component in making:",
      options: [
        "Biodegradable plastics",
        "Pest-resistant crops",
        "The artificial sweetener aspartame (NutraSweet)",
        "Human growth hormone",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "In order to create transgenic plants, foreign genes can be inserted into immature plant embryos or:",
      options: [
        "Mature leaves and stems",
        "The plant's root system",
        "Protoplasts (plant cells without cell walls)",
        "The plant's vascular tissue",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Transgenic crops such as cotton, corn, and potatoes have been successfully engineered primarily for what purpose?",
      options: [
        "Drought tolerance",
        "Increased nutritional value",
        "Pest resistance",
        "Faster growth cycles",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The Green Revolution of the 1960s significantly increased world grain production through the use of:",
      options: [
        "Genetically modified animals",
        "High-yield hybrid plants",
        "Advanced irrigation systems",
        "Synthetic fertilizers only",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "To improve crop efficiency, Japanese scientists are attempting to introduce which advanced photosynthetic pathway into rice?",
      options: [
        "The C₃ pathway",
        "The CAM pathway",
        "The C₄ pathway",
        "The anaerobic pathway",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The weed known as mouse-eared cress has been genetically engineered to produce what valuable bioproduct?",
      options: [
        "An antibody to treat herpes",
        "A biodegradable plastic called polyhydroxybutyrate",
        "Human insulin",
        "A vaccine for hepatitis B",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Genetically modified corn has been developed to produce an antibody for what specific medical application?",
      options: [
        "Treating genital herpes",
        "Delivering radioisotopes to tumor cells",
        "Boosting the immune system",
        "Neutralizing bacterial toxins",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What is a major advantage of using plant-made antibodies for medical treatments?",
      options: [
        "They are more potent than other antibodies",
        "They can only treat plant-based diseases",
        "They are cheap to produce and are pathogen-free",
        "They have a much longer shelf-life",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which method involves the direct, manual insertion of genes into egg cells?",
      options: [
        "Vortex Mixing",
        "Electroporation",
        "Microinjection",
        "Biolistics (Gene Gun)",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What is the term for using transgenic farm animals to produce pharmaceuticals?",
      options: [
        "Animal Husbandry",
        "Gene Farming",
        "In vivo Gene Therapy",
        "Xenotransplantation",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Scientists at the U.S. Department of Agriculture engineered mice to secrete which human pharmaceutical in their urine?",
      options: [
        "Insulin",
        "Factor VIII",
        "Tissue Plasminogen Activator (tPA)",
        "Human growth hormone",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "An offspring produced via nucleus transplantation is considered a clone because it has:",
      options: [
        "The same mitochondrial DNA as the donor",
        "A similar but not identical genotype",
        "The same genotype and phenotype as the donor",
        "The same surrogate mother",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "In the successful cloning of mice, the 2N nuclei were sourced from what type of cells?",
      options: [
        "Embryonic stem cells",
        "Liver cells",
        "Cumulus cells",
        "Mature egg cells (ova)",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What are the two primary classifications for gene therapy methods?",
      options: [
        "Viral and Non-viral delivery",
        "Somatic and Germline therapy",
        "Temporary and Permanent integration",
        "Ex vivo and In vivo therapy",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Severe Combined Immunodeficiency Syndrome (SCID) is a genetic disorder caused by the lack of which critical enzyme?",
      options: [
        "Tissue Plasminogen Activator (tPA)",
        "Adenosine deaminase (ADA)",
        "Phenylalanine hydroxylase",
        "DNA Polymerase",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "In ex vivo gene therapy for SCID, why are bone marrow stem cells the ideal target for gene correction?",
      options: [
        "They are the only cells affected by the disease",
        "They are easily removed and replaced",
        "They continuously divide, maintaining the corrected gene",
        "They are resistant to retroviruses",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Familial Hypercholesterolemia is a genetic condition caused by liver cells lacking functional receptors for:",
      options: ["Glucose", "Insulin", "Cholesterol", "Sodium ions"],
      correctAnswer: 2,
    },
    {
      question:
        "The primary goal of ex vivo gene therapy for Familial Hypercholesterolemia is to:",
      options: [
        "Remove the patient's liver",
        "Decrease the body's production of cholesterol",
        "Introduce a normal receptor gene into the patient's liver cells",
        "Administer high doses of cholesterol-lowering drugs",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "In ex vivo gene therapy, the genetic modification of the patient's cells occurs:",
      options: [
        "Directly within the patient's body",
        "In a laboratory before being returned to the patient",
        "Using non-viral methods only",
        "Within the reproductive cells (gametes)",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which statement accurately distinguishes between Diabetes Mellitus and Diabetes Insipidus?",
      options: [
        "Both are caused by insulin deficiency, but affect different organs.",
        "Mellitus involves high blood glucose due to insulin issues; Insipidus involves water imbalance due to ADH issues.",
        "Insipidus is characterized by high blood glucose; Mellitus is a disorder of water balance.",
        "Mellitus is caused by a lack of ADH; Insipidus is caused by insulin resistance.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Reflex actions, such as withdrawing a hand from a hot surface, are primarily controlled by the:",
      options: [
        "Cerebrum",
        "Medulla oblongata",
        "Peripheral Nervous System",
        "Spinal cord",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "What is the main inhibitory neurotransmitter in the Central Nervous System (CNS)?",
      options: [
        "Acetylcholine",
        "Dopamine",
        "Gamma-Aminobutyric Acid (GABA)",
        "Serotonin",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The patellar (knee-jerk) reflex is a classic example of which type of reflex arc?",
      options: [
        "Polysynaptic reflex",
        "Superficial reflex",
        "Monosynaptic reflex",
        "Cranial reflex",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The ventral root of a spinal nerve is responsible for carrying which type of signals?",
      options: [
        "Sensory (afferent) signals from the body",
        "Motor (efferent) signals to muscles and glands",
        "Both motor and sensory signals",
        "Pain and temperature signals only",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Spinal nerves, which branch out from the spinal cord, are considered part of the:",
      options: [
        "Central Nervous System (CNS)",
        "Autonomic Nervous System (ANS)",
        "Peripheral Nervous System (PNS)",
        "Brainstem",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The brain and spinal cord are structurally connected via which part of the brainstem?",
      options: ["Pons", "Medulla oblongata", "Thalamus", "Midbrain"],
      correctAnswer: 1,
    },
    {
      question:
        "Which brain structure acts as a central relay station, directing most incoming sensory impulses to the correct region of the cerebrum?",
      options: ["Hypothalamus", "Cerebellum", "Thalamus", "Hippocampus"],
      correctAnswer: 2,
    },
    {
      question:
        "The ability to process sensory signals from the skin, such as touch, pressure, and pain, is a primary function of the:",
      options: [
        "Frontal lobe",
        "Parietal lobe",
        "Occipital lobe",
        "Temporal lobe",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Auditory information and the formation of memories are primarily processed in which cerebral lobe?",
      options: [
        "Parietal lobe",
        "Frontal lobe",
        "Occipital lobe",
        "Temporal lobe",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "The Diencephalon, a key region for sensory relay and homeostatic control, is composed of the:",
      options: [
        "Midbrain and pons",
        "Thalamus and hypothalamus",
        "Cerebrum and cerebellum",
        "Medulla oblongata and spinal cord",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which of the following correctly lists the three structural parts of the brainstem?",
      options: [
        "Thalamus, Hypothalamus, and Midbrain",
        "Cerebrum, Cerebellum, and Pons",
        "Midbrain, Pons, and Medulla oblongata",
        "Medulla oblongata, Spinal Cord, and Pons",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which pituitary hormone is primarily responsible for stimulating milk production in mammary glands after childbirth?",
      options: [
        "Oxytocin",
        "Prolactin",
        "Luteinizing Hormone (LH)",
        "Estrogen",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "In the female reproductive cycle, theca cells produce testosterone, which is then converted into what primary hormone by granulosa cells?",
      options: [
        "Progesterone",
        "Prolactin",
        "Luteinizing Hormone (LH)",
        "Estrogen",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Luteinizing Hormone (LH), a key regulator of the reproductive system, is released from the:",
      options: [
        "Placenta",
        "Posterior pituitary gland",
        "Ovaries",
        "Anterior pituitary gland",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Which organ is unique for having both exocrine functions (secreting digestive enzymes) and endocrine functions (secreting hormones like insulin)?",
      options: ["Liver", "Pancreas", "Adrenal Gland", "Thyroid Gland"],
      correctAnswer: 1,
    },
    {
      question:
        "The brachial plexus is a complex network of nerves that primarily supplies motor and sensory function to the:",
      options: [
        "Lower limbs",
        "Head and neck",
        "Upper limbs",
        "Abdominal organs",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The gray matter of the spinal cord is structurally organized into nine distinct cellular layers known as:",
      options: [
        "Myelin Sheaths",
        "Dorsal Root Ganglia",
        "Cortical Columns",
        "Rexed's Laminae",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Organisms that exhibit bilateral symmetry, like humans, typically possess a:",
      options: [
        "Diffuse nerve net",
        "Radial nervous system",
        "Centralized nervous system (CNS)",
        "Segmented nervous system",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The average length of a healthy adult human spinal cord is approximately:",
      options: ["20–30 cm", "40–50 cm", "60–70 cm", "80–90 cm"],
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
    numQuestionsInput.value = totalQuestions;
  };

  const loadQuestions = () => {
    allQuestions = defaultQuestions;
    updateSetupUI();
  };

  const startTest = () => {
    const num = parseInt(numQuestionsInput.value, 10);
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
    void questionContainer.offsetWidth; // Trigger reflow
    questionContainer.classList.add("fade-in");

    const question = currentQuestions[currentQuestionIndex];
    questionText.textContent = question.question;

    optionsList.innerHTML = "";
    question.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.dataset.index = index;
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
      li.classList.add("selected"); // Disables further clicks
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
      total > 0 ? ((correctAnswers / total) * 100).toFixed(1) : "0";

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
      obj.textContent = end;
      return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      obj.textContent = currentValue;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function animatePercentage(obj, start, end, duration) {
    if (start === end) {
      obj.textContent = `${end.toFixed(1)}%`;
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
