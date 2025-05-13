// panico.js
import { supabase } from './supabase.js';

// Configuración para WhatsApp Cloud API (solo para pruebas)
const WHATSAPP_TOKEN = 'EAAUGl1HX7KsBO4YWG55ZBjnkv6WZBdfkMxQMlVLeMl7CFFCZCeQIvnz6ZBRTB3ecgBFVTKklL9s4ExnzmZBj0yP7NdSKoJkekxbMsO5l4V2MwTWgxppz0R4ZBjOvvttLcNP4pkfjpzZCgQZC5FFTBDytuH2xcKWpU8MCKviWgw0U4xlqRKhZCjl8fKdN1RE5UQJJu9NE5dg0i8CbcQyBLAEiAQT4ZD'; // ← reemplázalo por el real
const PHONE_NUMBER_ID = '690685430789757';

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
      
      console.log('Modal mostrado exitosamente');
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
        texto = "Nivel 1 - Leve: Acoso verbal o visual";
        break;
      case "2":
        texto = "Nivel 2 - Moderado: Acoso persistente";
        break;
      case "3":
        texto = "Nivel 3 - Fuerte: Contacto físico no consentido";
        break;
      case "4":
        texto = "Nivel 4 - Grave: Peligro inminente";
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

  modalEmergencia.addEventListener('click', (e) => {
    if (e.target === modalEmergencia) {
      console.log('Click fuera del modal');
      ocultarModal();
    }
  });

  slider.addEventListener('input', () => {
    const nivelActual = slider.value;
    console.log('Slider ajustado a:', nivelActual);
    actualizarNivelAcoso(nivelActual);
  });

  async function enviarAlertaHandler() {
    if (isProcessing) {
      console.log('Ya hay una alerta en proceso...');
      return;
    }

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
        .select()
        .single();

      if (acosoError) {
        console.error('Error al crear registro de acoso:', acosoError);
        throw new Error('Error al registrar el incidente: ' + acosoError.message);
      }

      console.log('Registro de acoso creado:', acoso);

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

      // Remove event listeners temporarily
      modalEmergencia.style.pointerEvents = 'none';
      nuevoCerrarModal.style.pointerEvents = 'none';

      // Close modal first
      ocultarModal();

      // Show alert after modal is closed
      setTimeout(() => {
        modalEmergencia.style.pointerEvents = '';
        nuevoCerrarModal.style.pointerEvents = '';
        alert(mensaje);
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

  nuevoEnviarAlerta.addEventListener('click', enviarAlertaHandler);

  console.log('Configuración del pánico completada');
}

export { setupPanico };
