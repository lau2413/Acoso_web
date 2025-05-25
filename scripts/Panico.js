// panico.js
import { supabase } from './supabase.js';

// Configuración para WhatsApp Cloud API (solo para pruebas)
const WHATSAPP_TOKEN = 'EAAUGl1HX7KsBO6rblO491nFBU59IVGG9IF7GtlupZADzkB6GatndyrgqhlyhisM1iqZCw6Jp6ZBgZBSorYI9QbYtZCZCDilZCIRjCZB1WFNR97fEDWtaTyc701TRM3odJUKbLXeONiooLLZAkMdmJHrEEq0Gmhg3gplMOsoK4DW8RyAi8WdtdZCr6BGn8sLPwkhUJDJhMIXf7Wxnj4YDcgbbSJoVnqUAaCDnQZD'; // ← reemplázalo por el real
const PHONE_NUMBER_ID = '690685430789757';

// Función para enviar mensajes WhatsApp
async function enviarMensajeWhatsApp(numero, mensaje) {
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
      console.error("Error al enviar mensaje por WhatsApp:", data);
      throw new Error(`Error al enviar el mensaje: ${data.error?.message}`);
    } else {
      console.log("Mensaje enviado por WhatsApp:", data);
    }
  } catch (error) {
    console.error("Error al conectar con WhatsApp Cloud API:", error);
    throw new Error("No se pudo enviar el mensaje de alerta por WhatsApp.");
  }
}

