document.addEventListener('DOMContentLoaded', function() {
    const entregaBtn = document.getElementById('entregaBtn');
    const recogidaBtn = document.getElementById('recogidaBtn');
    const formContainer = document.getElementById('formContainer');

    entregaBtn.addEventListener('click', function() {
        entregaBtn.style.display = 'none';
        recogidaBtn.style.display = 'none';
        formContainer.style.display = 'block';
        document.getElementById('codigoEntrega').placeholder = "Código entrega";
    });

    recogidaBtn.addEventListener('click', function() {
        entregaBtn.style.display = 'none';
        recogidaBtn.style.display = 'none';
        formContainer.style.display = 'block';
        document.getElementById('codigoEntrega').placeholder = "Código recogida";
    });
});
