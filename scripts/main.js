// Importaciones
import { LogIn, updateSessionUI } from './auth.js';
import { supabase } from './supabase.js';
import { setupPanico } from './Panico.js';
import { setupRegistro } from './registro.js';
import { setupContacto } from './contacto.js';
import { setupEncuesta } from './encuesta.js';
import { setupNavegacion } from './navegacion.js';

// Función principal del slider
function initializeSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentSlide = 0;
  const intervalTime = 5000; // 5 segundos
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

  // Siguiente slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Iniciar slider
  function startSlider() {
    showSlide(currentSlide);
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  // Pausar al hacer hover
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

  startSlider();
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada correctamente');

  // Inicializar slider
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

  updateSessionUI();
});
