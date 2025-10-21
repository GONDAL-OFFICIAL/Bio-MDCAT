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
    // Musculoskeletal System (Original 46 Questions)
    {
      question: "What is the term for the shaft of a long bone?",
      options: ["Epiphysis", "Diaphysis", "Periosteum", "Marrow"],
      correctAnswer: 1,
    },
    {
      question:
        "The end of a long bone, which articulates with other bones, is known as the:",
      options: ["Diaphysis", "Endosteum", "Epiphysis", "Metaphysis"],
      correctAnswer: 2,
    },
    {
      question:
        "A group of muscle cells (fibers) are bundled together to form a:",
      options: ["Myofibril", "Muscle fascicle", "Sarcomere", "Thick filament"],
      correctAnswer: 1,
    },
    {
      question:
        "Regarding its composition, bone has more collagen compared to many tissues but is:",
      options: [
        "More elastic",
        "Less elastic",
        "Equally elastic",
        "Not elastic at all",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which type of bone cells are responsible for forming new bone tissue and are generally uninucleated?",
      options: ["Osteoclasts", "Osteocytes", "Chondrocytes", "Osteoblasts"],
      correctAnswer: 3,
    },
    {
      question:
        "Which bone cells are large, multinucleated, and responsible for dissolving and breaking down bone tissue?",
      options: ["Osteocytes", "Osteoclasts", "Osteoblasts", "Chondroblasts"],
      correctAnswer: 1,
    },
    {
      question:
        "Mature bone cells that are trapped in the matrix and maintain bone tissue are called:",
      options: ["Osteoblasts", "Osteoclasts", "Osteocytes", "Stem cells"],
      correctAnswer: 2,
    },
    {
      question:
        "Which part of the bone marrow is primarily involved in the formation of blood cells?",
      options: ["Yellow marrow", "White marrow", "Red marrow", "Spongy marrow"],
      correctAnswer: 2,
    },
    {
      question: "What is the primary function of yellow bone marrow?",
      options: [
        "Blood cell formation",
        "Calcium storage",
        "Fat storage",
        "Hormone production",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The delicate connective tissue layer that surrounds each individual muscle cell (fiber) is the:",
      options: ["Perimysium", "Epimysium", "Endomysium", "Periosteum"],
      correctAnswer: 2,
    },
    {
      question:
        "A muscle fascicle (a bundle of muscle fibers) is wrapped by which connective tissue layer?",
      options: ["Epimysium", "Perimysium", "Endomysium", "Perichondrium"],
      correctAnswer: 1,
    },
    {
      question:
        "The entire muscle is surrounded by a dense outer covering known as the:",
      options: ["Epimysium", "Perimysium", "Fascia", "Endomysium"],
      correctAnswer: 0,
    },
    {
      question:
        "What is the name of the tough membrane that covers the outer surface of a bone?",
      options: ["Perichondrium", "Epimysium", "Periosteum", "Endosteum"],
      correctAnswer: 2,
    },
    {
      question:
        "The connective tissue membrane that surrounds cartilage is called the:",
      options: [
        "Periosteum",
        "Perichondrium",
        "Endomysium",
        "Synovial membrane",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the typical diameter of a cylindrical muscle cell?",
      options: ["1–2 µm", "7–8 µm", "10–100 µm", "16 µm"],
      correctAnswer: 2,
    },
    {
      question:
        "Which two substances are stored in high quantities in muscle cells for energy and oxygen-binding, respectively?",
      options: [
        "ATP and Hemoglobin",
        "Glycogen and Myoglobin",
        "Glucose and Cytochrome",
        "Creatine and Actin",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The contractile elements within a muscle cell, which are about 1–2 µm in diameter, are known as:",
      options: ["Sarcomeres", "Fascicles", "Myofibrils", "Filaments"],
      correctAnswer: 2,
    },
    {
      question:
        "A thick filament in a muscle cell, composed of myosin, is approximately how thick?",
      options: ["1–2 nm", "7–8 nm", "16 nm", "100 nm"],
      correctAnswer: 2,
    },
    {
      question:
        "A thin filament is made of two chains of actin and which other key proteins?",
      options: [
        "Myosin and Titin",
        "Tropomyosin and Troponin",
        "Myoglobin and Glycogen",
        "Collagen and Elastin",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the approximate thickness of a thin (actin) filament?",
      options: ["16 nm", "100 µm", "1-2 nm", "7–8 nm"],
      correctAnswer: 3,
    },
    {
      question:
        "The contractile protein myosin is composed of two polypeptide chains that form:",
      options: [
        "A double helix",
        "A spherical shape",
        "Globular heads",
        "A flat sheet",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Cartilage is a type of connective tissue whose living cells are called:",
      options: ["Osteocytes", "Chondrocytes", "Fibroblasts", "Adipocytes"],
      correctAnswer: 1,
    },
    {
      question: "Which type of cartilage is typically found in growing bones?",
      options: [
        "Elastic cartilage",
        "Fibrocartilage",
        "Hyaline cartilage",
        "Calcified cartilage",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "A unique feature of cardiac muscle cells are the specialized junctions that connect them, known as:",
      options: [
        "Sarcomeres",
        "Intercalated discs",
        "Z-lines",
        "Tight junctions",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "In the arrangement of myofilaments, one thick filament is directly surrounded by how many thin filaments?",
      options: ["Two", "Four", "Six", "Eight"],
      correctAnswer: 2,
    },
    {
      question:
        "Through metabolic activity, muscles are responsible for producing about what percentage of the body’s heat?",
      options: ["25%", "50%", "85%", "99%"],
      correctAnswer: 2,
    },
    {
      question:
        "During muscle contraction, what happens to the length of the filaments themselves?",
      options: [
        "They shorten",
        "They lengthen",
        "They do not change",
        "Only thick filaments shorten",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which band within the sarcomere shortens during muscle contraction?",
      options: ["A-band", "H-zone", "I-band", "Both A-band and I-band"],
      correctAnswer: 2,
    },
    {
      question:
        "Which band within the sarcomere remains unchanged in length during muscle contraction?",
      options: ["I-band", "A-band", "H-zone", "Z-line to Z-line distance"],
      correctAnswer: 1,
    },
    {
      question:
        "Muscles that move a body part toward the midline are known as:",
      options: [
        "Abductor muscles",
        "Adductor muscles",
        "Flexor muscles",
        "Extensor muscles",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which type of muscle is responsible for moving a body part away from the midline?",
      options: [
        "Adductor muscles",
        "Abductor muscles",
        "Rotator muscles",
        "Pronator muscles",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The joints between the phalanges in the hand (interphalangeal joints) are examples of which type of joint?",
      options: [
        "Ball-and-socket joint",
        "Pivot joint",
        "Saddle joint",
        "Hinge joint",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "A hinge joint, like the elbow or knee, allows for which two movements?",
      options: [
        "Rotation and circumduction",
        "Flexion and extension",
        "Abduction and adduction",
        "Protraction and retraction",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What is the specific name for the joint between teeth and their sockets in the jawbone?",
      options: ["Syndesmosis", "Suture", "Gomphosis", "Synchondrosis"],
      correctAnswer: 2,
    },
    {
      question:
        "A joint where long bones like the tibia and fibula are held together by fibrous tissue is called:",
      options: ["Gomphosis", "Symphysis", "Syndesmosis", "Suture"],
      correctAnswer: 2,
    },
    {
      question:
        "Gouty arthritis is an inflammatory disorder caused by the deposition of what in the joints?",
      options: [
        "Calcium phosphate crystals",
        "Cholesterol plaques",
        "Uric acid crystals",
        "Synovial fluid",
      ],
      correctAnswer: 2,
    },
    {
      question:
        'Which type of arthritis is described as a chronic, degenerative "wear-and-tear" condition?',
      options: [
        "Rheumatoid arthritis",
        "Gouty arthritis",
        "Osteoarthritis",
        "Psoriatic arthritis",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Rheumatoid arthritis is different from other forms because it is a(n):",
      options: [
        "Infectious disorder",
        "Autoimmune disorder",
        "Genetic disorder",
        "Degenerative disorder",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The hardness and rigidity of bone is primarily due to mineral salts, mainly in the form of:",
      options: [
        "Calcium carbonate",
        "Sodium chloride",
        "Potassium iodide",
        "Calcium phosphate (hydroxyapatite)",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "The term 'harelip' is an older name for which congenital condition?",
      options: ["Microcephaly", "Cleft palate", "Cleft lip", "Spina bifida"],
      correctAnswer: 2,
    },
    {
      question: "The biological process of forming new cartilage is called:",
      options: ["Osteogenesis", "Chondrogenesis", "Myogenesis", "Angiogenesis"],
      correctAnswer: 1,
    },
    {
      question:
        "A genetic defect that results in an abnormally small head and brain is known as:",
      options: ["Hydrocephalus", "Macrocephaly", "Microcephaly", "Anencephaly"],
      correctAnswer: 2,
    },
    {
      question:
        "Thick filaments (myosin) are found exclusively within which band of a sarcomere?",
      options: ["I-band", "A-band", "Z-disc", "H-zone only"],
      correctAnswer: 1,
    },
    {
      question:
        "Thin filaments (actin) extend across which parts of the sarcomere?",
      options: [
        "Only the A-band",
        "Only the I-band",
        "Parts of both the I and A bands",
        "Only the H-zone",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What molecule serves as the primary source of immediate, temporary energy for muscle contraction?",
      options: ["ATP", "Glucose", "Glycogen", "Phosphocreatine"],
      correctAnswer: 3,
    },
    {
      question:
        "In muscle cells, the Sarcoplasmic Endoplasmic Reticulum (SER) functions as the main storage site for which ion?",
      options: [
        "Sodium (Na+)",
        "Potassium (K+)",
        "Calcium (Ca2+)",
        "Magnesium (Mg2+)",
      ],
      correctAnswer: 2,
    },

    // --- Reproductive System Questions ---
    {
      question:
        "What is the correct path of sperm maturation starting from the rete testis?",
      options: [
        "Rete testis → Epididymis → Vas deferens → Urethra",
        "Rete testis → Vasa efferentia → Epididymis → Vas deferens",
        "Seminiferous tubules → Rete testis → Vas deferens → Epididymis",
        "Epididymis → Vas deferens → Vasa efferentia → Rete testis",
      ],
      correctAnswer: 1,
    },
    {
      question: "Where are sperms primarily stored?",
      options: [
        "Seminiferous tubules",
        "Vas deferens",
        "Epididymis",
        "Rete testis",
      ],
      correctAnswer: 2,
    },
    {
      question: "Spermatogenesis, the formation of sperms, occurs in the:",
      options: [
        "Interstitial cells",
        "Germinal epithelium",
        "Epididymis",
        "Prostate gland",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which cells are located inside the seminiferous tubules and release inhibins to regulate spermatogenesis?",
      options: [
        "Leydig cells",
        "Spermatogonia",
        "Interstitial cells",
        "Sertoli cells",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Testosterone is produced by which cells located between the seminiferous tubules?",
      options: [
        "Sertoli cells",
        "Germinal cells",
        "Interstitial (Leydig) cells",
        "Spermatids",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "In the male reproductive system, Follicle-Stimulating Hormone (FSH) acts on _______, while Luteinizing Hormone (LH) acts on _______.",
      options: [
        "Leydig cells, Sertoli cells",
        "Sertoli cells, Leydig cells",
        "Testes, Prostate",
        "Epididymis, Testes",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which of the following glands in the male reproductive system is unpaired?",
      options: [
        "Seminal vesicles",
        "Bulbourethral glands",
        "Cowper’s glands",
        "Prostate gland",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "The seminal vesicles secrete an alkaline fluid containing _______, which provides nutrition for sperm.",
      options: ["Glucose", "Fructose", "Citric acid", "Prostaglandins"],
      correctAnswer: 1,
    },
    {
      question:
        "What is the function of the fluid from the bulbourethral (Cowper’s) glands?",
      options: [
        "To provide nutrition to sperm",
        "To produce testosterone",
        "To clean the urethra before ejaculation",
        "To cause sperm maturation",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What is the approximate number of sperms produced daily in a healthy adult male?",
      options: [
        "10-20 million",
        "50-100 million",
        "200-300 million",
        "500-600 million",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What is the correct pathway for an ovum after it is released from the ovary?",
      options: [
        "Ovary → Uterus → Uterine tube → Vagina",
        "Ovary → Cervix → Uterus → Uterine tube",
        "Ovary → Uterine tube → Uterus → Cervix → Vagina",
        "Ovary → Vagina → Cervix → Uterus",
      ],
      correctAnswer: 2,
    },
    {
      question: "The birth canal is formed by the:",
      options: [
        "Uterus and uterine tube",
        "Cervix and vagina",
        "Ovary and uterus",
        "Fallopian tube and cervix",
      ],
      correctAnswer: 1,
    },
    {
      question: "Fertilization of the ovum by a sperm typically occurs in the:",
      options: ["Uterus", "Ovary", "Vagina", "Oviduct (Fallopian tube)"],
      correctAnswer: 3,
    },
    {
      question:
        "The implantation of the fertilized egg (blastocyst) occurs in which structure?",
      options: ["Cervix", "Oviduct", "Uterus", "Ovary"],
      correctAnswer: 2,
    },
    {
      question: "The placenta is a complex organ formed from:",
      options: [
        "Fetal tissue only",
        "Maternal uterine tissue only",
        "Both fetal and maternal tissue",
        "The corpus luteum",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "Which layer of the uterus is the thickest, innermost layer that is shed during menstruation?",
      options: ["Myometrium", "Perimetrium", "Epimetrium", "Endometrium"],
      correctAnswer: 3,
    },
    {
      question: "A surge in which hormone directly triggers ovulation?",
      options: ["FSH", "Estrogen", "Progesterone", "LH"],
      correctAnswer: 3,
    },
    {
      question:
        "After ovulation, the ruptured follicle develops into a yellow glandular structure called the:",
      options: [
        "Corpus albicans",
        "Graafian follicle",
        "Corpus luteum",
        "Primary follicle",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The corpus luteum primarily secretes _______, which prepares the uterus for implantation.",
      options: ["Estrogen", "Progesterone", "FSH", "LH"],
      correctAnswer: 1,
    },
    {
      question:
        "High levels of which hormone indicate that the mid-secretory phase of the menstrual cycle is occurring?",
      options: ["Progesterone", "Estrogen", "FSH", "Oxytocin"],
      correctAnswer: 0,
    },
    {
      question:
        "A sharp decline in which hormone leads to the breakdown of the endometrium and the onset of menstruation?",
      options: ["Estrogen", "Progesterone", "FSH", "LH"],
      correctAnswer: 1,
    },
    {
      question: "The process of oogenesis (egg formation) in females begins:",
      options: [
        "At puberty",
        "During childhood",
        "Before birth",
        "During the first menstrual cycle",
      ],
      correctAnswer: 2,
    },
    {
      question: "The second meiotic division of the oocyte is completed:",
      options: [
        "Just before ovulation",
        "At puberty",
        "Only after fertilization",
        "Before birth",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The strong muscular contractions of the uterus during labor are caused by the hormone _______ acting on the _______.",
      options: [
        "Progesterone, Endometrium",
        "Estrogen, Perimetrium",
        "Oxytocin, Myometrium",
        "Prolactin, Cervix",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The oocyte is released from the ovary during ovulation at which stage of meiosis?",
      options: ["Prophase I", "Metaphase I", "Prophase II", "Metaphase II"],
      correctAnswer: 3,
    },
    {
      question:
        "Which of the following animals is an induced ovulator, meaning ovulation occurs only after mating?",
      options: ["Human", "Pigeon", "Rabbit", "Dog"],
      correctAnswer: 2,
    },
    // --- Newly Added Questions for Completeness ---
    {
      question:
        "What is the approximate thickness ratio of a thick (myosin) filament to a thin (actin) filament?",
      options: ["1:1", "2:1", "4:1", "6:1"],
      correctAnswer: 1,
    },
    {
      question: "The bones that form the palm of the hand are the:",
      options: ["Phalanges", "Tarsals", "Metacarpals", "Carpals"],
      correctAnswer: 2,
    },
    {
      question:
        "The shoulder girdle, which connects the arm to the main skeleton, is formed by which two bones?",
      options: [
        "Humerus and Sternum",
        "Clavicle and Scapula",
        "Ribs and Clavicle",
        "Humerus and Scapula",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which of the following is identified in study materials as a degenerative disorder?",
      options: [
        "Microcephaly",
        "Chondrogenesis",
        "Gomphosis",
        "Arteochloresis",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "The testis is internally divided into how many lobules containing seminiferous tubules?",
      options: ["50-100", "100-200", "250-300", "400-500"],
      correctAnswer: 2,
    },
    {
      question:
        "Besides releasing inhibins, a key function of Sertoli cells is to:",
      options: [
        "Produce testosterone",
        "Perform negative feedback on spermiogenesis",
        "Stimulate LH release",
        "Store mature sperm",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "A primary function of testosterone produced by Leydig cells is the:",
      options: [
        "Nourishing of sperm cells",
        "Initiation of ovulation",
        "Development of secondary sexual characters",
        "Cleaning of the urethra",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The three accessory glands of the male reproductive system are the seminal vesicles, prostate gland, and:",
      options: [
        "Adrenal glands",
        "Pituitary glands",
        "Epididymis",
        "Bulbourethral glands",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Located below the urinary bladder, what is a key role of the prostate gland during ejaculation?",
      options: [
        "Provides fructose for sperm",
        "Secretes a cleaning fluid",
        "Stops urination",
        "Stores sperm",
      ],
      correctAnswer: 2,
    },
    {
      question: "The external male genitalia consist of the:",
      options: [
        "Testes and Vas deferens",
        "Penis and Testes",
        "Penis and Prostate gland",
        "Scrotum and Epididymis",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "The urethra in males passes just below which reproductive gland?",
      options: [
        "Seminal vesicle",
        "Bulbourethral gland",
        "Prostate gland",
        "Cowper's gland",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "The menstrual cycle is primarily regulated by which group of hormones?",
      options: [
        "Thyroid hormones",
        "Adrenal hormones",
        "Pituitary gonadotrophins (FSH & LH)",
        "Insulin and glucagon",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What is the primary role of FSH, and what is the fate of most follicles it stimulates?",
      options: [
        "Causes ovulation; they all mature",
        "Develops primary follicles; they degenerate by atresia",
        "Thickens the endometrium; they become corpus lutea",
        "Inhibits LH; they are stored for later",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which of the following is a key function of estrogen released by a growing follicle?",
      options: [
        "Inhibits LH",
        "Stimulates FSH",
        "Causes breakdown of the endometrium",
        "Repairs and vascularizes the endometrium",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "A high level of estrogen in the blood typically indicates that:",
      options: [
        "Menstruation is about to start",
        "Ovulation is about to occur",
        "Implantation has occurred",
        "The corpus luteum has formed",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "In the placenta, besides maintaining pregnancy, progesterone also aids in:",
      options: [
        "Fetal sex determination",
        "Lactation",
        "Uterine contractions for birth",
        "Sperm capacitation",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "By the end of the third month, when major organs are formed, the developing embryo is called a:",
      options: ["Zygote", "Blastocyst", "Fetus", "Gamete"],
      correctAnswer: 2,
    },
    {
      question:
        "During which period of pregnancy can the sex of the fetus typically be determined?",
      options: [
        "First month",
        "Second month",
        "Between 4–8 months",
        "Ninth month",
      ],
      correctAnswer: 2,
    },
    {
      question: "The onset of birth (parturition) is marked by:",
      options: [
        "A drop in progesterone",
        "The start of lactation",
        "Labor pains and uterine contractions",
        "The formation of the placenta",
      ],
      correctAnswer: 2,
    },
    {
      question:
        'The delivery of the placenta, or "afterbirth," typically occurs how long after the baby is born?',
      options: ["Immediately", "5-10 minutes", "20–45 minutes", "1-2 hours"],
      correctAnswer: 2,
    },
    {
      question:
        "At which specific site on the ovum does the sperm typically enter during fertilization?",
      options: [
        "The vegetal pole",
        "The animal pole",
        "Anywhere on the zona pellucida",
        "The corona radiata",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "During ovulation, a secondary oocyte is released from a mature follicle known as the:",
      options: [
        "Corpus luteum",
        "Primary follicle",
        "Graafian follicle",
        "Corpus albicans",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What is the primary function of gonads, such as the ovaries and testes?",
      options: [
        "To produce regulatory hormones",
        "To secrete sex cells (gametes)",
        "To support a developing fetus",
        "To filter waste from the blood",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Approximately how long after fertilization does implantation of the blastocyst into the uterine wall occur?",
      options: ["1 day", "3 days", "7 days", "14 days"],
      correctAnswer: 2,
    },
    {
      question:
        "In females, the process of meiosis to produce a gamete occurs during:",
      options: ["Gametogenesis", "Menstruation", "Implantation", "Parturition"],
      correctAnswer: 0,
    },
    {
      question:
        "The menstrual, follicular, ovulation, and luteal phases are the four stages of the:",
      options: [
        "Fertilization process",
        "Menstrual cycle",
        "Gametogenesis",
        "Embryonic development",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which of the following animals has only one functional ovary that is active at a given time?",
      options: ["Rabbit", "Human", "Pigeon", "Cat"],
      correctAnswer: 2,
    },
    {
      question:
        "Graafian cells, which are part of primary follicles, are also known as:",
      options: ["Sertoli cells", "Leydig cells", "Granulosa cells", "Oogonia"],
      correctAnswer: 2,
    },
    {
      question:
        "The ovum is enclosed by two protective layers, the zona pellucida and the:",
      options: [
        "Theca interna",
        "Corona radiata",
        "Myometrium",
        "Corpus albicans",
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

  startBtn.addEventListener("click", startTest);
  nextBtn.addEventListener("click", handleNextQuestion);
  retakeWrongBtn.addEventListener("click", retakeWrongQuestions);

  const init = () => {
    loadQuestions();
    showScreen("setup");
  };

  init();
});
