// panico.js
import { supabase } from './supabase.js';

// Configuración para WhatsApp Cloud API (solo para pruebas)
const WHATSAPP_TOKEN = 'EAAUGl1HX7KsBO4YWG55ZBjnkv6WZBdfkMxQMlVLeMl7CFFCZCeQIvnz6ZBRTB3ecgBFVTKklL9s4ExnzmZBj0yP7NdSKoJkekxbMsO5l4V2MwTWgxppz0R4ZBjOvvttLcNP4pkfjpzZCgQZC5FFTBDytuH2xcKWpU8MCKviWgw0U4xlqRKhZCjl8fKdN1RE5UQJJu9NE5dg0i8CbcQyBLAEiAQT4ZD'; // ← reemplázalo por el real
const PHONE_NUMBER_ID = '690685430789757';

export function setupPanico() {
  console.log('Inicializando setupPanico...');
  
  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const slider = document.getElementById('slider-acoso');
  const enviarAlerta = document.getElementById('enviar-alerta');
  const nivelTitulo = document.getElementById('nivel-titulo');
  const nivelDetalle = document.getElementById('nivel-detalle');
  const cerrarModal = document.getElementById('cerrar-modal');

  console.log('Elementos encontrados:', {
    btnPanico: !!btnPanico,
    modalEmergencia: !!modalEmergencia,
    slider: !!slider,
    enviarAlerta: !!enviarAlerta,
    nivelTitulo: !!nivelTitulo,
    nivelDetalle: !!nivelDetalle,
    cerrarModal: !!cerrarModal
  });

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

  if (btnPanico) {
    console.log('Agregando event listener al botón de pánico');
    btnPanico.addEventListener('click', () => {
      console.log('Botón de pánico clickeado');
      if (modalEmergencia) {
        console.log('Mostrando modal de emergencia');
        modalEmergencia.classList.remove('hidden');
        // Asegurarse de que el slider esté en el valor inicial
        if (slider) {
          slider.value = 1;
          actualizarNivelAcoso(1);
        }
      } else {
        console.error('Modal de emergencia no encontrado');
      }
    });
  }

  if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
      console.log('Cerrando modal');
      if (modalEmergencia) {
        modalEmergencia.classList.add('hidden');
      }
    });
  }

  function actualizarNivelAcoso(nivel) {
    console.log('Actualizando nivel de acoso:', nivel);
    if (nivelTitulo && nivelDetalle) {
      nivelTitulo.textContent = nivelesAcoso[nivel].titulo;
      nivelDetalle.textContent = nivelesAcoso[nivel].descripcion;
      nivelTitulo.style.color = nivelesAcoso[nivel].color;
    }
  }

  // Actualizar al mover el slider
  if (slider) {
    slider.addEventListener('input', () => {
      const nivelActual = parseInt(slider.value);
      console.log('Slider movido a nivel:', nivelActual);
      actualizarNivelAcoso(nivelActual);
    });
  }

  if (enviarAlerta) {
    enviarAlerta.addEventListener('click', async () => {
      console.log('Iniciando envío de alerta...');
      
      if (!navigator.geolocation) {
        console.error('Geolocalización no soportada');
        alert("Tu navegador no soporta geolocalización.");
        return;
      }

      try {
        console.log('Obteniendo usuario actual...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('Error al obtener usuario:', userError);
          alert("No se pudo obtener el usuario actual. Inicia sesión nuevamente.");
          return;
        }

        console.log('Buscando contactos de emergencia...');
        const { data: contactos, error: contactoError } = await supabase
          .from('contactos')
          .select('telefono_contacto')
          .eq('id_usuario', user.id);

        if (contactoError || !contactos || contactos.length === 0) {
          console.error('Error al obtener contactos:', contactoError);
          alert("No se encontró un contacto de emergencia para este usuario.");
          return;
        }

        let numeroEmergencia = contactos[0].telefono_contacto;
        if (!numeroEmergencia.startsWith("+")) {
          numeroEmergencia = '+57' + numeroEmergencia;
        }
        console.log('Número de emergencia encontrado:', numeroEmergencia);

        navigator.geolocation.getCurrentPosition(async (position) => {
          console.log('Posición obtenida:', position);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const link = `https://www.google.com/maps?q=${lat},${lon}`;

          const val = parseInt(slider.value);
          const gravedad = val <= 2 ? 'leve' : 'grave';
          const mensaje = `🚨 ¡ALERTA ${gravedad.toUpperCase()}! Necesito ayuda. Esta es mi ubicación: ${link}`;
          console.log('Mensaje preparado:', mensaje);

          try {
            console.log('Enviando mensaje a WhatsApp...');
            const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: numeroEmergencia.replace('+', ''),
                type: 'template',
                template: {
                  name: 'alerta_emergencia',
                  language: { code: 'es_CO' },
                  components: [{
                    type: 'body',
                    parameters: [{
                      type: 'text',
                      text: link
                    }]
                  }]
                }
              })
            });

            const data = await response.json();
            console.log('Respuesta de WhatsApp:', data);

            if (!response.ok) {
              console.error("Error WhatsApp API:", data);
              alert(`Error al enviar el mensaje: ${data.error?.message}`);
            } else {
              console.log("Mensaje enviado exitosamente");
              alert("¡Mensaje de emergencia enviado por WhatsApp!");
              modalEmergencia.classList.add('hidden');
            }
          } catch (error) {
            console.error("Error al conectar con WhatsApp Cloud API:", error);
            alert("No se pudo enviar el mensaje de alerta.");
          }
        }, (error) => {
          console.error("Error al obtener ubicación:", error);
          alert("Error al obtener la ubicación.");
        });
      } catch (error) {
        console.error("Error general:", error);
        alert("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      }
    });
  }
}
