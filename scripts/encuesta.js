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
  const form = document.getElementById('encuesta-form');
  const questions = document.querySelectorAll('.question-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressBar = document.getElementById('survey-progress');
  const currentQuestionSpan = document.getElementById('current-question');

  let currentQuestionIndex = 0;

  function showQuestion(index) {
    // Ocultar todas las preguntas
    questions.forEach(q => {
      q.style.display = 'none';
      q.classList.remove('active');
    });
    
    // Mostrar la pregunta actual
    questions[index].style.display = 'block';
    questions[index].classList.add('active');
    
    // Actualizar navegación
    prevBtn.disabled = index === 0;
    nextBtn.style.display = index === questions.length - 1 ? 'none' : 'block';
    submitBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
    
    // Actualizar progreso
    currentQuestionIndex = index;
    currentQuestionSpan.textContent = index + 1;
    progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
  }

  // Event Listeners
  nextBtn.addEventListener('click', () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = currentQuestion.querySelector('input[type="radio"]:checked');
    
    if (!isAnswered) {
      alert('Por favor, selecciona una respuesta antes de continuar.');
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      showQuestion(currentQuestionIndex + 1);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      showQuestion(currentQuestionIndex - 1);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (currentQuestionIndex !== questions.length - 1) {
      alert('Por favor, completa la encuesta antes de enviar.');
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
      questions.forEach((question, index) => {
        const checkedInput = question.querySelector('input[type="radio"]:checked');
        if (checkedInput) {
          respuestas.push({
            id_usuario: uid,
            id_opcion: parseInt(checkedInput.value),
            id_pregunta: index + 1
          });
        }
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

  // Inicializar
  showQuestion(0);
}

document.addEventListener('DOMContentLoaded', () => {
  updateQuestionStatus();
  highlightUnansweredQuestions();
  setupEncuesta();
});