// Obtener elementos del DOM
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('expandedImage');
const closeBtn = document.getElementsByClassName('close')[0];
const tutorialImages = document.getElementsByClassName('tutorial-image');

// Agregar evento click a todas las imágenes del tutorial
Array.from(tutorialImages).forEach(img => {
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
    }
});

// Cerrar modal al hacer click en la X
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Cerrar modal al hacer click fuera de la imagen
modal.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        modal.style.display = "none";
    }
}); 