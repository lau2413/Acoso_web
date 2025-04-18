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

    // Simulación de contacto
    const contactoTelefono = localStorage.getItem('contactoTelefono') || '3001234567'; // número de prueba

    // Mensaje común
    const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";

    btnLeve?.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');

      // Simular envío por WhatsApp
      const mensaje = `⚠️ Alerta de acoso (leve): ${nombreUsuario} ha activado el botón de pánico.`;
      const url = `https://wa.me/57${contactoTelefono}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    });

    btnGrave?.addEventListener('click', () => {
      modalEmergencia.classList.add('hidden');

      // Mensaje al contacto
      const mensajeContacto = `🚨 Alerta de acoso GRAVE: ${nombreUsuario} necesita ayuda inmediata.`;
      const urlContacto = `https://wa.me/57${contactoTelefono}?text=${encodeURIComponent(mensajeContacto)}`;

      // Simulación de notificación a autoridades
      alert("🔔 Notificación enviada a las autoridades."); // Aquí podrías hacer una integración real a futuro

      window.open(urlContacto, '_blank');
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

  