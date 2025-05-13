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

document.addEventListener('DOMContentLoaded', function() {
    const imageContainers = document.querySelectorAll('.tutorial-image-container');
    const modal = document.createElement('div');
    modal.className = 'modal';
    document.body.appendChild(modal);

    imageContainers.forEach(container => {
        container.addEventListener('click', function() {
            const img = this.querySelector('.tutorial-image');
            modal.innerHTML = `
                <span class="modal-close">&times;</span>
                <img src="${img.src}" class="modal-content" alt="${img.alt}">
            `;
            modal.classList.add('active');
        });
    });

    modal.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
            modal.classList.remove('active');
        }
    });
}); 