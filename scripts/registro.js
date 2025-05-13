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

      try {
        // Primero verificar si el correo ya existe
        const { data: existingUser, error: checkError } = await supabase
          .from("usuarios")
          .select("correo")
          .eq("correo", correo)
          .maybeSingle();

        if (checkError) {
          throw new Error("Error al verificar el correo: " + checkError.message);
        }

        if (existingUser) {
          alert("El correo ya está registrado.");
          return;
        }

        // Si el correo no existe, proceder con el registro
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: correo,
          password: contrasena,
        });

        if (signUpError) {
          throw new Error("Error al registrar usuario: " + signUpError.message);
        }

        // Insertar datos adicionales en la tabla 'usuarios'
        const { error: insertError } = await supabase
          .from("usuarios")
          .insert([
            {
              nombre: nombre,
              correo: correo,
              contrasena: contrasena,
              telefono: telefono,
              id: authData.user.id,
            },
          ]);

        if (insertError) {
          // Si hay error al insertar, eliminar el usuario de auth
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error("Error al guardar datos del usuario: " + insertError.message);
        }

        // Si todo sale bien, guardar el ID y redirigir
        localStorage.setItem("uid", authData.user.id);
        alert("Registro exitoso.");
        window.location.href = "contactos.html";

      } catch (error) {
        alert(error.message);
      }
    });
  }
}


  