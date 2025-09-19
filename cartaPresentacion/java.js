document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-contact');
    const contactInfo = document.getElementById('contact-info');

    toggleButton.addEventListener('click', () => {
        if (contactInfo.classList.contains('contact-hidden')) {
            contactInfo.classList.remove('contact-hidden');
            toggleButton.textContent = 'Ocultar contacto';
        } else {
            contactInfo.classList.add('contact-hidden');
            toggleButton.textContent = 'Mostrar contacto';
        }
    });
});