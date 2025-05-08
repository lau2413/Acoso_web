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

  if (document.querySelector('.boton-panico')) {
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

  // Transición de imágenes en el slider
  const images = document.querySelectorAll('.slides img');
  let current = 0;

  function showSlide(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
  }

  if (images.length > 0) {
    showSlide(current); // mostrar la primera imagen al cargar
    setInterval(() => {
      current = (current + 1) % images.length;
      showSlide(current);
    }, 3000); // cambia cada 3 segundos
  }
});
