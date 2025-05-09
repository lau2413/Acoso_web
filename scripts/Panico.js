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
  const nivelTitulo = document.getElementById('nivel-titulo');
  const nivelDetalle = document.getElementById('nivel-detalle');
  const cerrarModal = document.getElementById('cerrar-modal');

  // Definición de los niveles de acoso
  const nivelesAcoso = {
    1: {
      titulo: "Nivel 1: Leve",
      descripcion: "Piropos, miradas o gestos sugestivos, chistes o conversaciones de contenido sexual, muecas",
      color: "#ffcc00"
    },
    2: {
      titulo: "Nivel 2: Moderado",
      descripcion: "Llamadas, cartas o invitaciones con intenciones sexuales",
      color: "#ff9900"
    },
    3: {
      titulo: "Nivel 3: Fuerte",
      descripcion: "Manoseos, tocamientos no consentidos, acorralar",
      color: "#ff6600"
    },
    4: {
      titulo: "Nivel 4: Grave",
      descripcion: "Presiones físicas o psicológicas para tener contacto sexual",
      color: "#ff3300"
    },
    5: {
      titulo: "Nivel 5: Severo",
      descripcion: "Forzar relaciones sexuales, violencia sexual explícita",
      color: "#cc0000"
    }
  };

  btnPanico?.addEventListener('click', () => modalEmergencia?.classList.remove('hidden'));
  cerrarModal?.addEventListener('click', () => modalEmergencia?.classList.add('hidden'));

  // Actualizar la descripción al cargar
  if (slider && nivelTitulo && nivelDetalle) {
    const nivelActual = parseInt(slider.value);
    nivelTitulo.textContent = nivelesAcoso[nivelActual].titulo;
    nivelDetalle.textContent = nivelesAcoso[nivelActual].descripcion;
    nivelTitulo.style.color = nivelesAcoso[nivelActual].color;
  }

  // Actualizar al mover el slider
  slider?.addEventListener('input', () => {
    const nivelActual = parseInt(slider.value);
    nivelTitulo.textContent = nivelesAcoso[nivelActual].titulo;
    nivelDetalle.textContent = nivelesAcoso[nivelActual].descripcion;
    nivelTitulo.style.color = nivelesAcoso[nivelActual].color;
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
