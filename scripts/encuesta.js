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
  const questions = document.querySelectorAll('.question-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressBar = document.getElementById('survey-progress');
  const currentQuestionSpan = document.getElementById('current-question');
  
  let currentQuestion = 1;
  const totalQuestions = questions.length;

  function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    currentQuestionSpan.textContent = currentQuestion;
  }

  function showQuestion(number) {
    questions.forEach(q => q.style.display = 'none');
    questions[number - 1].style.display = 'block';
    
    // Actualizar botones
    prevBtn.disabled = number === 1;
    nextBtn.style.display = number === totalQuestions ? 'none' : 'block';
    submitBtn.style.display = number === totalQuestions ? 'block' : 'none';
    
    // Actualizar progreso
    currentQuestion = number;
    updateProgress();

    // Añadir animación
    questions[number - 1].classList.add('question-fade-in');
  }

  function canAdvance() {
    const currentInputs = questions[currentQuestion - 1].querySelectorAll('input[type="radio"]');
    return Array.from(currentInputs).some(input => input.checked);
  }

  prevBtn.addEventListener('click', () => {
    if (currentQuestion > 1) {
      showQuestion(currentQuestion - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (canAdvance()) {
      if (currentQuestion < totalQuestions) {
        showQuestion(currentQuestion + 1);
      }
    } else {
      alert('Por favor, selecciona una respuesta antes de continuar.');
    }
  });

  formEncuesta.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!canAdvance()) {
      alert('Por favor, responde la última pregunta antes de enviar.');
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

  // Inicializar la primera pregunta
  showQuestion(1);
}

document.addEventListener('DOMContentLoaded', () => {
  updateQuestionStatus();
  highlightUnansweredQuestions();
});