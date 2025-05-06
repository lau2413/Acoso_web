// panico.js
import { supabase } from './supabase.js';

const TWILIO_SID = "ACc38625a993719beb95e6ac9154570709";
const TWILIO_TOKEN = "82d829c04c269e2c3791605f45bfc93c";
const TWILIO_NUMBER = "+13163892927";

export function setupPanico() {
  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const slider = document.getElementById('slider-acoso');
  const enviarAlerta = document.getElementById('enviar-alerta');
  const nivel = document.getElementById('nivel-acoso');
  const cerrarModal = document.getElementById('cerrar-modal');

  btnPanico?.addEventListener('click', () => modalEmergencia?.classList.remove('hidden'));
  cerrarModal?.addEventListener('click', () => modalEmergencia?.classList.add('hidden'));

  if (nivel && slider) {
    const val = parseInt(slider.value);
    nivel.textContent = `Nivel ${val}: ${val <= 2 ? 'Leve' : 'Grave'}`;
    nivel.style.color = val <= 2 ? 'orange' : 'red';
  }

  slider?.addEventListener('input', () => {
    const val = parseInt(slider.value);
    let texto = `Nivel ${val}: `;
    texto += (val <= 2) ? 'Leve' : 'Grave';
    nivel.textContent = texto;
    nivel.style.color = (val <= 2) ? 'orange' : 'red';
  });

  enviarAlerta?.addEventListener('click', async () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("No se pudo obtener el usuario actual. Inicia sesión nuevamente.");
      return;
    }

    const { data: contactos, error: contactoError } = await supabase
      .from('contactos')
      .select('telefono_contacto')
      .eq('id_usuario', user.id)

    if (contactoError || !contactos || contactos.length === 0) {
      alert("No se encontró un contacto de emergencia para este usuario.", user.id);
      return;
    }

    const numeroEmergencia = contactos[0].telefono_contacto;
    if (!numeroEmergencia.startsWith("+")) {
      alert("El número del contacto debe estar en formato internacional, ejemplo +573001234567");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const link = `https://www.google.com/maps?q=${lat},${lon}`;
      const mensaje = `🚨 ¡Alerta! Necesito ayuda. Esta es mi ubicación: ${link}`;

      try {
        const response = await fetch(
          'https://turbo-cod-x5wq5wqjvpp73pxrv-3000.app.github.dev',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'To': numeroEmergencia,
              'From': TWILIO_NUMBER,
              'Body': mensaje,
            }),
          }
        );

        const data = await response.json();
        console.log("SMS enviado:", data.sid || data);
        alert("¡Mensaje de emergencia enviado con ubicación!");
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        alert("Error al enviar el mensaje de alerta.");
      }
    }, (error) => {
      console.error("No se pudo obtener la ubicación:", error);
      alert("Error al obtener la ubicación.");
    });
  });
}
