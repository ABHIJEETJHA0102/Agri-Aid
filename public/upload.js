/*=============== SHOW MENU ==========*/
const navMenu = document.getElementById('nav__menu'),navToggle = document.getElementById('nav__toggle'),navClose = document.getElementById('nav__close')

if(navToggle){
    navToggle.addEventListener('click',()=>{
        navMenu.classList.add('show-menu')
    })
}
if(navClose){
    navClose.addEventListener('click',()=>{
        navMenu.classList.remove('show-menu')
    })
}
/*=============== REMOVE MENU MOBILE ===============*/
const navLink= document.querySelectorAll('.nav__link')
const linkAction = ()=>{
    const navMenu= document.getElementById('nav__menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n=> n.addEventListener('click',linkAction))

/*=============== ADD BLUR TO HEADER ===============*/

const blurHeader =()=>{
    const header= document.getElementById('header')
    this.scrollY >=50 ? header.classList.add('blur-header')
                       : header.classList.remove('blur-header')
}
window.addEventListener('scroll', blurHeader)


const scrollUp =()=>{
    const scrollUp= document.getElementById('scroll-up')
    this.scrollY >=350 ? scrollUp.classList.add('show-scroll')
                       : scrollUp.classList.remove('show-scroll')
}


const sr = ScrollReveal({
    origin:'top',
    distance:'60px',
    duration:3000,
    delay:400,
     reset:true // animation repeat
})
sr.reveal(".home--data,.footer__container")


sr.reveal('.new__card',{interval:200})