function setupPanico() {
  console.log('Inicializando setupPanico...');
  
  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const slider = document.getElementById('slider-acoso');
  const enviarAlerta = document.getElementById('enviar-alerta');
  const nivelAcoso = document.getElementById('nivel-acoso');
  const cerrarModal = document.getElementById('cerrar-modal');
  let isProcessing = false;

  // Verificar que todos los elementos necesarios existen
  if (!btnPanico || !modalEmergencia || !slider || !enviarAlerta || !nivelAcoso || !cerrarModal) {
    console.error('Faltan elementos necesarios para el botón de pánico');
    console.log('Elementos encontrados:', {
      btnPanico: !!btnPanico,
      modalEmergencia: !!modalEmergencia,
      slider: !!slider,
      enviarAlerta: !!enviarAlerta,
      nivelAcoso: !!nivelAcoso,
      cerrarModal: !!cerrarModal
    });
    return;
  }

  console.log('Todos los elementos del pánico encontrados');

  function mostrarModal() {
    console.log('Intentando mostrar modal de emergencia');
    try {
      document.body.classList.add('modal-open');
      modalEmergencia.style.display = 'flex';
      modalEmergencia.style.opacity = '1';
      modalEmergencia.style.visibility = 'visible';
      modalEmergencia.classList.remove('hidden');
      slider.value = 1;
      actualizarNivelAcoso(1);
      
      modalEmergencia.offsetHeight;
    } catch (error) {
      console.error('Error al mostrar el modal:', error);
    }
  }

  function ocultarModal() {
    if (!modalEmergencia) return;
    
    console.log('Intentando ocultar modal de emergencia');
    try {
      document.body.classList.remove('modal-open');
      modalEmergencia.style.opacity = '0';
      modalEmergencia.style.visibility = 'hidden';
      
      setTimeout(() => {
        if (modalEmergencia) {
          modalEmergencia.style.display = 'none';
          modalEmergencia.classList.add('hidden');
        }
        isProcessing = false;
      }, 300);
      
      console.log('Modal ocultado exitosamente');
    } catch (error) {
      console.error('Error al ocultar el modal:', error);
    }
  }

  function actualizarNivelAcoso(nivel) {
    console.log('Actualizando nivel de acoso:', nivel);
    let texto = "";
    switch(nivel) {
      case "1":
        texto = "Leve - Chistes,conversaciones de contenido sexual,acoso verbal, miradas o gestos lascivos";
        break;
      case "2":
        texto = "Moderado - Acoso persistente, llamadas, cartas o invitaciones con intecciones sexuales";
        break;
      case "3":
        texto = "Fuerte - Amenazas directas,petición de favores sexuales, manoseos,contacto fisico no permitido";
        break;
      case "4":
        texto = "Grave - Presiones para tener contacto sexual,intimidación sexual directa";
        break;
      default:
        texto = "Selecciona un nivel de acoso";
    }
    nivelAcoso.textContent = texto;
  }

  // Remover event listeners anteriores si existen
  const nuevoBotonPanico = btnPanico.cloneNode(true);
  btnPanico.parentNode.replaceChild(nuevoBotonPanico, btnPanico);
  
  const nuevoEnviarAlerta = enviarAlerta.cloneNode(true);
  enviarAlerta.parentNode.replaceChild(nuevoEnviarAlerta, enviarAlerta);
  
  const nuevoCerrarModal = cerrarModal.cloneNode(true);
  cerrarModal.parentNode.replaceChild(nuevoCerrarModal, cerrarModal);

  // Event Listeners
  nuevoBotonPanico.addEventListener('click', (e) => {
    console.log('Botón de pánico clickeado');
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) {
      mostrarModal();
    }
  });

  nuevoCerrarModal.addEventListener('click', (e) => {
    console.log('Botón cerrar clickeado');
    e.preventDefault();
    e.stopPropagation();
    ocultarModal();
  });

  modalEmergencia.addEventListener('mousedown', (e) => {
    // Only close if clicking directly on the modal backdrop
    if (e.target === modalEmergencia) {
      console.log('Click fuera del modal');
      ocultarModal();
    }
  });

  // Create a wrapper for the content to prevent event bubbling
  const modalContent = modalEmergencia.querySelector('.modal-content');
  if (modalContent) {
    modalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  slider.addEventListener('input', () => {
    const nivelActual = slider.value;
    console.log('Slider ajustado a:', nivelActual);
    actualizarNivelAcoso(nivelActual);
  });

  let alertaEnviada = false;
  
  nuevoEnviarAlerta.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!alertaEnviada) {
      alertaEnviada = true;
      enviarAlertaHandler();
    }
  });

  async function enviarAlertaHandler() {
    if (isProcessing) {
      console.log('Ya hay una alerta en proceso...');
      return;
    }

    console.log('Iniciando proceso de alerta...');
    isProcessing = true;
    nuevoEnviarAlerta.disabled = true;

    try {
      // 1. Obtener usuario actual
      console.log('Obteniendo usuario actual...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error al obtener usuario:', userError);
        throw new Error('Error de autenticación. Por favor, inicia sesión nuevamente.');
      }
      
      if (!user) {
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }

      console.log('Usuario obtenido:', user.id);

      // 2. Obtener contactos de emergencia
      console.log('Buscando contactos de emergencia para usuario:', user.id);
      const { data: contactos, error: contactoError } = await supabase
        .from('contactos')
        .select(`
          id_contacto,
          nombre_contacto,
          telefono_contacto,
          relacion
        `)
        .eq('id_usuario', user.id);

      if (contactoError) {
        console.error('Error al obtener contactos:', contactoError);
        throw new Error('Error al obtener contactos de emergencia: ' + contactoError.message);
      }

      if (!contactos || contactos.length === 0) {
        throw new Error('No has registrado ningún contacto de emergencia. Por favor, registra al menos uno antes de usar el botón de pánico.');
      }

      console.log('Contactos encontrados:', contactos.length);

      // 3. Obtener ubicación
      console.log('Obteniendo ubicación...');
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      console.log('Posición obtenida:', position.coords);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const link = `https://www.google.com/maps?q=${lat},${lon}`;
      
      // 4. Obtener nivel de acoso
      const nivelActual = parseInt(slider.value);
      console.log('Nivel de acoso seleccionado:', nivelActual);

      // 5. Crear registro de acoso
      console.log('Creando registro de acoso...');
      const { data: acoso, error: acosoError } = await supabase
        .from('acoso')
        .insert({
          id_usuario: user.id,
          id_tipo_acoso: nivelActual,
          latitud: lat,
          longitud: lon
        })
        .select('id_acoso')
        .single();

      if (acosoError) {
        console.error('Error al crear registro de acoso:', acosoError);
        throw new Error('Error al registrar el incidente: ' + acosoError.message);
      }
      acoso.id = acoso.id_acoso;

      console.log('Registro de acoso creado:', acoso.id);

      for (let contacto of contactos) {
        console.log(contacto)
        let telefono = contacto.telefono_contacto;
        let numeroFormateado = telefono.replace(/\D/g, ''); // elimina todo lo que no sea dígito
        if (!numeroFormateado.startsWith('57')) {
          numeroFormateado = '57' + numeroFormateado;
        }
        console.log("Número formateado:", numeroFormateado);
        try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: numeroFormateado,
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
          console.error("Error al enviar mensaje por WhatsApp:", data);
          throw new Error(`Error al enviar el mensaje: ${data.error?.message}`);
        } else {
          console.log("Mensaje enviado por WhatsApp:", data);
        }
        } catch (error) {
          console.error("Error al conectar con WhatsApp Cloud API:", error);
          throw new Error("No se pudo enviar el mensaje de alerta por WhatsApp.");
        }
    }

      // 6. Crear alertas
      console.log('Creando alertas...');
      const alertasPromesas = contactos.map(contacto => {
        return supabase
          .from('alertas')
          .insert({
            id_acoso: acoso.id,
            id_contacto: contacto.id_contacto,
            estado: 'enviada',
            fecha_envio: new Date().toISOString()
          });
      });

      if (nivelActual >= 3) {
        // Para niveles Fuerte y Grave, crear alertas adicionales para autoridades
        alertasPromesas.push(
          supabase.from('alertas').insert([
            {
              id_acoso: acoso.id,
              estado: 'enviada',
              fecha_envio: new Date().toISOString()
            },
            {
              id_acoso: acoso.id,
              estado: 'enviada',
              fecha_envio: new Date().toISOString()
            }
          ])
        );
      }

      const resultadosAlertas = await Promise.allSettled(alertasPromesas);
      console.log('Resultados de crear alertas:', resultadosAlertas);

      const erroresAlertas = resultadosAlertas.filter(r => r.status === 'rejected');
      if (erroresAlertas.length > 0) {
        console.error('Errores al crear algunas alertas:', erroresAlertas);
        throw new Error('Algunas alertas no pudieron ser enviadas');
      }


      // 7. Mostrar mensaje de éxito y cerrar modal
      const mensaje = nivelActual >= 3 
        ? `¡Alerta enviada!\n\nSe ha notificado a:\n- Tu contacto de emergencia\n- Línea de emergencia 123\n- Policía Nacional 112\n\nTu ubicación ha sido compartida con las autoridades.`
        : `¡Alerta enviada!\n\nSe ha notificado a tu contacto de emergencia.\nTu ubicación ha sido compartida.`;

      // Disable pointer events
      modalEmergencia.style.pointerEvents = 'none';
      nuevoCerrarModal.style.pointerEvents = 'none';

      // Show alert and then close modal
      alert(mensaje);
      ocultarModal();

      // Re-enable pointer events after modal is closed
      setTimeout(() => {
        modalEmergencia.style.pointerEvents = '';
        nuevoCerrarModal.style.pointerEvents = '';
        isProcessing = false;
        nuevoEnviarAlerta.disabled = false;
        alertaEnviada = false;
      }, 400);

    } catch (error) {
      console.error("Error al procesar la alerta:", error);
      alert(error.message || "Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      isProcessing = false;
      nuevoEnviarAlerta.disabled = false;
      
      // Restore event handlers
      modalEmergencia.style.pointerEvents = '';
      nuevoCerrarModal.style.pointerEvents = '';
    }
  }

}

export { setupPanico };
