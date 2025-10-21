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
    // Virology Basics
    {
      question: "Where is the matrix protein located in a virus?",
      options: [
        "Between the capsid and the envelope",
        "Inside the capsid",
        "On the outer surface of the envelope",
        "Within the nucleic acid",
      ],
      correctAnswer: 0,
    },
    {
      question: "What is the typical size range for viruses?",
      options: [
        "25 to 250 micrometers",
        "25 to 250 millimeters",
        "25 to 250 nanometers",
        "0.1 to 1 nanometers",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which viruses are known as the largest viruses?",
      options: [
        "Influenza viruses",
        "Pox viruses",
        "Bacteriophages",
        "Retroviruses",
      ],
      correctAnswer: 1,
    },
    {
      question: "How much smaller are viruses compared to bacteria?",
      options: [
        "2 to 5 times smaller",
        "About the same size",
        "10 to 1000 times smaller",
        "10,000 times smaller",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Due to their potential for harm, viruses are sometimes considered to be:",
      options: [
        "Biological curiosities",
        "Biological weapons",
        "Prokaryotic cells",
        "Fungal spores",
      ],
      correctAnswer: 1,
    },

    // History of Virology
    {
      question:
        "Who first mentioned the existence of viruses by describing the filterable nature of rabies?",
      options: [
        "Louis Pasteur",
        "Edward Jenner",
        "Charles Chamberland",
        "Wendell Stanley",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Who is credited with providing the first vaccine for smallpox?",
      options: [
        "Louis Pasteur",
        "Robert Koch",
        "Alexander Fleming",
        "Edward Jenner",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Which scientist provided vaccines for anthrax, rabies, and cholera?",
      options: [
        "Edward Jenner",
        "Charles Chamberland",
        "Ivanovsky",
        "Louis Pasteur",
      ],
      correctAnswer: 3,
    },
    {
      question: "What did Ivanovsky describe viruses as?",
      options: [
        "Insoluble toxins",
        "Dissoluble living germs",
        "Complex bacteria",
        "Acellular parasites",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which scientist performed the isolation, purification, and crystallization of the Tobacco Mosaic Virus (TMV)?",
      options: [
        "Ivanovsky",
        "F. W. Twort",
        "Wendell Stanley",
        "Félix d’Herelle",
      ],
      correctAnswer: 2,
    },
    {
      question: "The discovery of bacteriophages is credited to:",
      options: [
        "Wendell Stanley",
        "Louis Pasteur",
        "Ivanovsky",
        "F. W. Twort and Félix d’Herelle",
      ],
      correctAnswer: 3,
    },

    // Viral Structures and Types
    {
      question: "What is a viroid primarily composed of?",
      options: [
        "Double-stranded DNA (dsDNA)",
        "Single-stranded RNA (ssRNA)",
        "A protein capsid only",
        "A lipid envelope",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Picornavirus is responsible for causing which of the following diseases?",
      options: [
        "Influenza and Rabies",
        "Hepatitis A and Polio",
        "Smallpox and Measles",
        "HIV and Herpes",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What type of genome do most of the 2000 types of plant viruses have?",
      options: ["dsDNA", "ssDNA", "RNA", "A mix of DNA and RNA"],
      correctAnswer: 2,
    },
    {
      question:
        "Which of the following virus shapes is correctly matched with the virus type?",
      options: [
        "Helical → Adenovirus",
        "Complex → Influenza virus",
        "Polyhedral → Bacteriophage",
        "Enveloped → Influenza virus",
      ],
      correctAnswer: 3,
    },
    {
      question: "The Tobacco Mosaic Virus (TMV) exhibits which shape?",
      options: ["Polyhedral", "Helical", "Complex", "Enveloped"],
      correctAnswer: 1,
    },
    {
      question:
        "A bacteriophage is an example of a virus with a ________ shape.",
      options: ["Helical", "Circular", "Polyhedral", "Complex"],
      correctAnswer: 3,
    },
    {
      question:
        "Which of the following is an example of a double-stranded DNA (dsDNA) virus?",
      options: ["Parvovirus", "Reovirus", "Rubella", "Pox virus"],
      correctAnswer: 3,
    },
    {
      question:
        "Parvovirus, which causes mild rashes, has what type of nucleic acid?",
      options: ["dsDNA", "ssDNA", "dsRNA", "ssRNA"],
      correctAnswer: 1,
    },
    {
      question: "Reovirus, a cause of diarrhea, is classified as a:",
      options: ["dsDNA virus", "ssDNA virus", "dsRNA virus", "ssRNA virus"],
      correctAnswer: 2,
    },
    {
      question: "Influenza and Rubella are examples of what type of virus?",
      options: ["dsDNA virus", "ssDNA virus", "dsRNA virus", "ssRNA virus"],
      correctAnswer: 3,
    },
    {
      question:
        "The reverse transcription enzyme is a unique feature of which viruses?",
      options: [
        "Retrovirus and Hepatitis B",
        "Pox virus and Herpes virus",
        "Influenza and Paramyxoviruses",
        "Adenovirus and Reovirus",
      ],
      correctAnswer: 0,
    },
    {
      question:
        "What is the most common shape of a polyhedral capsid, featuring 20 faces?",
      options: ["Cube", "Dodecahedron", "Icosahedron", "Octahedron"],
      correctAnswer: 2,
    },
    {
      question: "Which of the following Hepatitis viruses is a naked virus?",
      options: ["Hepatitis A", "Hepatitis B", "Hepatitis C", "Hepatitis D"],
      correctAnswer: 0,
    },
    {
      question:
        "Hepatitis B is distinguished from other hepatitis viruses by having a:",
      options: [
        "RNA genome",
        "DNA genome",
        "Viroid structure",
        "Complex capsid",
      ],
      correctAnswer: 1,
    },
    {
      question: "Paramyxoviruses are classified as:",
      options: [
        "DNA naked viruses",
        "RNA naked viruses",
        "DNA enveloped viruses",
        "RNA enveloped viruses",
      ],
      correctAnswer: 3,
    },
    {
      question: "What is a key function of the viral capsid?",
      options: [
        "To provide mobility",
        "To perform reverse transcription",
        "To protect the genome from nucleases",
        "To synthesize ATP",
      ],
      correctAnswer: 2,
    },
    {
      question: "The antigenic specificity of a virus is determined by its:",
      options: ["Nucleic acid", "Capsid", "Envelope", "Ribosomes"],
      correctAnswer: 1,
    },

    // Bacteriophages and HIV
    {
      question: "Which bacterium is commonly used to study bacteriophages?",
      options: [
        "Staphylococcus aureus",
        "Streptococcus pneumoniae",
        "E. coli",
        "Bacillus anthracis",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "How many new copies does a bacteriophage typically form in 25 minutes inside E. coli?",
      options: ["20", "50", "200", "1000"],
      correctAnswer: 2,
    },
    {
      question: "What is the approximate diameter of the HIV virus?",
      options: [
        "10 nanometers",
        "50 nanometers",
        "100 nanometers",
        "250 nanometers",
      ],
      correctAnswer: 2,
    },
    {
      question: "Retroviruses are known to cause tumors in which animals?",
      options: [
        "Amphibians and reptiles",
        "Fish and insects",
        "Fowls, rodents, and cats",
        "Primates and canines",
      ],
      correctAnswer: 2,
    },
    {
      question: "A viral envelope is described as being:",
      options: [
        "Permanent and virus-derived",
        "Long-term and resistant to sunlight",
        "Short-term and host-provided",
        "Made of carbohydrates",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the function of the GP120 spike on the HIV envelope?",
      options: [
        "Fusion with the host cell",
        "Attachment to the host cell",
        "Protecting the genome",
        "Reverse transcription",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which HIV spike protein is responsible for fusion with the host cell membrane?",
      options: ["GP41", "GP120", "Reverse Transcriptase", "Matrix Protein"],
      correctAnswer: 0,
    },
    {
      question: "How do animal viruses typically enter a host cell?",
      options: [
        "They inject only their genome",
        "They enter the host cell completely",
        "They attach but remain outside",
        "They divide the host cell",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "A common effect of plant viruses on their hosts is the formation of:",
      options: ["Spores", "Tumors", "Flowers", "Deep roots"],
      correctAnswer: 1,
    },
    {
      question: "How many tail fibers does a typical bacteriophage possess?",
      options: ["Two", "Four", "Six", "Eight"],
      correctAnswer: 2,
    },

    // Cellular Respiration
    {
      question:
        "What is the primary function of the electron transport chain in mitochondria?",
      options: [
        "To directly synthesize ATP",
        "To create a proton gradient",
        "To break down glucose",
        "To oxidize pyruvate",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "In which type of cells does oxidative phosphorylation NOT occur?",
      options: [
        "Liver cells",
        "Muscle cells",
        "Neurons",
        "Erythrocytes (Red Blood Cells)",
      ],
      correctAnswer: 3,
    },
    {
      question: "Which process generates the maximum amount of ATP?",
      options: [
        "Glycolysis",
        "Krebs Cycle",
        "Fermentation",
        "Oxidative phosphorylation",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "How many ATP molecules are produced from one molecule of FADH₂ in oxidative phosphorylation?",
      options: ["1 ATP", "2 ATP", "3 ATP", "4 ATP"],
      correctAnswer: 1,
    },
    {
      question:
        "How many ATP molecules are produced from one molecule of NADH₂ in oxidative phosphorylation?",
      options: ["1 ATP", "2 ATP", "3 ATP", "4 ATP"],
      correctAnswer: 2,
    },
    {
      question:
        "An increase in ATP concentration will inhibit the action of which key glycolytic enzyme?",
      options: [
        "Hexokinase",
        "Phosphofructokinase",
        "Pyruvate kinase",
        "Aldolase",
      ],
      correctAnswer: 1,
    },
    {
      question: "An increased concentration of NADH will inhibit which enzyme?",
      options: [
        "Phosphofructokinase",
        "Pyruvate decarboxylate",
        "ATP synthase",
        "Hexokinase",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What molecule serves as an intermediate between respiration and photosynthesis?",
      options: ["Pyruvate", "Acetyl-CoA", "G3P", "Glucose"],
      correctAnswer: 2,
    },
    {
      question: "The process of deamination primarily occurs in which organ?",
      options: ["Kidneys", "Spleen", "Liver", "Pancreas"],
      correctAnswer: 2,
    },
    {
      question: "In which part of the cell does glycolysis occur?",
      options: [
        "Mitochondrial matrix",
        "Inner mitochondrial membrane",
        "Cytoplasm",
        "Nucleus",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What is the total number of ATPs formed in aerobic respiration, and how many come from the electron transport chain?",
      options: [
        "38 total, 34 from ETC",
        "36 total, 32 from ETC",
        "32 total, 28 from ETC",
        "30 total, 26 from ETC",
      ],
      correctAnswer: 1,
    },
    {
      question: "In chemoosmosis, what is the path of ion flow?",
      options: [
        "Stroma to lumen",
        "Lumen to stroma",
        "Matrix to intermembrane space",
        "Cytoplasm to matrix",
      ],
      correctAnswer: 1,
    },
    {
      question: "During glycolysis, which molecule undergoes dehydrogenation?",
      options: ["Glucose", "Pyruvate", "G3P", "Fructose-1,6-bisphosphate"],
      correctAnswer: 2,
    },
    {
      question: "What is NOT essential for the process of glycolysis?",
      options: ["Enzymes", "Glucose", "ATP", "Oxygen"],
      correctAnswer: 3,
    },
    {
      question:
        "The electron transport chain takes electrons from NADH and FADH₂ and passes them to what molecule?",
      options: ["ATP synthase", "Cytochrome c", "Coenzyme Q", "Oxygen"],
      correctAnswer: 2,
    },
    {
      question: "What happens to carriers in the electron transport chain?",
      options: [
        "They are first oxidized, then reduced",
        "They are first reduced, then oxidized",
        "They remain neutral",
        "They are permanently oxidized",
      ],
      correctAnswer: 1,
    },
    {
      question: "Where are the carriers of the respiratory chain located?",
      options: [
        "Cytoplasm",
        "Outer mitochondrial membrane",
        "Inner mitochondrial membrane",
        "Mitochondrial matrix",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What is the terminal electron acceptor in the mitochondrial electron transport chain?",
      options: ["Water", "Nitrate", "Sulfate", "Oxygen"],
      correctAnswer: 3,
    },
    {
      question:
        "What are the final products of the complete oxidation of pyruvate in aerobic respiration?",
      options: [
        "Lactic acid and ATP",
        "Ethanol and CO₂",
        "CO₂ and H₂O",
        "Glucose and Oxygen",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the template used during reverse transcription?",
      options: ["Host DNA", "Viral DNA", "Host RNA", "Viral RNA"],
      correctAnswer: 3,
    },
    {
      question:
        "Which enzyme is responsible for moving a phosphate group from ATP to glucose?",
      options: ["Polymerase", "Ligase", "Kinase", "Nuclease"],
      correctAnswer: 2,
    },
    {
      question: "Where are the enzymes for the Krebs cycle located?",
      options: [
        "Cytoplasm",
        "Outer mitochondrial membrane",
        "Inner mitochondrial membrane",
        "Mitochondrial matrix",
      ],
      correctAnswer: 3,
    },

    // Miscellaneous and Mixed Topics
    {
      question: "What type of molecule is ATP?",
      options: ["A protein", "A carbohydrate", "A lipid", "A nucleotide"],
      correctAnswer: 3,
    },
    {
      question:
        "What combination of drugs is used for the prevention and treatment of Hepatitis C?",
      options: [
        "Penicillin and Aspirin",
        "Alpha-interferon and Ribavirin",
        "Ibuprofen and Acetaminophen",
        "Insulin and Metformin",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which viral disease is considered the most widely spread?",
      options: ["Polio", "Hepatitis B", "Influenza", "Smallpox"],
      correctAnswer: 2,
    },
    {
      question: "The polio virus primarily affects which part of the body?",
      options: [
        "The respiratory system",
        "The liver",
        "The digestive tract",
        "The spinal cord and motor neurons",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "What kind of molecule is the provirus of HEV (Hepatitis E Virus)?",
      options: [
        "single-stranded RNA",
        "double-stranded DNA",
        "a protein",
        "a complex carbohydrate",
      ],
      correctAnswer: 1,
    },
    {
      question: "What substance controls viral infections like hepatitis?",
      options: ["Antibiotics", "Histamines", "Interferon", "Glucagon"],
      correctAnswer: 2,
    },
    {
      question:
        'What does the term "filterable nature" of a virus, as described by early scientists, mean?',
      options: [
        "It can be seen with a light microscope",
        "It can pass through filters that block bacteria",
        "It dissolves in water",
        "It crystallizes easily",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Adenovirus and Herpes virus are examples of which type of virus?",
      options: [
        "ssRNA viruses",
        "dsRNA viruses",
        "ssDNA viruses",
        "dsDNA viruses",
      ],
      correctAnswer: 3,
    },
    {
      question: "Which of these is NOT a function of the viral capsid?",
      options: [
        "Protecting the genome",
        "Determining antigenic specificity",
        "Aiding in attachment",
        "Synthesizing viral proteins",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "What is the role of Coenzyme Q in the electron transport chain?",
      options: [
        "It is the final electron acceptor",
        "It pumps protons into the lumen",
        "It accepts electrons from NADH and FADH₂",
        "It synthesizes ATP",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The fact that glycolysis enzymes are in the cytoplasm explains why...",
      options: [
        "It requires oxygen",
        "It produces a large amount of ATP",
        "It occurs in the cytoplasm",
        "It is the final stage of respiration",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which statement about the relationship between C and B in the respiratory chain (B, C, A, A3) is correct?",
      options: [
        "B oxidizes C",
        "C oxidizes B",
        "They do not interact",
        "B and C reduce each other",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What cellular process is directly driven by the proton gradient created by the ETC?",
      options: [
        "Glycolysis",
        "Krebs cycle",
        "Chemiosmosis (ATP synthesis)",
        "Fermentation",
      ],
      correctAnswer: 2,
    },
    {
      question: 'The term "provirus" refers to...',
      options: [
        "A virus before it becomes infectious",
        "Viral genetic material integrated into the host genome",
        "The protein shell of a virus",
        "A virus that infects bacteria",
      ],
      correctAnswer: 1,
    },
    {
      question: 'If a virus is "naked," what does it lack?',
      options: ["A capsid", "Nucleic acid", "An envelope", "Spikes"],
      correctAnswer: 2,
    },
    // Adding more variations to reach over 100
    {
      question: "What is the size of the Pox virus relative to other viruses?",
      options: [
        "It is the smallest virus",
        "It is average-sized",
        "It is the largest virus",
        "Its size is unknown",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which disease did Edward Jenner develop a vaccine for?",
      options: ["Rabies", "Smallpox", "Cholera", "Anthrax"],
      correctAnswer: 1,
    },
    {
      question:
        "What was a key finding of Ivanovsky regarding the Tobacco Mosaic Virus (TMV)?",
      options: [
        "It was a type of bacteria",
        "It was not infectious",
        "It demonstrated a filterable nature",
        "It could be killed by heat",
      ],
      correctAnswer: 2,
    },
    {
      question: "Viroids are infectious agents primarily found in:",
      options: ["Animals", "Bacteria", "Plants", "Fungi"],
      correctAnswer: 2,
    },
    {
      question:
        "The Polio virus, which is circular and naked, has what type of genome?",
      options: ["dsDNA", "ssDNA", "RNA", "Protein"],
      correctAnswer: 2,
    },
    {
      question: "The adenovirus has which characteristic shape?",
      options: ["Helical", "Enveloped", "Polyhedral", "Complex"],
      correctAnswer: 2,
    },
    {
      question:
        "Which of the following viruses contains a double-stranded RNA (dsRNA) genome?",
      options: ["Herpes virus", "Reovirus", "Influenza virus", "Parvovirus"],
      correctAnswer: 1,
    },
    {
      question: "The enzyme reverse transcriptase is NOT found in which virus?",
      options: ["Retrovirus", "Hepatitis B", "HIV", "Influenza"],
      correctAnswer: 3,
    },
    {
      question: "The host provides which component for an enveloped virus?",
      options: [
        "The capsid",
        "The nucleic acid",
        "The envelope",
        "The matrix protein",
      ],
      correctAnswer: 2,
    },
    {
      question: "The GP41 and GP120 spikes are characteristic of which virus?",
      options: ["Influenza", "Bacteriophage", "HIV", "Hepatitis A"],
      correctAnswer: 2,
    },
    {
      question:
        "What is the yield of ATP from one molecule of FADH₂ compared to one molecule of NADH₂?",
      options: [
        "It yields more ATP",
        "It yields less ATP",
        "It yields the same amount",
        "FADH₂ does not yield ATP",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Why do erythrocytes (red blood cells) not perform oxidative phosphorylation?",
      options: [
        "They lack a nucleus",
        "They lack mitochondria",
        "They lack cytoplasm",
        "They lack a cell membrane",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "G3P is a key intermediate that can form all of the following EXCEPT:",
      options: [
        "Glucose",
        "Phosphate",
        "Chloroplast components",
        "Amino acids",
      ],
      correctAnswer: 3,
    },
    {
      question: "Why does glycolysis occur in the cytoplasm?",
      options: [
        "It requires mitochondria",
        "The necessary enzymes are located there",
        "It is an aerobic process",
        "It needs a high oxygen concentration",
      ],
      correctAnswer: 1,
    },
    {
      question: "The process of a kinase enzyme involves:",
      options: [
        "Joining two molecules",
        "Cutting DNA",
        "Transferring a phosphate group",
        "Building a polymer",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which statement accurately describes the first step of the electron transport chain?",
      options: [
        "Oxygen accepts electrons",
        "Coenzyme Q accepts electrons from NADH and FADH₂",
        "ATP is synthesized",
        "Water is split",
      ],
      correctAnswer: 1,
    },
    {
      question: "The provirus of HIV is what type of molecule?",
      options: ["ssRNA", "dsDNA", "Protein", "Lipid"],
      correctAnswer: 1,
    },
    {
      question: "What is the primary role of interferons in the body?",
      options: [
        "To digest food",
        "To transport oxygen",
        "To control viral infections",
        "To regulate blood sugar",
      ],
      correctAnswer: 2,
    },
    {
      question:
        'Which scientist is associated with the postulate "Viruses are soluble living germs"?',
      options: [
        "Louis Pasteur",
        "Wendell Stanley",
        "Ivanovsky",
        "Edward Jenner",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is a defining characteristic of a retrovirus?",
      options: [
        "It has a DNA genome",
        "It only infects plants",
        "It uses reverse transcription",
        "It has a complex, multi-layered capsid",
      ],
      correctAnswer: 2,
    },
    {
      question: "A viral envelope is sensitive to what environmental factor?",
      options: ["Darkness", "Cold temperatures", "High pressure", "Sunlight"],
      correctAnswer: 3,
    },
    {
      question:
        "In the respiratory chain sequence (B, C, A, A3), what does A oxidize?",
      options: ["B", "C", "A3", "Nothing"],
      correctAnswer: 1,
    },
    {
      question:
        "What is the main outcome of anaerobic respiration (like glycolysis alone) compared to aerobic respiration?",
      options: [
        "More ATP is produced",
        "Far less ATP is produced",
        "Pyruvate is fully oxidized",
        "Oxygen is used as an electron acceptor",
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
