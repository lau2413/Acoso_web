// Importaciones
import { LogIn, updateSessionUI, checkSession } from './auth.js';
import { supabase } from './supabase.js';
import { setupPanico } from './Panico.js';
import { setupRegistro } from './registro.js';
import { setupContacto } from './contacto.js';
import { setupEncuesta } from './encuesta.js';
import { setupNavegacion } from './navegacion.js';

// Configuración del menú móvil
function setupMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  const header = document.querySelector('header');
  let lastScroll = 0;

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', 
        nav.classList.contains('active') ? 'true' : 'false'
      );
    });

    // Cerrar menú al hacer click en un enlace
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Efecto de scroll
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.style.boxShadow = '0 2px 20px rgba(106, 48, 147, 0.1)';
      return;
    }
    
    if (currentScroll > lastScroll) {
      // Scroll hacia abajo
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scroll hacia arriba
      header.style.transform = 'translateY(0)';
      header.style.boxShadow = '0 4px 30px rgba(106, 48, 147, 0.15)';
    }
    
    lastScroll = currentScroll;
  });
}

// Configuración del Slider
function setupSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 segundos
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  // Iniciar solo si hay slides
  if (slides.length > 0) {
    showSlide(0); // Mostrar primera slide
    
    // Configurar intervalo
    let interval = setInterval(nextSlide, slideInterval);
    
    // Pausar al hacer hover
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => clearInterval(interval));
    slider.addEventListener('mouseleave', () => {
      interval = setInterval(nextSlide, slideInterval);
    });
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Página cargada correctamente');
  
  // Verificar sesión primero
  await checkSession();
  
  // Iniciar menú móvil
  setupMobileMenu();
  
  // Iniciar slider
  setupSlider();
  
  // Configurar otras funcionalidades
  if (document.getElementById('boton-panico')) setupPanico();
  if (document.querySelector('#registro-form')) setupRegistro();
  if (document.querySelector('#contacto-emergencia-form')) setupContacto();
  if (document.querySelector('#formulario-encuesta')) setupEncuesta();
  if (document.querySelector('.nav-toggle')) setupNavegacion();
  if (document.querySelector('#formulario_login')) LogIn();
  
  // Actualizar UI de sesión
  await updateSessionUI();

  // Función para manejar la visibilidad de la contraseña - Mejorada
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const passwordInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
      const icon = this.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
});
