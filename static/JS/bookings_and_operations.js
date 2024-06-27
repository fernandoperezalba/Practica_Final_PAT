/*
==================================================================================================
Reservas y operaciones
*/

function cancelReservation(reservationId) {
    // Aquí puedes hacer la llamada al backend para cancelar la reserva (cuando esté implementado)

    // Eliminar la fila de la tabla para actualizar la UI
    const reservationItem = document.querySelector(`.reservation-item[data-reservation-id='${reservationId}']`);
    if (reservationItem) {
        reservationItem.remove();
    }

    // Mostrar un mensaje opcionalmente
    alert(`Reserva ${reservationId} cancelada.`);
}