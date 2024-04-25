/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')
const kitIdForm = document.querySelector('.home__form');
/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

// =================get details=====
kitIdForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from being submitted
    findDetail();
});
async function findDetail(event) {
    // console.log("called")};
//   event.preventDefault(); // Prevent form from submitting normally

  const devId = document.getElementById('devId').value;
  const passwordError = document.getElementById('password-error');
//   document.getElementById('temp').textContent="hahaha";
  try {
      const response = await fetch(`/getByDeviceId/${devId}`);
      if (response.ok) {
          const results = await response.json();
          console.log(results);
          if (results.length>0) {
            console.log(results[results.length-1].temperature);
            document.getElementById('temp').textContent=results[results.length-1].temperature;
            document.getElementById('moisture').textContent=results[results.length-1].moisture;
            document.getElementById('ec').textContent=results[results.length-1].ec;
            document.getElementById('pH').textContent=results[results.length-1].pH;
            document.getElementById('N').textContent=results[results.length-1].N;
            document.getElementById('P').textContent=results[results.length-1].P;
            document.getElementById('K').textContent=results[results.length-1].K;
          } else {
              passwordError.textContent = "Incorrect Kit ID"; // Set error message
              passwordError.style.color = "red"; // Set error message color to red
          }
      } else {
          passwordError.textContent = "Incorrect Kit ID"; // Set error message
          passwordError.style.color = "red"; // Set error message color to red
      }
  } catch (error) {
      console.error('Error:', error);
      passwordError.textContent = "An error occurred. Please try again."; // Set error message
      passwordError.style.color = "red"; // Set error message color to red
  }
};
/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))



/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)





/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/


/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 400 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 400) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.home__data`)
sr.reveal(`.home__img`, {delay: 500})
sr.reveal(`.home__social`, {delay: 600})

sr.reveal(` .footer`,{interval: 100})