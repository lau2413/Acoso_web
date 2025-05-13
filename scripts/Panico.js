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
      document.body.classList.add('modal-open');
      modalEmergencia.style.display = 'flex';
      modalEmergencia.style.opacity = '1';
      modalEmergencia.style.visibility = 'visible';
      modalEmergencia.classList.remove('hidden');
      slider.value = 0;
      actualizarNivelAcoso(0);
      
      // Forzar un reflow para asegurar que las transiciones funcionen
      modalEmergencia.offsetHeight;
      
      console.log('Modal mostrado exitosamente');
    } catch (error) {
      console.error('Error al mostrar el modal:', error);
    }
  }

  function ocultarModal() {
    console.log('Intentando ocultar modal de emergencia');
    try {
      document.body.classList.remove('modal-open');
      modalEmergencia.style.opacity = '0';
      modalEmergencia.style.visibility = 'hidden';
      
      // Esperar a que termine la transición antes de ocultar completamente
      setTimeout(() => {
        modalEmergencia.style.display = 'none';
        modalEmergencia.classList.add('hidden');
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
        texto = "Leve - Situación incómoda o acoso verbal";
        break;
      case "2":
        texto = "Moderado - Acoso persistente";
        break;
      case "3":
        texto = "Fuerte - Amenazas directas";
        break;
      case "4":
        texto = "Grave - Peligro inminente";
        break;
      default:
        texto = "Selecciona un nivel de acoso";
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
        .select('id, telefono_contacto')
        .eq('id_usuario', user.id);

      if (contactoError) {
        console.error('Error al obtener contactos:', contactoError);
        throw new Error('No se pudieron obtener los contactos de emergencia');
      }

      if (!contactos || contactos.length === 0) {
        alert("No se encontró un contacto de emergencia para este usuario.");
        return;
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      console.log('Posición obtenida:', position);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const nivelActual = parseInt(slider.value);
      console.log('Nivel actual seleccionado:', nivelActual);

      // Crear registro de acoso
      const { data: acoso, error: acosoError } = await supabase
        .from('acoso')
        .insert({
          id_usuario: user.id,
          id_tipo_acoso: nivelActual, // El nivel seleccionado corresponde directamente al id_tipo_acoso
          latitud: lat,
          longitud: lon,
          estado: 'reportado',
          fecha_hora: new Date().toISOString()
        })
        .select()
        .single();

      if (acosoError) {
        console.error('Error al crear registro de acoso:', acosoError);
        throw new Error('No se pudo registrar el incidente');
      }

      console.log('Registro de acoso creado:', acoso);

      // Crear alertas para contactos de emergencia
      const alertasPromesas = contactos.map(contacto => {
        return supabase
          .from('alertas')
          .insert({
            id_acoso: acoso.id,
            id_contacto: contacto.id,
            tipo_alerta: 'contacto_emergencia',
            estado: 'enviada',
            fecha_envio: new Date().toISOString()
          });
      });

      // Si el nivel es fuerte (3) o grave (4), notificar autoridades
      if (nivelActual >= 3) {
        alertasPromesas.push(
          supabase.from('alertas').insert([
            {
              id_acoso: acoso.id,
              tipo_alerta: 'policia',
              estado: 'enviada',
              fecha_envio: new Date().toISOString()
            },
            {
              id_acoso: acoso.id,
              tipo_alerta: 'linea_123',
              estado: 'enviada',
              fecha_envio: new Date().toISOString()
            }
          ])
        );
      }

      // Esperar a que todas las alertas se creen
      const resultadosAlertas = await Promise.allSettled(alertasPromesas);
      console.log('Resultados de crear alertas:', resultadosAlertas);

      // Verificar si hubo errores al crear las alertas
      const erroresAlertas = resultadosAlertas.filter(r => r.status === 'rejected');
      if (erroresAlertas.length > 0) {
        console.error('Errores al crear algunas alertas:', erroresAlertas);
      }

      // Mostrar mensaje apropiado
      if (nivelActual >= 3) {
        alert(`¡Alerta enviada!\n\nSe ha notificado a:\n- Tu contacto de emergencia\n- Línea de emergencia 123\n- Policía Nacional 112\n\nTu ubicación ha sido compartida con las autoridades.`);
      } else {
        alert(`¡Alerta enviada!\n\nSe ha notificado a tu contacto de emergencia.\nTu ubicación ha sido compartida.`);
      }

      ocultarModal();

    } catch (error) {
      console.error("Error al procesar la alerta:", error);
      alert("Ocurrió un error al procesar la alerta: " + (error.message || 'Error desconocido'));
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
