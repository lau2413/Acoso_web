// Esperar a que todo el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada correctamente');
  
    // === FUNCIONALIDAD DEL BOTÓN DE PÁNICO ===
    const btnPanico = document.getElementById('boton-panico');
    const modalEmergencia = document.getElementById('modal-emergencia');
    const btnLeve = document.getElementById('btn-leve');
    const btnGrave = document.getElementById('btn-grave');
    const cerrarModal = document.getElementById('cerrar-modal');

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

    const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";

    // Acoso leve
    btnLeve?.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
      alert(`⚠️ Alerta de acoso leve enviada.\n${nombreUsuario}, tu contacto ha sido notificado.`);
      window.location.href = 'index.html';
    });

    // Acoso grave
    btnGrave?.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
      alert(`🚨 Acoso grave reportado.\n${nombreUsuario}, tu contacto y las autoridades han sido notificados.`);
      window.location.href = 'index.html';
    });

    // === FUNCIONALIDAD FORMULARIO ENCUESTA ===
    const formEncuesta = document.getElementById('encuesta-form');
    const avanzarBtn = document.getElementById('avanzar-btn');

    if (formEncuesta) {
      formEncuesta.addEventListener('change', () => {
        const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
        avanzarBtn.style.display = respuestasSeleccionadas.length === 10 ? "block" : "none";
      });

      formEncuesta.addEventListener('submit', function(event) {
        event.preventDefault();

        const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked'); 

        if (respuestasSeleccionadas.length < 10)  {
          alert('Por favor, responde todas las preguntas antes de enviar.');
          return;
        }

        alert('¡Gracias por completar la encuesta!\nTu registro ha sido finalizado exitosamente.');
        localStorage.clear();
        formEncuesta.reset();
        window.location.href = 'index.html';
      });
    }
});
  
    // --- FUNCIONALIDAD FORMULARIO ENCUESTA ---
    const formEncuesta = document.getElementById('encuesta-form');
    const avanzarBtn = document.getElementById('avanzar-btn');
    if (formEncuesta) {
      formEncuesta.addEventListener('change', () => {
        const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
        if (respuestasSeleccionadas.length === 10) {
          avanzarBtn.style.display = "block";
        } else {
          avanzarBtn.style.display = "none";
        }
      });
      formEncuesta.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que recargue la página

        // Obtener todas las respuestas seleccionadas
        const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked'); 

        // Verificar si todas las preguntas fueron respondidas
        if (respuestasSeleccionadas.length < 10)  {
          alert('Por favor, responde todas las preguntas antes de enviar.');
          return;
        }

        // Encuesta completada exitosamente
        alert('¡Gracias por completar la encuesta!\nTu registro ha sido finalizado exitosamente.');
        localStorage.clear();
        formEncuesta.reset();
        window.location.href = 'index.html';
      });
    }
});

  