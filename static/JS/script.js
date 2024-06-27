document.addEventListener("DOMContentLoaded", function() {
    const navbarToggler = document.getElementById("navbarToggler");
    const navbarMenu = document.getElementById("navbarMenu");

    // Añade un evento que alterna la visibilidad del menú (navbar-menu) cuando se hace clic en el botón de hamburguesa
    // (navbar-toggler)
    navbarToggler.addEventListener("click", function() {
        if (navbarMenu.style.display === "flex") {
            navbarMenu.style.display = "none";
        } else {
            navbarMenu.style.display = "flex";
        }
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

    // Añade un evento para mostrar u ocultar el menú según cambie el tamaño de la pantalla del navegador
    window.addEventListener('resize', function(){
        if(window.innerWidth >= 769){
            navbarMenu.style.display = "flex";
        } else{
            navbarMenu.style.display = "none";
        }
    });
});
