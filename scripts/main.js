document.addEventListener('DOMContentLoaded', function () {
  console.log('Página cargada correctamente');

  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const btnLeve = document.getElementById('btn-leve');
  const btnGrave = document.getElementById('btn-grave');
  const cerrarModal = document.getElementById('cerrar-modal');

  const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";

  // Mostrar modal al presionar botón de pánico
  if (btnPanico) {
    btnPanico.addEventListener('click', () => {
      modalEmergencia.classList.remove('hidden');
    });
  }

  // Cerrar modal con botón cancelar
  if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
    });
  }

  // Acoso leve
  if (btnLeve) {
    btnLeve.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
      setTimeout(() => {
        alert(`⚠️ Alerta de acoso leve enviada.\n${nombreUsuario}, tu contacto ha sido notificado.`);
        window.location.href = 'index.html';
      }, 200); // Pequeña pausa para que se oculte visualmente antes
    });
  }

  // Acoso grave
  if (btnGrave) {
    btnGrave.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');
      setTimeout(() => {
        alert(`🚨 Acoso grave reportado.\n${nombreUsuario}, tu contacto y las autoridades han sido notificados.`);
        window.location.href = 'index.html';
      }, 200); // Pausa para asegurar ocultamiento visual
    });
  }
  // === FUNCIONALIDAD FORMULARIO ENCUESTA ===
  const formEncuesta = document.getElementById('encuesta-form');
  const avanzarBtn = document.getElementById('avanzar-btn');

  if (formEncuesta) {
    formEncuesta.addEventListener('change', () => {
      const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
      avanzarBtn.style.display = respuestasSeleccionadas.length === 10 ? "block" : "none";
    });

    formEncuesta.addEventListener('submit', function(event) {
      event.preventDefault();// Evita que recargue la página

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
  