// auth.js
import { supabase } from './supabase.js';

export async function updateSessionUI() {
  const { data: { user } } = await supabase.auth.getUser();
  const navList = document.querySelector('nav ul');
  if (!navList) return;

  const lastLi = navList.querySelector('li:last-child');
  if (lastLi) lastLi.remove();

  const loginLi = document.createElement('li');
  if (user) {
    loginLi.innerHTML = `<a href="login.html">Cerrar Sesión</a>`;
    navList.appendChild(loginLi);

    document.getElementById("logoutBtn").addEventListener("click", async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      location.reload();
    });
  } else {
    loginLi.innerHTML = `<a href="login.html">Iniciar Sesión</a>`;
    navList.appendChild(loginLi);
  }
}

export function LogIn() {
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
        window.location.href = 'index.html';

      } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Hubo un problema. Intenta de nuevo más tarde.');
      }
    });
  }
}
