// panico.js
import { supabase } from './supabase.js';

// Configuración para WhatsApp Cloud API (solo para pruebas)
const WHATSAPP_TOKEN = 'EAAUGl1HX7KsBO4YWG55ZBjnkv6WZBdfkMxQMlVLeMl7CFFCZCeQIvnz6ZBRTB3ecgBFVTKklL9s4ExnzmZBj0yP7NdSKoJkekxbMsO5l4V2MwTWgxppz0R4ZBjOvvttLcNP4pkfjpzZCgQZC5FFTBDytuH2xcKWpU8MCKviWgw0U4xlqRKhZCjl8fKdN1RE5UQJJu9NE5dg0i8CbcQyBLAEiAQT4ZD'; // ← reemplázalo por el real
const PHONE_NUMBER_ID = '690685430789757';

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
      .eq('id_usuario', user.id);

    if (contactoError || !contactos || contactos.length === 0) {
      alert("No se encontró un contacto de emergencia para este usuario.");
      return;
    }

    let numeroEmergencia = contactos[0].telefono_contacto;
    if (!numeroEmergencia.startsWith("+")) {
      numeroEmergencia = '+57' + numeroEmergencia;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const link = `https://www.google.com/maps?q=${lat},${lon}`;

      const val = parseInt(slider.value);
      const gravedad = val <= 2 ? 'leve' : 'grave';
      const mensaje = `🚨 ¡ALERTA ${gravedad.toUpperCase()}! Necesito ayuda. Esta es mi ubicación: ${link}`;

      try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: numeroEmergencia.replace('+', ''), // WhatsApp requiere solo números
            type: 'template',
            template: {
              name: 'alerta_emergencia',
              language: { code: 'es_CO' },
              components: [{
                type: 'body',
                parameters: [{
                  type: 'text',
                  text: link // ubicación dinámica que reemplaza {{1}}
                }]
              }]
            }
          })
        });
        const data = await response.json();

        if (!response.ok) {
          console.error("Error WhatsApp API:", data);
          alert(`Error al enviar el mensaje: ${data.error?.message}`);
        } else {
          console.log("Mensaje enviado:", data);
          alert("¡Mensaje de emergencia enviado por WhatsApp!");
          console.log("Respuesta completa de la API:", data);
        }
      } catch (error) {
        console.error("Error al conectar con WhatsApp Cloud API:", error);
        alert("No se pudo enviar el mensaje de alerta.");
      }
    }, (error) => {
      console.error("No se pudo obtener la ubicación:", error);
      alert("Error al obtener la ubicación.");
    });
  });
}
