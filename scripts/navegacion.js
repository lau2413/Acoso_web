// navegacion.js
export function setupNavegacion() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
  
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }
  
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          nav.classList.remove('active');
        }
      });
    });
  
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
  
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
  }