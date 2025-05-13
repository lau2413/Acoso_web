// auth.js
import { supabase } from './supabase.js';

// Función para verificar si hay una sesión activa
export async function checkSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si no hay sesión y no estamos en login.html o signin.html, redirigir al login
    const currentPath = window.location.pathname;
    if (!session && 
        !currentPath.includes('login.html') && 
        !currentPath.includes('signin.html')) {
      window.location.href = 'login.html';
      return false;
    }
    
    return session;
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return false;
  }
}

export async function updateSessionUI() {
  try {
    const session = await checkSession();
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
    localStorage.clear(); // Limpiamos todo el localStorage
    
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: correo,
          password: contrasena
        });

        if (error) {
          console.error('Error de login:', error);
          alert('Correo o contraseña incorrectos. Inténtalo de nuevo.');
          return;
        }

        if (data?.session) {
          // Guardar la sesión en localStorage
          localStorage.setItem('supabase.auth.token', data.session.access_token);
          
          alert('Inicio de sesión exitoso');
          window.location.href = 'index.html';
        }

      } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Hubo un problema. Intenta de nuevo más tarde.');
      }
    });
  }
}
