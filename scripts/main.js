// === Supabase Configuración ===
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://vzqhafehwzfviqprwvbf.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cWhhZmVod3pmdmlxcHJ3dmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTM1NjgsImV4cCI6MjA2MDU4OTU2OH0.5YJvlpdAS-mUpnor0V2SHwj3yHTzkExyKHtG1w1WFAI'; 
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada correctamente');

  // ========== BOTÓN DE PÁNICO ==========
  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const btnLeve = document.getElementById('btn-leve');
  const btnGrave = document.getElementById('btn-grave');
  const cerrarModal = document.getElementById('cerrar-modal');

  const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";

  if (btnPanico) {
    btnPanico.addEventListener('click', () => {
      modalEmergencia.classList.remove('hidden');
    });
  }

  if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
    });
  }

  if (btnLeve) {
    btnLeve.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
      setTimeout(() => {
        alert(`⚠️ Alerta de acoso leve enviada.\n${nombreUsuario}, tu contacto ha sido notificado.`);
        window.location.href = 'index.html';
      }, 200);
    });
  }

  if (btnGrave) {
    btnGrave.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
      setTimeout(() => {
        alert(`🚨 Acoso grave reportado.\n${nombreUsuario}, tu contacto y las autoridades han sido notificados.`);
        window.location.href = 'index.html';
      }, 200);
    });
  }

  // ========== FORMULARIO ENCUESTA ==========
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
        // Obtener datos del localStorage
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

        if (usuarioError) throw usuarioError;

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
        alert('¡Gracias por completar la encuesta!\nTu registro ha sido finalizado exitosamente.');
        window.location.href = 'index.html';

      } catch (error) {
        console.error("Error al registrar:", error);
        alert("Ocurrió un error al guardar los datos. Intenta más tarde.");
      }
    });
  }
  // FORM REGISTRO
  const formRegistro = document.getElementById('registro-form');

  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const contrasena = document.getElementById('contrasena').value.trim();

      if (!nombre || !email || !telefono || !contrasena) {
        alert("Por favor completa todos los campos.");
        return;
      }

      if (!/^\d{10}$/.test(telefono)) {
        alert("El teléfono debe tener exactamente 10 dígitos.");
        return;
      }

      const hash = bcrypt.hashSync(contrasena, 10); 

      // Guardar datos temporalmente en localStorage
      localStorage.setItem('nombreUsuario', nombre);
      localStorage.setItem('correoUsuario', email);
      localStorage.setItem('telefonoUsuario', telefono);
      localStorage.setItem('contrasenaUsuario', hash);

      // Continuar 
      window.location.href = "contactos.html";
    });
  }
  // CONTACTO DE EMERGENCIA 
  const formContacto = document.getElementById('contacto-emergencia-form');

  if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = formContacto["nombre-contacto"].value.trim();
      const telefono = formContacto["telefono-contacto"].value.trim();
      const relacion = formContacto["relacion-contacto"].value;

      const nombreUsuario = localStorage.getItem('nombreUsuario') || "usuario";

      if (!nombre || !telefono || !relacion) {
        alert("Por favor completa todos los campos.");
        return;
      }

      if (!/^\d{10}$/.test(telefono)) {
        alert("El teléfono debe tener exactamente 10 dígitos.");
        return;
      }

      // Guardar en localStorage para usarlo al final del registro
      localStorage.setItem('contactoNombre', nombre);
      localStorage.setItem('contactoTelefono', telefono);
      localStorage.setItem('contactoRelacion', relacion);

      alert(`${nombreUsuario}, tu contacto ha sido registrado.\nAhora completarás una breve encuesta.`);
      window.location.href = "encuesta.html";
    });
  }
});
