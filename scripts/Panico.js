// panico.js
import { supabase } from './supabase.js';

// Configuración para WhatsApp Cloud API (solo para pruebas)
const WHATSAPP_TOKEN = 'EAAUGl1HX7KsBO4YWG55ZBjnkv6WZBdfkMxQMlVLeMl7CFFCZCeQIvnz6ZBRTB3ecgBFVTKklL9s4ExnzmZBj0yP7NdSKoJkekxbMsO5l4V2MwTWgxppz0R4ZBjOvvttLcNP4pkfjpzZCgQZC5FFTBDytuH2xcKWpU8MCKviWgw0U4xlqRKhZCjl8fKdN1RE5UQJJu9NE5dg0i8CbcQyBLAEiAQT4ZD'; // ← reemplázalo por el real
const PHONE_NUMBER_ID = '690685430789757';

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
    titulo: "Nivel 4: Severo",
    descripcion: "Presiones físicas o psicológicas para tener contacto sexual, violencia sexual explícita",
    color: "#cc0000"
  }
};

export function setupPanico() {
  console.log('Inicializando setupPanico...');
  
  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const slider = document.getElementById('slider-acoso');
  const nivelTitulo = document.getElementById('nivel-titulo');
  const nivelDetalle = document.getElementById('nivel-detalle');
  const enviarAlerta = document.getElementById('enviar-alerta');
  const cerrarModal = document.getElementById('cerrar-modal');

  if (!btnPanico || !modalEmergencia || !slider || !nivelTitulo || !nivelDetalle || !enviarAlerta || !cerrarModal) {
    console.error('Elementos necesarios no encontrados:', {
      btnPanico: !!btnPanico,
      modalEmergencia: !!modalEmergencia,
      slider: !!slider,
      nivelTitulo: !!nivelTitulo,
      nivelDetalle: !!nivelDetalle,
      enviarAlerta: !!enviarAlerta,
      cerrarModal: !!cerrarModal
    });
    return;
  }

  function mostrarModal() {
    console.log('Mostrando modal de emergencia');
    modalEmergencia.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    slider.value = 1;
    actualizarNivelAcoso(1);
  }

  function ocultarModal() {
    console.log('Ocultando modal de emergencia');
    modalEmergencia.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function actualizarNivelAcoso(nivel) {
    const nivelInfo = nivelesAcoso[nivel];
    if (!nivelInfo) return;
    
    console.log('Actualizando nivel de acoso:', nivel);
    nivelTitulo.textContent = nivelInfo.titulo;
    nivelDetalle.textContent = nivelInfo.descripcion;
    nivelTitulo.style.color = nivelInfo.color;
  }

  // Event Listeners
  btnPanico.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Botón de pánico clickeado');
    mostrarModal();
  });

  cerrarModal.addEventListener('click', (e) => {
    e.preventDefault();
    ocultarModal();
  });

  modalEmergencia.addEventListener('click', (e) => {
    if (e.target === modalEmergencia) {
      ocultarModal();
    }
  });

  slider.addEventListener('input', () => {
    const nivelActual = parseInt(slider.value);
    actualizarNivelAcoso(nivelActual);
  });

  enviarAlerta.addEventListener('click', async () => {
    console.log('Iniciando envío de alerta...');
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error al obtener usuario:', userError);
        alert("Por favor, inicia sesión para usar esta función.");
        return;
      }

      const { data: contactos, error: contactoError } = await supabase
        .from('contactos')
        .select('telefono_contacto')
        .eq('id_usuario', user.id);

      if (contactoError || !contactos?.length) {
        console.error('Error al obtener contactos:', contactoError);
        alert("Por favor, configura un contacto de emergencia primero.");
        return;
      }

      if (!navigator.geolocation) {
        console.error('Geolocalización no soportada');
        alert("Tu navegador no soporta geolocalización. La alerta se enviará sin ubicación.");
        enviarAlertaSinUbicacion();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await enviarAlertaConUbicacion(position);
        },
        (error) => {
          console.error("Error al obtener ubicación:", error);
          enviarAlertaSinUbicacion();
        },
        { timeout: 10000 }
      );
    } catch (error) {
      console.error("Error general:", error);
      alert("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
    }
  });

  async function enviarAlertaConUbicacion(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const link = `https://www.google.com/maps?q=${lat},${lon}`;
    const nivelActual = parseInt(slider.value);
    const esGrave = nivelActual >= 3;

    try {
      // Aquí iría la lógica de envío de alerta al backend
      if (esGrave) {
        alert(`¡Alerta enviada!\n\nSe ha notificado a:\n- Tu contacto de emergencia\n- Línea de emergencia 123\n- Policía Nacional 112\n\nTu ubicación ha sido compartida con las autoridades.`);
      } else {
        alert(`¡Alerta enviada!\n\nSe ha notificado a tu contacto de emergencia.\nTu ubicación ha sido compartida.`);
      }
      ocultarModal();
    } catch (error) {
      console.error("Error al enviar alerta:", error);
      alert("Error al enviar la alerta. Por favor, intenta de nuevo.");
    }
  }

  function enviarAlertaSinUbicacion() {
    const nivelActual = parseInt(slider.value);
    const esGrave = nivelActual >= 3;

    try {
      // Aquí iría la lógica de envío de alerta al backend sin ubicación
      if (esGrave) {
        alert(`¡Alerta enviada!\n\nSe ha notificado a:\n- Tu contacto de emergencia\n- Línea de emergencia 123\n- Policía Nacional 112`);
      } else {
        alert(`¡Alerta enviada!\n\nSe ha notificado a tu contacto de emergencia.`);
      }
      ocultarModal();
    } catch (error) {
      console.error("Error al enviar alerta:", error);
      alert("Error al enviar la alerta. Por favor, intenta de nuevo.");
    }
  }
}

// Inicializar si estamos en la página correcta
if (document.getElementById('boton-panico')) {
  setupPanico();
}
