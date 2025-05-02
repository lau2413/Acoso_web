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

  setupPanico();
  setupRegistro();
  setupContacto();
  setupEncuesta();
  setupNavegacion();

  if (document.querySelector('#formulario_login')) {
    LogIn();
  }

  updateSessionUI();
});
