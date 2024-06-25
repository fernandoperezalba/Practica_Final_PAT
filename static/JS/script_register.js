document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('repeat_password').value;
    const role = document.getElementById('role').value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Aquí puedes agregar la lógica para manejar el registro
    // Por ejemplo, enviar los datos a un servidor o guardarlos localmente
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    console.log('Rol:', role);

    // Ejemplo de registro simple
    alert('Registro exitoso');
});

document.getElementById('login-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'login.html';
});
