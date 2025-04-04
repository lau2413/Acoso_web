document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que la página se recargue

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Usuario y contraseña correctos (puedes cambiarlos por los que quieras)
    let userCorrecto = "usuario123";
    let passCorrecta = "clave123";

    if (username === userCorrecto && password === passCorrecta) {
        window.location.href = "encuesta.html"; // Ir a la encuesta
    } else {
        document.getElementById("errorMsg").textContent = "Usuario o contraseña incorrectos.";
    }
});

