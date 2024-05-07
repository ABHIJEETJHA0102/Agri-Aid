

const ppup = document.querySelector('.chat-popup2');
const chatBitn = document.querySelector('.startButton');


chatBitn.addEventListener('click', ()=>{
    ppup.classList.toggle('show');
})
// ================chat-box=========
const popup = document.querySelector('.chat-popup');
const chatBtn = document.querySelector('.chat-btn');
const submitBtn = document.querySelector('.submit');
const chatArea = document.querySelector('.chat-area');
const inputElm = document.querySelector('input');
const emojiBtn = document.querySelector('#emoji-btn');
const picker = new EmojiButton();


// Emoji selection  
window.addEventListener('DOMContentLoaded', () => {

    picker.on('emoji', emoji => {
      document.querySelector('input').value += emoji;
    });
  
    emojiBtn.addEventListener('click', () => {
      picker.togglePicker(emojiBtn);
    });
  });        

//   chat button toggler 

chatBtn.addEventListener('click', ()=>{
    popup.classList.toggle('show');
})

// send msg 
submitBtn.addEventListener('click', ()=>{
    let userInput = inputElm.value;

    let temp = `<div class="out-msg">
    <span class="my-msg">${userInput}</span>
    <img src="img/me.jpg" class="avatar">
    </div>`;

    chatArea.insertAdjacentHTML("beforeend", temp);
    inputElm.value = '';
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to send message');
      }
    })
    .then(data => {
      // Create a new message element for the chatbot's response
      console.log(data);
      const botMessageElement = document.createElement('div');
      botMessageElement.classList.add('income-msg');
      botMessageElement.innerHTML = `
        <img src="pics/stefan-stefancik-QXevDflbl8A-unsplash.jpg" class="avatar" alt="">
        <span class="msg">${data}</span>
      `;

      // Append the chatbot's message to the chat area
      chatArea.appendChild(botMessageElement);

      // Scroll to the bottom of the chat area
      chatArea.scrollTop = chatArea.scrollHeight;
    })
    .catch(error => {
      console.error('Error:', error);
    });

})
// ==================voice input=================
const startButton = document.getElementById('startButton');
const output = document.getElementById('output');

// Check if the Web Speech API is supported
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    output.textContent = 'Listening...';
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }

    output.textContent = transcript;
    if(transcript){
      recognition.stop();
      fetch(`/voice-input?transcript=${encodeURIComponent(transcript)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Response from backend:', data);
        // Convert the response string into speech
        const utterance = new SpeechSynthesisUtterance(data);
        speechSynthesis.speak(utterance);
        // Stop the speech recognition after the backend request is completed
        // recognition.stop();
      })
      .catch(error => {
        console.error('Error:', error);
        // Stop the speech recognition in case of an error
        recognition.stop();
      });
    }
    // Send the transcript as a GET request to the backend
  };

  recognition.onend = () => {
    output.textContent = 'Stopped listening.';
  };

  startButton.addEventListener('click', () => {
    recognition.start();
  }, { once: true });
} else {
  output.textContent = 'Web Speech API is not supported in this browser.';
}
/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')
// =============upload button==========
const fileInput = document.getElementById("file-upload");
const fileNameDiv = document.querySelector(".file-name");

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  if (files.length > 0) {
    const fileName = files[0].name;
    fileNameDiv.textContent = fileName;
  } else {
    fileNameDiv.textContent = "";
  }
});
// ========================apply ml===========
// Select the form element
async function predict(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Select the form element
    const form = document.querySelector('form');

    // Serialize form data into FormData object
    const formData = new FormData(form);
    
    // Send form data via AJAX
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Handle response
        if(response.ok){
            console.log(response);
            return response.json();
        }
        else{
            throw new Error("Response not ok!!");
        }
    })
    .then(data=>{

        // console.log(data);
        const jsonData = data.message; // Parse the JSON string if needed
        console.log(jsonData);
        document.getElementById('result3').innerHTML=data.prediction;
        document.getElementById('result2').innerHTML=jsonData;
    })
    .catch(error => {
        // Handle error
        console.error('Error submitting form:', error);
    });
};

// Select the form element
const form = document.querySelector('form');

// Add an event listener for form submission
form.addEventListener('submit', predict);

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

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
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

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

sr.reveal(`.steps__card, .footer`,{interval: 100})