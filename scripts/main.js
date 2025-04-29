// Supabase conexión y bcrypt para encriptar contraseñas
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://vzqhafehwzfviqprwvbf.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cWhhZmVod3pmdmlxcHJ3dmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTM1NjgsImV4cCI6MjA2MDU4OTU2OH0.5YJvlpdAS-mUpnor0V2SHwj3yHTzkExyKHtG1w1WFAI'; 
const supabase = createClient(supabaseUrl, supabaseKey);
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

// Enviar alerta basada en el nivel seleccionado
enviarAlerta?.addEventListener('click', async () => {
  try {
    const response = await fetch(
      'https://turbo-cod-x5wq5wqjvpp73pxrv-3000.app.github.dev',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('ACc38625a993719beb95e6ac9154570709:5001c19902f678ba32ea5ed40143edda'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'To': '+573197697334',  // Número destino (reemplaza con el real)
          'From': '+13163892927', // Tu número Twilio
          'Body': '🚨 ¡Esta es una alerta de prueba!',
        }),
      }
    );

    const data = await response.json();
    console.log("SMS enviado:", data.sid);
    alert("Mensaje enviado correctamente");
  } catch (error) {
    console.error("Error:", error);
    alert("Error al enviar el mensaje");
  }
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

    localStorage.setItem('nombreUsuario', nombre);
    localStorage.setItem('correoUsuario', correo);
    localStorage.setItem('telefonoUsuario', telefono);
    localStorage.setItem('contrasenaUsuario', contrasena);

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

      try {
        // Crear usuario
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: correo,
          password: contrasena
        });

        if (authError) throw authError;

        // Login
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

        // Insertar usuario
        const { error: usuarioError } = await supabase
          .from('usuarios')
          .insert([{ id: uid, nombre: nombreUsuario, correo, contrasena, telefono: telefonoUsuario }])
          .select()
          .single();

        if (usuarioError) throw usuarioError;

        // Insertar contacto
        const contactoNombre = localStorage.getItem('contactoNombre');
        const contactoTelefono = localStorage.getItem('contactoTelefono');
        const contactoRelacion = localStorage.getItem('contactoRelacion');

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
        alert('Ocurrió un error al registrar los datos.');
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

 //LOG IN
 const formLogin = document.getElementById('formulario_login');

 if (formLogin) {
   formLogin.addEventListener('submit', async (e) => {
     e.preventDefault();

     const correo = document.getElementById('loginUsername').value.trim();
     const contrasena = document.getElementById('loginPassword').value.trim();

     if (!correo || !contrasena) {
       alert("Por favor ingresa tu correo y contraseña.");
       return;
     }

     try {
       const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
         email: correo,
         password: contrasena
       });

       if (loginError) {
         console.error('Error de login:', loginError);
         alert('Correo o contraseña incorrectos. Inténtalo de nuevo.');
         return;
       }

       alert('Inicio de sesión exitoso');
       window.location.href = 'index.html'; // Redirige al inicio 

     } catch (error) {
       console.error('Error al intentar iniciar sesión:', error);
       alert('Hubo un problema. Intenta de nuevo más tarde.');
     }
   });
  }
});
