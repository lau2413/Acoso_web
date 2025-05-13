// encuesta.js
import { supabase } from './supabase.js';

function updateQuestionStatus() {
  const total = 10;
  const answered = document.querySelectorAll('input[type="radio"]:checked').length;
  document.getElementById('questions-completed').textContent = `${answered}/${total}`;
}

function highlightUnansweredQuestions() {
  document.querySelectorAll('.question-container').forEach((container, index) => {
    const isAnswered = container.querySelector('input[type="radio"]:checked');
    container.classList.toggle('unanswered', !isAnswered);
  });
}

export function setupEncuesta() {
  const formEncuesta = document.getElementById('encuesta-form');
  const avanzarBtn = document.getElementById('avanzar-btn');

  if (!formEncuesta) return;

  formEncuesta.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      updateQuestionStatus();
      highlightUnansweredQuestions();
      
      const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
      avanzarBtn.style.display = respuestasSeleccionadas.length === 10 ? "block" : "none";
      
      const questionContainer = e.target.closest('.question-container');
      questionContainer.style.transform = 'scale(1.02)';
      setTimeout(() => {
        questionContainer.style.transform = 'scale(1)';
      }, 200);
    }
  });

  formEncuesta.addEventListener('submit', async (event) => {
    event.preventDefault();

    const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
    if (respuestasSeleccionadas.length < 10) {
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

      const respuestas = Array.from(respuestasSeleccionadas).map((radio) => ({
        id_usuario: uid,
        id_opcion: parseInt(radio.value),
        id_pregunta: parseInt(radio.name.replace('q', ''))
      }));

      const { error: respuestaError } = await supabase
        .from('respuestas')
        .insert(respuestas);

      if (respuestaError) throw respuestaError;

      localStorage.clear();
      alert('¡Gracias por completar la encuesta! Tu registro ha sido finalizado exitosamente.');
      window.location.href = 'index.html';

    } catch (err) {
      console.error('Error al guardar las respuestas:', err);
      alert('Ocurrió un error al enviar tus respuestas. Intenta de nuevo.');
    }
  });

  document.getElementById('prev-btn').addEventListener('click', () => {
    window.history.back();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateQuestionStatus();
  highlightUnansweredQuestions();
});