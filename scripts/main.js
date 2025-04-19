// Supdabase conexión y bcrypt para encriptar contraseñas
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
import bcrypt from 'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/+esm';

const supabaseUrl = 'https://vzqhafehwzfviqprwvbf.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cWhhZmVod3pmdmlxcHJ3dmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTM1NjgsImV4cCI6MjA2MDU4OTU2OH0.5YJvlpdAS-mUpnor0V2SHwj3yHTzkExyKHtG1w1WFAI'; 
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada correctamente');

  // BOTÓN DE PÁNICO 
  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const btnLeve = document.getElementById('btn-leve');
  const btnGrave = document.getElementById('btn-grave');
  const cerrarModal = document.getElementById('cerrar-modal');

  const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";

  btnPanico?.addEventListener('click', () => modalEmergencia?.classList.remove('hidden'));
  cerrarModal?.addEventListener('click', () => modalEmergencia?.classList.add('hidden'));

  btnLeve?.addEventListener('click', () => {
    modalEmergencia.classList.add('hidden');
    setTimeout(() => {
      alert(`⚠️ Alerta de acoso leve enviada.\n${nombreUsuario}, tu contacto ha sido notificado.`);
      window.location.href = 'index.html';
    }, 200);
  });

  btnGrave?.addEventListener('click', () => {
    modalEmergencia.classList.add('hidden');
    setTimeout(() => {
      alert(`🚨 Acoso grave reportado.\n${nombreUsuario}, tu contacto y las autoridades han sido notificados.`);
      window.location.href = 'index.html';
    }, 200);
  });

  // PASO 1: FORMULARIO REGISTRO USUARIO 
  const formRegistro = document.getElementById('registro-form');
  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const contrasena = document.getElementById('contrasena').value.trim();

      if (!nombre || !email || !telefono || !contrasena) return alert("Por favor completa todos los campos.");
      if (!/^\d{10}$/.test(telefono)) return alert("El teléfono debe tener exactamente 10 dígitos.");

      const hash = bcrypt.hashSync(contrasena, 10);

      // Guardar en localStorage
      localStorage.setItem('nombreUsuario', nombre);
      localStorage.setItem('correoUsuario', email);
      localStorage.setItem('telefonoUsuario', telefono);
      localStorage.setItem('contrasenaUsuario', hash);

      window.location.href = "contactos.html";
    });
  }

  // PASO 2: CONTACTO DE EMERGENCIA 
  const formContacto = document.getElementById('contacto-emergencia-form');
  if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = formContacto["nombre-contacto"].value.trim();
      const telefono = formContacto["telefono-contacto"].value.trim();
      const relacion = formContacto["relacion-contacto"].value;

      if (!nombre || !telefono || !relacion) return alert("Por favor completa todos los campos.");
      if (!/^\d{10}$/.test(telefono)) return alert("El teléfono debe tener exactamente 10 dígitos.");

      localStorage.setItem('contactoNombre', nombre);
      localStorage.setItem('contactoTelefono', telefono);
      localStorage.setItem('contactoRelacion', relacion);

      alert(`${localStorage.getItem('nombreUsuario')}, tu contacto ha sido registrado.\nAhora completarás una breve encuesta.`);
      window.location.href = "encuesta.html";
    });
  }

  // PASO 3: FORMULARIO ENCUESTA 
  const formEncuesta = document.getElementById('encuesta-form');
  const avanzarBtn = document.getElementById('avanzar-btn');

  if (formEncuesta) {
    formEncuesta.addEventListener('change', () => {
      const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
      avanzarBtn.style.display = respuestasSeleccionadas.length === 10 ? "block" : "none";
    });

    formEncuesta.addEventListener('submit', async (event) => {
      event.preventDefault();

      const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
      if (respuestasSeleccionadas.length < 10) {
        alert('Por favor, responde todas las preguntas antes de enviar.');
        return;
      }

      try {
        const nombre = localStorage.getItem('nombreUsuario');
        const correo = localStorage.getItem('correoUsuario');
        const contrasena = localStorage.getItem('contrasenaUsuario');
        const telefono = localStorage.getItem('telefonoUsuario');
        const contactoNombre = localStorage.getItem('contactoNombre');
        const contactoTelefono = localStorage.getItem('contactoTelefono');
        const contactoRelacion = localStorage.getItem('contactoRelacion');

        // Insertar usuario
        
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .insert([{ nombre, correo, contrasena, telefono }])
          .select()
          .single();

        if (usuarioError) {
          console.error("Error al registrar:", usuarioError);
          alert("Error al registrar:\n" + (usuarioError?.message || JSON.stringify(usuarioError)));
          return
        }
        const id_usuario = usuarioData.id;

        // Insertar contacto
        const { error: contactoError } = await supabase
          .from('contactos')
          .insert([{
            id_usuario,
            nombre_contacto: contactoNombre,
            telefono_contacto: contactoTelefono,
            relacion: contactoRelacion
          }]);
        if (contactoError) throw contactoError;

        // Insertar respuestas
        const respuestas = Array.from(respuestasSeleccionadas).map(radio => ({
          id_usuario,
          id_pregunta: parseInt(radio.name.replace('q', '')),
          opcion: radio.value
        }));

        const { error: respuestaError } = await supabase.from('respuestas').insert(respuestas);
        if (respuestaError) throw respuestaError;

        // Finalizar
        localStorage.clear();
        alert('¡Gracias por completar la encuesta! Tu registro ha sido finalizado exitosamente.');
        window.location.href = 'index.html';

      } catch (err) {
        console.error('Error al registrar:', err);
        alert("Ocurrió un error al guardar los datos. Intenta más tarde.");
      }
    });
  }
});
