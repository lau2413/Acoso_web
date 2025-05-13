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
  let isTransitioning = false;
  
  function showSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const currentActive = document.querySelector('.hero-slider .slide.active');
    if (currentActive) {
      currentActive.classList.remove('active');
    }
    
    // Pequeña pausa para asegurar que la transición sea suave
    requestAnimationFrame(() => {
      slides[index].classList.add('active');
      setTimeout(() => {
        isTransitioning = false;
      }, 800); // Coincide con la duración de la transición CSS
    });
  }
  
  function nextSlide() {
    if (isTransitioning) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  function prevSlide() {
    if (isTransitioning) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
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
      if (!isTransitioning) {
        interval = setInterval(nextSlide, slideInterval);
      }
    });
    
    // Opcional: Agregar navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
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
  
  // Iniciar slider si estamos en la página principal
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    setupSlider();
  }
  
  // Configurar pánico si estamos en la página principal
  console.log('Configurando botón de pánico...');
  const botonPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  if (botonPanico && modalEmergencia) {
    console.log('Botón de pánico y modal encontrados, inicializando...');
    setupPanico();
  } else {
    console.log('Página actual no requiere configuración de pánico');
  }
  
  // Configurar otras funcionalidades solo si los elementos existen
  const registroForm = document.querySelector('#registro-form');
  if (registroForm) {
    console.log('Inicializando registro...');
    setupRegistro();
  }

  const contactoForm = document.querySelector('#contacto-emergencia-form');
  if (contactoForm) {
    console.log('Inicializando contacto de emergencia...');
    setupContacto();
  }

  const encuestaForm = document.querySelector('#formulario-encuesta');
  if (encuestaForm) {
    console.log('Inicializando encuesta...');
    setupEncuesta();
  }

  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    console.log('Inicializando navegación...');
    setupNavegacion();
  }

  const loginForm = document.querySelector('#formulario_login');
  if (loginForm) {
    console.log('Inicializando login...');
    LogIn();
  }
  
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
