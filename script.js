document.addEventListener("DOMContentLoaded", () => {
  // Login elements
  const loginContainer = document.getElementById("login-container");
  const mainContainer = document.getElementById("main-container");
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  // App elements
  const biologyBtn = document.getElementById("biology-btn");
  const chemistryBtn = document.getElementById("chemistry-btn");
  const physicsBtn = document.getElementById("physics-btn");
  const biologyPage = document.getElementById("biology-page");
  const chemistryPage = document.getElementById("chemistry-page");
  const physicsPage = document.getElementById("physics-page");
  const backToMainBtn = document.getElementById("back-to-main-btn");
  const backToMainFromChemBtn = document.getElementById(
    "back-to-main-from-chem-btn"
  );
  const backToMainFromPhysicsBtn = document.getElementById(
    "back-to-main-from-physics-btn"
  );

  // Login Logic
  if (
    loginForm &&
    loginContainer &&
    mainContainer &&
    passwordInput &&
    errorMessage
  ) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      loginForm.classList.remove("shake-error");

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const correctPassword = `${hours}${minutes}`;

      const enteredPassword = passwordInput.value;

      if (enteredPassword === correctPassword) {
        sessionStorage.setItem("unlocked", "true");
        loginContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        mainContainer.classList.add("animate-in");
        errorMessage.textContent = "";
      } else {
        errorMessage.textContent = "Incorrect password. Please try again.";
        loginForm.classList.add("shake-error");
        passwordInput.value = "";
        passwordInput.focus();
      }
    });
  }

  // Navigation Logic
  // Biology Page
  if (biologyBtn && mainContainer && biologyPage) {
    biologyBtn.addEventListener("click", (event) => {
      event.preventDefault();
      mainContainer.classList.add("hidden");
      biologyPage.classList.remove("hidden");
      biologyPage.classList.add("animate-in");
    });
  }

  if (backToMainBtn && mainContainer && biologyPage) {
    backToMainBtn.addEventListener("click", (event) => {
      event.preventDefault();
      biologyPage.classList.add("hidden");
      mainContainer.classList.remove("hidden");
    });
  }

  // Chemistry Page
  if (chemistryBtn && mainContainer && chemistryPage) {
    chemistryBtn.addEventListener("click", (event) => {
      event.preventDefault();
      mainContainer.classList.add("hidden");
      chemistryPage.classList.remove("hidden");
      chemistryPage.classList.add("animate-in");
    });
  }

  if (backToMainFromChemBtn && mainContainer && chemistryPage) {
    backToMainFromChemBtn.addEventListener("click", (event) => {
      event.preventDefault();
      chemistryPage.classList.add("hidden");
      mainContainer.classList.remove("hidden");
    });
  }

  // Physics Page
  if (physicsBtn && mainContainer && physicsPage) {
    physicsBtn.addEventListener("click", (event) => {
      event.preventDefault();
      mainContainer.classList.add("hidden");
      physicsPage.classList.remove("hidden");
      physicsPage.classList.add("animate-in");
    });
  }

  if (backToMainFromPhysicsBtn && mainContainer && physicsPage) {
    backToMainFromPhysicsBtn.addEventListener("click", (event) => {
      event.preventDefault();
      physicsPage.classList.add("hidden");
      mainContainer.classList.remove("hidden");
    });
  }
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
