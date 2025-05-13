// auth.js
import { supabase } from './supabase.js';

export async function updateSessionUI() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const navList = document.querySelector('nav ul');
    if (!navList) return;

    // Buscar el último elemento li (donde está el botón de sesión)
    const lastLi = navList.querySelector('li:last-child');
    if (lastLi) lastLi.remove();

    const loginLi = document.createElement('li');
    
    if (session) {
      // Usuario está autenticado
      loginLi.innerHTML = `<a href="#" id="logoutBtn">Cerrar Sesión</a>`;
      navList.appendChild(loginLi);

      // Agregar el event listener para el cierre de sesión
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          await handleLogout();
        });
      }
    } else {
      // Usuario no está autenticado
      loginLi.innerHTML = `<a href="login.html">Iniciar Sesión</a>`;
      navList.appendChild(loginLi);
    }
  } catch (error) {
    console.error('Error al actualizar UI de sesión:', error);
  }
}

export async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Limpiar el almacenamiento local
    localStorage.removeItem('uid');
    
    // Redirigir al login
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Por favor intenta de nuevo.');
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

        if (loginData?.user) {
          localStorage.setItem('uid', loginData.user.id);
          // Actualizar la UI inmediatamente después del login
          await updateSessionUI();
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
