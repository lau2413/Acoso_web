// Esperar a que todo el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada correctamente');
  
    // --- FUNCIONALIDAD BOTÓN DE PÁNICO ---
    const btnPanico = document.getElementById('btn-panico');
    if (btnPanico) {
      btnPanico.addEventListener('click', function() {
        // Aquí defines qué quieres que haga el botón de pánico
        alert('¡Botón de pánico activado! 🚨');
        // También puedes redirigir, cerrar sesión, o cualquier acción urgente
        // Por ejemplo: window.location.href = 'https://emergencia.com';
      });
    }
  
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
        alert('¡Gracias por completar la encuesta!');
        formEncuesta.reset();
        window.location.href = 'index.html';
      });
    }
});

  