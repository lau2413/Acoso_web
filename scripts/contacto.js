// contacto.js
import { supabase } from './supabase.js';

export function setupContacto() {
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

      localStorage.setItem('contactoNombre', nombre);
      localStorage.setItem('contactoTelefono', telefono);
      localStorage.setItem('contactoRelacion', relacion);

      const modal = document.getElementById('modal-encuesta');
      const textoModal = document.getElementById('texto-modal');
      const btnSi = document.getElementById('btn-si');
      const btnNo = document.getElementById('btn-no');

      const nombreUsuario = localStorage.getItem('nombreUsuario');
      textoModal.textContent = `${nombreUsuario}, tu contacto ha sido registrado exitosamente.\n¿Deseas completar una breve encuesta?`;
      modal.classList.remove('hidden');

      async function crearUsuarioYContacto() {
        const correo = localStorage.getItem('correoUsuario');
        const contrasena = localStorage.getItem('contrasenaUsuario');
        const telefonoUsuario = localStorage.getItem('telefonoUsuario');

        const nombreUsuario = localStorage.getItem('nombreUsuario');
        const contactoNombre = localStorage.getItem('contactoNombre');
        const contactoTelefono = localStorage.getItem('contactoTelefono');
        const contactoRelacion = localStorage.getItem('contactoRelacion');

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
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: correo,
            password: contrasena
          });

          if (authError) throw authError;

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

          const { error: usuarioError } = await supabase
            .from('usuarios')
            .insert([{ id: uid, nombre: nombreUsuario, correo, contrasena, telefono: telefonoUsuario }]);

          if (usuarioError) throw usuarioError;

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
          window.location.href = 'encuesta.html';
        }
      };

      btnNo.onclick = async () => {
        modal.classList.add('hidden');
        const creado = await crearUsuarioYContacto();
        if (creado) {
          alert('Tu registro ha sido finalizado exitosamente.');
          window.location.href = 'index.html';
        }
      };
    });
  }
}
