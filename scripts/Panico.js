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
  const nivelTitulo = document.getElementById('nivel-titulo');
  const nivelDetalle = document.getElementById('nivel-detalle');
  const cerrarModal = document.getElementById('cerrar-modal');

  // Verificar que todos los elementos necesarios existen
  if (!btnPanico || !modalEmergencia || !slider || !enviarAlerta || !nivelTitulo || !nivelDetalle || !cerrarModal) {
    console.error('Faltan elementos necesarios para el botón de pánico');
    console.log('Elementos encontrados:', {
      btnPanico: !!btnPanico,
      modalEmergencia: !!modalEmergencia,
      slider: !!slider,
      enviarAlerta: !!enviarAlerta,
      nivelTitulo: !!nivelTitulo,
      nivelDetalle: !!nivelDetalle,
      cerrarModal: !!cerrarModal
    });
    return;
  }

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
      titulo: "Nivel 4: Severo",
      descripcion: "Presiones físicas o psicológicas para tener contacto sexual, violencia sexual explícita",
      color: "#cc0000"
    }
  };

  function mostrarModal() {
    console.log('Mostrando modal de emergencia');
    modalEmergencia.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
    slider.value = 1;
    actualizarNivelAcoso(1);
  }

  function ocultarModal() {
    console.log('Ocultando modal de emergencia');
    modalEmergencia.classList.add('hidden');
    document.body.style.overflow = ''; // Restaurar scroll
  }

  function actualizarNivelAcoso(nivel) {
    console.log('Actualizando nivel de acoso:', nivel);
    nivelTitulo.textContent = nivelesAcoso[nivel].titulo;
    nivelDetalle.textContent = nivelesAcoso[nivel].descripcion;
    nivelTitulo.style.color = nivelesAcoso[nivel].color;
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

  // Cerrar modal al hacer clic fuera
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
        
        // Simulación de envío de mensajes
        if (esGrave) {
          // Mensaje para casos graves (niveles 3 y 4)
          alert(`¡Alerta enviada!\n\nSe ha notificado a:\n- Tu contacto de emergencia\n- Línea de emergencia 123\n- Policía Nacional 112\n\nTu ubicación ha sido compartida con las autoridades.`);
        } else {
          // Mensaje para casos leves (niveles 1 y 2)
          alert(`¡Alerta enviada!\n\nSe ha notificado a tu contacto de emergencia.\nTu ubicación ha sido compartida.`);
        }

        ocultarModal();
        
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

// Inicializar inmediatamente si estamos en la página correcta
if (document.getElementById('boton-panico')) {
  setupPanico();
}

export { setupPanico };
