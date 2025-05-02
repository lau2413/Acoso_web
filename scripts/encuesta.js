// encuesta.js
import { supabase } from './supabase.js';

export function setupEncuesta() {
  const formEncuesta = document.getElementById('encuesta-form');
  const avanzarBtn = document.getElementById('avanzar-btn');

  if (!formEncuesta) return;

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
}