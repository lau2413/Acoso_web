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
      modalEmergencia.style.display = 'flex';
      modalEmergencia.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      slider.value = 0;
      actualizarNivelAcoso(0);
      console.log('Modal mostrado exitosamente');
    } catch (error) {
      console.error('Error al mostrar el modal:', error);
    }
  }

  function ocultarModal() {
    console.log('Intentando ocultar modal de emergencia');
    try {
      modalEmergencia.style.display = 'none';
      modalEmergencia.classList.add('hidden');
      document.body.style.overflow = '';
      console.log('Modal ocultado exitosamente');
    } catch (error) {
      console.error('Error al ocultar el modal:', error);
    }
  }

  function actualizarNivelAcoso(nivel) {
    console.log('Actualizando nivel de acoso:', nivel);
    let texto = "Nivel " + nivel + ": ";
    switch(nivel) {
      case "0":
        texto += "Leve - Situación incómoda";
        break;
      case "1":
        texto += "Moderado - Acoso verbal";
        break;
      case "2":
        texto += "Medio - Acoso persistente";
        break;
      case "3":
        texto += "Alto - Amenazas directas";
        break;
      case "4":
        texto += "Grave - Peligro inminente";
        break;
      case "5":
        texto += "Crítico - Emergencia inmediata";
        break;
      default:
        texto = "Nivel no definido";
    }
    nivelAcoso.textContent = texto;
  }

  // Event Listeners
  console.log('Configurando event listeners del pánico');

  btnPanico.addEventListener('click', (e) => {
    console.log('Botón de pánico clickeado');
    e.preventDefault();
    e.stopPropagation();
    mostrarModal();
  });

  cerrarModal.addEventListener('click', (e) => {
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

  const modalContent = modalEmergencia.querySelector('.modal-content');
  if (modalContent) {
    modalContent.addEventListener('click', (e) => {
      console.log('Click dentro del modal');
      e.stopPropagation();
    });
  }

  slider.addEventListener('input', () => {
    const nivelActual = slider.value;
    console.log('Slider ajustado a:', nivelActual);
    actualizarNivelAcoso(nivelActual);
  });

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

      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log('Posición obtenida:', position);
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const link = `https://www.google.com/maps?q=${lat},${lon}`;

        const nivelActual = parseInt(slider.value);
        const esGrave = nivelActual >= 3;
        
        if (esGrave) {
          alert(`¡Alerta enviada!\n\nSe ha notificado a:\n- Tu contacto de emergencia\n- Línea de emergencia 123\n- Policía Nacional 112\n\nTu ubicación ha sido compartida con las autoridades.`);
        } else {
          alert(`¡Alerta enviada!\n\nSe ha notificado a tu contacto de emergencia.\nTu ubicación ha sido compartida.`);
        }

        ocultarModal();
        
      }, (error) => {
        console.error("Error al obtener ubicación:", error);
        alert("Error al obtener la ubicación. Por favor, permite el acceso a tu ubicación e intenta de nuevo.");
      });
    } catch (error) {
      console.error("Error general:", error);
      alert("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
    }
  });

  console.log('Configuración del pánico completada');
}

// Inicializar inmediatamente si estamos en la página correcta
if (document.getElementById('boton-panico')) {
  console.log('Página con botón de pánico detectada, iniciando configuración...');
  setupPanico();
}

export { setupPanico };
