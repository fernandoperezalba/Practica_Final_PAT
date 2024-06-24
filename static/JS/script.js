document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    // Por ejemplo, enviar los datos a un servidor o validar localmente
    console.log('Usuario:', username);
    console.log('Contraseña:', password);

    // Ejemplo de validación simple
    if (username === 'admin' && password === 'admin') {
        alert('Inicio de sesión exitoso');
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

document.getElementById('register-link').addEventListener('click', function(event) {
    event.preventDefault();
    // Aquí puedes agregar la lógica para manejar el registro
    alert('Redirigir al formulario de registro');
});
