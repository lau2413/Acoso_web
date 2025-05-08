// Importaciones
import { LogIn, updateSessionUI } from './auth.js';
import { supabase } from './supabase.js';
import { setupPanico } from './Panico.js';
import { setupRegistro } from './registro.js';
import { setupContacto } from './contacto.js';
import { setupEncuesta } from './encuesta.js';
import { setupNavegacion } from './navegacion.js';

// Función principal del slider con enlace clickable
function initializeSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentSlide = 0;
  const intervalTime = 5000; // Cambia cada 5 segundos
  let slideInterval;

  // Mostrar slide actual
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
  }

  // Avanzar al siguiente slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Iniciar el slider
  function startSlider() {
    showSlide(currentSlide);
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  // Pausar el slider al hacer hover (excepto en el slide clickable)
  const sliderContainer = document.querySelector('.hero-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    sliderContainer.addEventListener('mouseleave', () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, intervalTime);
    });
  }

  // Iniciar el slider
  startSlider();

  // Manejar clic en el slide de "Preguntas frecuentes" (alternativa al enlace HTML)
  const faqSlide = document.querySelector('.slide:nth-child(3)');
  if (faqSlide) {
    faqSlide.addEventListener('click', (e) => {
      // Evitar conflicto si ya hay un enlace
      if (!e.target.closest('a')) {
        window.location.href = 'informacion.html';
      }
    });
  }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada correctamente');

  // Iniciar slider
  initializeSlider();

  // Configurar funcionalidades
  if (document.getElementById('boton-panico')) {
    setupPanico();
  }

  if (document.querySelector('#registro-form')) {
    setupRegistro();
  }

  if (document.querySelector('#contacto-emergencia-form')) {
    setupContacto();
  }

  if (document.querySelector('#formulario-encuesta')) {
    setupEncuesta();
  }

  if (document.querySelector('.nav-toggle')) {
    setupNavegacion();
  }

  if (document.querySelector('#formulario_login')) {
    LogIn();
  }

  updateSessionUI(); // Actualizar estado de sesión si es necesario
});

  updateSessionUI();
});
