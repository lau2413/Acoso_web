console.log("Script conectado");

// ====================
// SIGNIN.HTML (registro de usuario)
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');
  
    if (registroForm) {
      registroForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
  
        if (!nombre || !correo || !contrasena) {
          alert("Por favor, completa todos los campos.");
          return;
        }
  
        // Guardar en localStorage: hay que cambiar para usar con BD!!!
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('correoUsuario', correo);
        localStorage.setItem('contrasenaUsuario', contrasena);
  
        // Redirigir al segundo paso del registro
        location.href = "contacto-emergencia-section";
      });
    }
  
    // ====================
    // CONTACTOS.HTML (registro de contacto)
    // ====================
    const contactoForm = document.getElementById('contacto-emergencia-form');
  
    if (contactoForm) {
      contactoForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const nombre = contactoForm["nombre-contacto"].value.trim();
        const telefono = contactoForm["telefono-contacto"].value.trim();
        const relacion = contactoForm["relacion-contacto"].value;
        const nombreUsuario = localStorage.getItem('nombreUsuario') || "Usuario";
  
        if (!/^\d{10}$/.test(telefono)) {
          alert("El teléfono debe tener exactamente 10 dígitos.");
          return;
        }
  
        if (!nombre || !relacion) {
          alert("Por favor completa todos los campos del contacto.");
          return;
        }
  
        // guardado exitoso
        alert(`¡Registro completo!\n${nombreUsuario} fue registrado junto a su contacto "${nombre}".`);
  
        // Limpiar datos
        localStorage.clear();
        contactoForm.reset();
  
        // Redirigir a login
        window.location.href = "login.html";
      });
    }
  });