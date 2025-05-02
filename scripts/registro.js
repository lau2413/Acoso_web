// registro.js
export function setupRegistro() {
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
  
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('correoUsuario', correo);
        localStorage.setItem('telefonoUsuario', telefono);
        localStorage.setItem('contrasenaUsuario', contrasena);
  
        window.location.href = 'contactos.html';
      });
    }
  }
  