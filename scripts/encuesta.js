// encuesta.js
import { supabase } from './supabase.js';

export function setupEncuesta() {
  const form = document.getElementById('encuesta-form');
  const progressBar = document.getElementById('survey-progress');
  const questionsCompletedSpan = document.getElementById('questions-completed');
  const submitBtn = document.getElementById('submit-btn');

  function updateProgress() {
    const totalQuestions = 10;
    const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
    const progress = (answeredQuestions / totalQuestions) * 100;
    
    progressBar.style.width = `${progress}%`;
    questionsCompletedSpan.textContent = answeredQuestions;
    
    // Mostrar/ocultar botón de enviar
    submitBtn.style.display = answeredQuestions === totalQuestions ? 'block' : 'none';
  }

  // Actualizar progreso cuando se selecciona una respuesta
  form.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      updateProgress();
      
      // Efecto visual en la pregunta respondida
      const questionContainer = e.target.closest('.question-container');
      questionContainer.classList.add('answered');
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
    if (answeredQuestions < 10) {
      alert('Por favor, responde todas las preguntas antes de enviar.');
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.error('No se pudo obtener el usuario:', userError);
        alert('No se pudo identificar al usuario. Inicia sesión nuevamente.');
        window.location.href = 'login.html';
        return;
      }

      const uid = userData.user.id;
      const respuestas = [];

      // Recolectar todas las respuestas
      document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        respuestas.push({
          id_usuario: uid,
          id_opcion: parseInt(input.value),
          id_pregunta: parseInt(input.name.replace('q', ''))
        });
      });

      const { error: respuestaError } = await supabase
        .from('respuestas')
        .insert(respuestas);

      if (respuestaError) throw respuestaError;

      alert('¡Gracias por completar la encuesta!');
      window.location.href = 'index.html';

    } catch (err) {
      console.error('Error al guardar las respuestas:', err);
      alert('Ocurrió un error al enviar tus respuestas. Intenta de nuevo.');
    }
  });

  // Inicializar progreso
  updateProgress();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupEncuesta);