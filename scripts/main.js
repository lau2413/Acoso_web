// Supabase conexión y bcrypt para encriptar contraseñas
import { LogIn, updateSessionUI } from './auth.js';
import { supabase } from "./supabase.js";
// Configuración de Twilio (reemplaza con tus datos reales)
const TWILIO_SID = "ACc38625a993719beb95e6ac9154570709"; // Account SID de Twilio
const TWILIO_TOKEN = "82d829c04c269e2c3791605f45bfc93c"; // Auth Token de Twilio
const TWILIO_NUMBER = "+13163892927"; // Tu número Twilio 
const EMERGENCY_NUMBER = "+573197697334"; // Número de contacto en Colombia

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada correctamente');

  // BOTÓN DE PÁNICO 
  const btnPanico = document.getElementById('boton-panico');
  const modalEmergencia = document.getElementById('modal-emergencia');
  const slider = document.getElementById('slider-acoso');
  const enviarAlerta = document.getElementById('enviar-alerta');
  const nivel = document.getElementById('nivel-acoso');

  const cerrarModal = document.getElementById('cerrar-modal');

  const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";


  btnPanico?.addEventListener('click', () => modalEmergencia?.classList.remove('hidden'));
  cerrarModal?.addEventListener('click', () => modalEmergencia?.classList.add('hidden'));
  // Mostrar nivel inicial al cargar
if (nivel && slider) {
  const val = parseInt(slider.value);
  nivel.textContent = `Nivel ${val}: ${val <= 2 ? 'Leve' : 'Grave'}`;
  nivel.style.color = val <= 2 ? 'orange' : 'red';
}


  // Mostrar nivel dinámico según valor del slider
slider?.addEventListener('input', () => {
  const val = parseInt(slider.value);
  let texto = `Nivel ${val}: `;
  texto += (val <= 2) ? 'Leve' : 'Grave';
  nivel.textContent = texto;
  nivel.style.color = (val <= 2) ? 'orange' : 'red';
});

//Enviar alerta segun el nivel
enviarAlerta?.addEventListener('click', async () => {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  // Obtener usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    alert("No se pudo obtener el usuario actual. Inicia sesión nuevamente.");
    return;
  }

  // Obtener contacto de emergencia del usuario
  const { data: contactos, error: contactoError } = await supabase
    .from('contactos')
    .select('telefono_contacto')
    .eq('id_usuario', user.id)
    .limit(1);

  if (contactoError || !contactos || contactos.length === 0) {
    alert("No se encontró un contacto de emergencia para este usuario.");
    console.log("Usuario actual:", user.id);

  const { data: contactos, error: contactoError } = await supabase
  .from('contactos')
  .select('telefono_contacto')
  .eq('id_usuario', user.id)
  .limit(1);

  console.log("Contactos encontrados:", contactos);

    return;
  }

  const numeroEmergencia = contactos[0].telefono_contacto;
  if (!numeroEmergencia.startsWith("+")) {
    alert("El número del contacto debe estar en formato internacional, ejemplo +573001234567");
    return;
  }

  // Obtener geolocalización
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

const formRegistro = document.getElementById('registro-form');

if (formRegistro) {
  formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    if (!nombre || !correo || !telefono || !contrasena) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (contrasena.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Si todo está bien, guardar temporalmente
    localStorage.setItem('nombreUsuario', nombre);
    localStorage.setItem('correoUsuario', correo);
    localStorage.setItem('telefonoUsuario', telefono);
    localStorage.setItem('contrasenaUsuario', contrasena);

    // Ir a pantalla de contactos
    window.location.href = 'contactos.html'; 
  });
}



const formContacto = document.getElementById('contacto-emergencia-form');

if (formContacto) {
  formContacto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = formContacto["nombre-contacto"].value.trim();
    const telefono = formContacto["telefono-contacto"].value.trim();
    const relacion = formContacto["relacion-contacto"].value;

    if (!nombre || !telefono || !relacion) {
      alert("Por favor completa todos los campos.");
      return;
    }
    if (!/^\d{10}$/.test(telefono)) {
      alert("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    // Guardar temporalmente en localStorage
    localStorage.setItem('contactoNombre', nombre);
    localStorage.setItem('contactoTelefono', telefono);
    localStorage.setItem('contactoRelacion', relacion);

    // MOSTRAR MODAL primero (antes de crear usuario)
    const modal = document.getElementById('modal-encuesta');
    const textoModal = document.getElementById('texto-modal');
    const btnSi = document.getElementById('btn-si');
    const btnNo = document.getElementById('btn-no');

    const nombreUsuario = localStorage.getItem('nombreUsuario');

    textoModal.textContent = `${nombreUsuario}, tu contacto ha sido registrado exitosamente.\n¿Deseas completar una breve encuesta?`;
    modal.classList.remove('hidden');

    // --- FUNCIONES AL CLIC EN "SÍ" o "NO" ---

    async function crearUsuarioYContacto() {
      const correo = localStorage.getItem('correoUsuario');
      const contrasena = localStorage.getItem('contrasenaUsuario');
      const telefonoUsuario = localStorage.getItem('telefonoUsuario');
    
      const nombreUsuario = localStorage.getItem('nombreUsuario');
      const contactoNombre = localStorage.getItem('contactoNombre');
      const contactoTelefono = localStorage.getItem('contactoTelefono');
      const contactoRelacion = localStorage.getItem('contactoRelacion');
    
      // Validaciones antes de registrar
      if (!correo || !contrasena || !telefonoUsuario || !nombreUsuario) {
        alert("Faltan datos del usuario. Por favor, completa el formulario de registro nuevamente.");
        return false;
      }
      
      if (contrasena.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
      }
    
      if (!contactoNombre || !contactoTelefono || !contactoRelacion) {
        alert("Faltan datos del contacto de emergencia.");
        return false;
      }
    
      try {
        // Crear usuario en auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: correo,
          password: contrasena
        });
    
        if (authError) throw authError;
    
        // Login inmediato
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: correo,
          password: contrasena
        });
    
        if (loginError || !loginData.session) throw loginError;
    
        await supabase.auth.setSession({
          access_token: loginData.session.access_token,
          refresh_token: loginData.session.refresh_token
        });
    
        const uid = loginData.user.id;
    
        // Insertar en tabla usuarios
        const { error: usuarioError } = await supabase
          .from('usuarios')
          .insert([{ id: uid, nombre: nombreUsuario, correo, contrasena, telefono: telefonoUsuario }]);
    
        if (usuarioError) throw usuarioError;
        // Insertar contacto de emergencia
        const { error: contactoError } = await supabase
          .from('contactos')
          .insert([{
            id_usuario: uid,
            nombre_contacto: contactoNombre,
            telefono_contacto: contactoTelefono,
            relacion: contactoRelacion
          }]);
    
        if (contactoError) throw contactoError;
    
        return true;
    
      } catch (error) {
        console.error('Error registrando usuario o contacto:', error);
        alert('Ocurrió un error al registrar los datos. Revisa los campos e intenta de nuevo.');
        return false;
      }
    }
    

    btnSi.onclick = async () => {
      modal.classList.add('hidden');
      const creado = await crearUsuarioYContacto();
      if (creado) {
        window.location.href = 'encuesta.html'; // Si dice "sí", va a encuesta
      }
    };

    btnNo.onclick = async () => {
      modal.classList.add('hidden');
      const creado = await crearUsuarioYContacto();
      if (creado) {
        alert('Tu registro ha sido finalizado exitosamente.');
        window.location.href = 'index.html'; // Si dice "no", regresa a inicio
      }
    };
  });
}


// PASO 3: FORMULARIO ENCUESTA
const formEncuesta = document.getElementById('encuesta-form');
const avanzarBtn = document.getElementById('avanzar-btn');

if (formEncuesta) {
  formEncuesta.addEventListener('change', () => {
    const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
    avanzarBtn.style.display = respuestasSeleccionadas.length === 10 ? "block" : "none";
  });

  formEncuesta.addEventListener('submit', async (event) => {
    event.preventDefault();

    const respuestasSeleccionadas = formEncuesta.querySelectorAll('input[type="radio"]:checked');
    if (respuestasSeleccionadas.length < 10) {
      alert('Por favor, responde todas las preguntas antes de enviar.');
      return;
    }

    try {
      // UID del usuario logueado
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.error('No se pudo obtener el usuario:', userError);
        alert('No se pudo identificar al usuario. Inicia sesión nuevamente.');
        window.location.href = 'login.html'; 
        return;
      }

      const uid = userData.user.id; // ID del usuario logueado

      // Insertar respuestas
      const respuestas = [];

      for (const radio of respuestasSeleccionadas) {
        const id_opcion = parseInt(radio.value);
        const id_pregunta = parseInt(radio.name.replace('q', ''));

        respuestas.push({
          id_usuario: uid,
          id_opcion,
          id_pregunta
        });
      }

      const { error: respuestaError } = await supabase
        .from('respuestas')
        .insert(respuestas);

      if (respuestaError) throw respuestaError;

      localStorage.clear();
      alert('¡Gracias por completar la encuesta! Tu registro ha sido finalizado exitosamente.');
      window.location.href = 'index.html';

    } catch (err) {
      console.error('Error al guardar las respuestas:', err);
      alert('Ocurrió un error al enviar tus respuestas. Intenta de nuevo.');
    }
  });
}

 // GLOSARIO: Manejo del menú móvil y navegación
 const navToggle = document.querySelector('.nav-toggle');
 const nav = document.querySelector('nav');
 
 if (navToggle) {
   navToggle.addEventListener('click', function() {
     nav.classList.toggle('active');
   });
 }
 
 // Cerrar el menú al hacer clic en un enlace
 const navLinks = document.querySelectorAll('nav a');
 navLinks.forEach(link => {
   link.addEventListener('click', function() {
     if (window.innerWidth <= 768) {
       nav.classList.remove('active');
     }
   });
 });
 
 // Scroll suave para las referencias internas
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function(e) {
     e.preventDefault();
     
     const targetId = this.getAttribute('href');
     const targetElement = document.querySelector(targetId);
     
     if (targetElement) {
       window.scrollTo({
         top: targetElement.offsetTop - 100,
         behavior: 'smooth'
       });
     }
   });
 });

if (document.querySelector('#formulario_login')) {
  LogIn();
}
 updateSessionUI();
});