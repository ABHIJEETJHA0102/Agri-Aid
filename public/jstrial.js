// Check if the environment supports DOM operations
if (typeof document !== 'undefined') {
    const navMenu = document.getElementById('nav__menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav__close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }
} else {
    console.log("This code is not intended to run in a non-browser environment.");
}
