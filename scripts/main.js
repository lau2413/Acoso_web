// main.js
import { LogIn, updateSessionUI } from './auth.js';
import { supabase } from './supabase.js';
import { setupPanico } from './Panico.js';
import { setupRegistro } from './registro.js';
import { setupContacto } from './contacto.js';
import { setupEncuesta } from './encuesta.js';
import { setupNavegacion } from './navegacion.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada correctamente');

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

  updateSessionUI(); // solo si no causa problemas

  // Slider mejorado
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 segundos (puedes ajustar)

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Iniciar slider solo si hay slides
  if (slides.length > 0) {
    // Asegurarse que solo la primera slide tenga 'active' al inicio
    slides.forEach((slide, index) => {
      slide.classList.remove('active');
    });
    showSlide(currentSlide);
    
    // Configurar intervalo para cambio automático
    const sliderIntervalId = setInterval(nextSlide, slideInterval);
    
    // Opcional: Pausar el slider al hacer hover
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(sliderIntervalId);
      });
      
      sliderContainer.addEventListener('mouseleave', () => {
        sliderIntervalId = setInterval(nextSlide, slideInterval);
      });
    }
  }
});
