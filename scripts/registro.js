// registro.js
import { supabase } from './supabase.js';

export function setupRegistro() {
  const registerForm = document.getElementById("registro-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = registerForm["nombre"].value;
      const correo = registerForm["email"].value;
      const contrasena = registerForm["contrasena"].value;
      const telefono = registerForm["telefono"].value;

      // Validación del teléfono
      if (!/^\d{10,}$/.test(telefono)) {
        alert("El número de teléfono debe tener al menos 10 dígitos.");
        return;
      }

      // Verificar si el correo ya existe en tu tabla 'usuarios'
      const { data: existingUser, error: checkError } = await supabase
        .from("usuarios")
        .select("correo")
        .eq("correo", correo)
        .maybeSingle();

      if (checkError) {
        alert("Error al verificar el correo: " + checkError.message);
        return;
      }

      // Registro en Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: correo,
        password: contrasena,
      });

      if (signUpError) {
        alert("Error al registrar usuario: " + signUpError.message);
        return;
      }

      // Insertar datos adicionales en tu tabla 'usuarios'
      const { data: insertData, error: insertError } = await supabase
        .from("usuarios")
        .insert([
          {
            nombre: nombre,
            correo: correo,
            contrasena: contrasena,
            telefono: telefono,
            id: authData.user.id, // FK con el UUID de auth.users
          },
        ]);

      if (insertError) {
        // Eliminar el usuario si ocurre un error al insertar
        await supabase.auth.admin.deleteUser(authData.user.id); // Usar authData.user.id en lugar de userId
          
        if (
          insertError.message.includes("duplicate key value") &&
          insertError.message.includes("telefono")
        ) {
          alert("El número de teléfono ya está registrado.");
        } else {
          alert("Error al guardar datos del usuario: " + insertError.message);
        }
        return;
      }
        
      if (existingUser) {
        alert("El correo ya está registrado.");
        return;
      }

      // Guardar el ID del usuario en localStorage para usarlo en otras partes
      localStorage.setItem("uid", authData.user.id);

      alert("Registro exitoso.");
      window.location.href = "contactos.html";
    });
  }
}


  