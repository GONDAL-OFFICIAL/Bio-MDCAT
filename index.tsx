document.addEventListener('DOMContentLoaded', () => {
    const biologyBtn = document.getElementById('biology-btn');
    const biologySubButtons = document.getElementById('biology-sub-buttons');

    if (biologyBtn && biologySubButtons) {
        biologyBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the link from navigating
            biologySubButtons.classList.toggle('show');
        });
    }
});
