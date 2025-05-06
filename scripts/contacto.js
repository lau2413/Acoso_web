// contacto.js
import { supabase } from './supabase.js';

export function setupContacto() {
  const formContacto = document.getElementById('contacto-emergencia-form');

  if (!formContacto) return;

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

    // Obtener el ID del usuario desde el localStorage
    const uid = localStorage.getItem('uid');
    if (!uid) {
      alert("No se encontró el ID del usuario. Inicia sesión o regístrate nuevamente.");
      return;
    }

    try {
      const { error: contactoError } = await supabase
        .from('contactos')
        .insert([{
          id_usuario: uid,  // Usar el ID almacenado en el localStorage
          nombre_contacto: nombre,
          telefono_contacto: telefono,
          relacion
        }]);

      if (contactoError) throw contactoError;

      alert("Contacto guardado exitosamente.");
      window.location.href = 'index.html';

    } catch (error) {
      console.error('Error guardando contacto:', error);
      alert("Error al guardar el contacto. Intenta nuevamente.");
    }
  });
}
