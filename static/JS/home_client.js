// Añade un evento para cerrar el dropdown al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        if (!menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
});

// Añade un evento para que el dropdown se mantenga abierto cuando se está sobre él
const dropdownTogglers = document.querySelectorAll('.nav-item.dropdown');
dropdownTogglers.forEach(toggler => {
    toggler.addEventListener('mouseover', function() {
        const dropdownMenu = toggler.querySelector('.dropdown-menu');
        dropdownMenu.style.display = 'block';
    });

    toggler.addEventListener('mouseout', function() {
        const dropdownMenu = toggler.querySelector('.dropdown-menu');
        dropdownMenu.style.display = 'none';
    });
});
