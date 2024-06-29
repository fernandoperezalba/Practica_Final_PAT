const warehouses = [
    {
        id: 'AB12C34D',
        address: 'Calle Blasco de Garay 4, 28015, Madrid, España',
        maxCapacity: 4,
        freeCapacity: 1,
        creationDate: '2023-01-01',
        lastReview: '2024-01-01',
        location: null, // Será geocodificado
        slots: [
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Cerrado', situation: 'Bloqueado' },
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Abierto', situation: 'En funcionamiento' }
        ]
    },
    {
        id: 'BX12R89T',
        address: 'Paseo de la Castellana 80, 28046, Madrid, España',
        maxCapacity: 2,
        freeCapacity: 2,
        creationDate: '2023-01-01',
        lastReview: '2024-01-01',
        location: null, // Será geocodificado
        slots: [
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Abierto', situation: 'En funcionamiento' }
        ]
    },
    {
        id: 'CX12R89T',
        address: 'Avenida del Litoral 34, 08005, Sant Martí, Barcelona, España',
        maxCapacity: 2,
        freeCapacity: 2,
        creationDate: '2023-01-01',
        lastReview: '2024-01-01',
        location: null, // Será geocodificado
        slots: [
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Abierto', situation: 'En funcionamiento' }
        ]
    }
    // Agrega más almacenes según sea necesario
];

let map, markers = [];

async function initMap() {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    await updateData(); // Llama a la función para cargar datos iniciales

    // Inicializar calendarios
    const now = new Date();
    $("#start-date").datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm",
        minDateTime: now,
        onSelectDate: async function(selectedDate) {
            await updateData(selectedDate);
        },
        onSelectTime: async function(selectedTime) {
            const selectedDate = new Date($("#start-date").val() + ' ' + selectedTime);
            await updateData(selectedDate);
        }
    });

    $("#end-date").datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm",
        minDateTime: now,
        onSelectDate: async function(selectedDate) {
            await updateData(selectedDate);
        },
        onSelectTime: async function(selectedTime) {
            const selectedDate = new Date($("#end-date").val() + ' ' + selectedTime);
            await updateData(selectedDate);
        }
    });

}

async function updateData(selectedDate = null) {
    try {
        const startDate = selectedDate || new Date($("#start-date").val());
        const endDate = new Date($("#end-date").val());


        // Si no hay fechas seleccionadas, no mostramos nada
        if (startDate=='Invalid Date' || endDate=='Invalid Date') {
            clearMapAndList();
            return;
        }

        const newData = await fetchData(startDate, endDate);

        // Limpiar el mapa y la lista antes de actualizar
        clearMapAndList();

        // Actualizar warehouses con los datos nuevos
        //warehouses.length = 0; // Vaciar el array
        //warehouses.push(...newData);

        // Actualizar el mapa y la lista con los nuevos datos
        await Promise.all(warehouses.map(async (warehouse, index) => {
            const location = await geocodeAddress(warehouse.address);
            warehouse.location = location;

            const marker = L.marker(location).addTo(map)
                .bindPopup(`<div><strong>${warehouse.id}</strong><br>${warehouse.address}</div>`);

            marker.on('click', () => {
                map.setView(location, 14);
                marker.openPopup();
            });

            markers.push(marker);

            // Añadir el punto a la lista
            const listItem = document.createElement('li');
            listItem.className = 'warehouse-item';
            listItem.innerHTML = `
                <div class="warehouse-id" data-index="${index}"><strong>ID:</strong> ${warehouse.id}</div>
                <div><strong>Dirección:</strong> ${warehouse.address}</div>
                <div><strong>Capacidad:</strong> ${warehouse.freeCapacity}/${warehouse.maxCapacity}</div>
                <div><strong>Disponibilidad:</strong>
                    ${Array(warehouse.maxCapacity).fill().map((_, i) => {
                        return `<span class="badge ${i < warehouse.freeCapacity ? 'badge-success' : 'badge-danger'}"></span>`;
                    }).join(' ')}
                </div>
                <div>
                    <strong>Huecos:</strong>
                    ${warehouse.slots.map((slot, i) => {
                        return `<div class="slot">
                            <span>Hueco ${i + 1}: </span>
                            <input type="checkbox" data-id="${warehouse.id}" data-slot="${i}" class="slot-checkbox">
                        </div>`;
                    }).join('')}
                </div>
            `;
            listItem.querySelector('.warehouse-id').addEventListener('click', () => {
                map.setView(location, 14);
                marker.openPopup();
            });
            document.getElementById('warehouse-list').appendChild(listItem);
        }));

        // Centrar el mapa en la primera ubicación
        if (warehouses.length > 0 && warehouses[0].location) {
            map.setView(warehouses[0].location, 14);
        }

    } catch (error) {
        console.error('Error al actualizar datos:', error);
    }
}

function clearMapAndList() {
    // Limpiar marcadores del mapa
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Limpiar lista de almacenes
    const warehouseList = document.getElementById('warehouse-list');
    warehouseList.innerHTML = '';
}

async function fetchData(startDate, endDate) {
    // Simular fetch con datos dummy, cambiarías esto por tu lógica de fetch real

    if (!startDate || !endDate) {
        return []; // Si no hay fechas válidas, devuelve una lista vacía
    }

    // Aquí deberías realizar tu lógica de fetch real para obtener datos según las fechas
    // Por ahora, devolvemos datos dummy
    return warehouses
}

async function geocodeAddress(address) {
    const apiKey = 'e17f9f72dbd44f93bbe8e1b7b07d7166';
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`);
    const data = await response.json();
    if (data.features.length > 0) {
        const { lat, lon } = data.features[0].properties;
        return [lat, lon];
    }
    throw new Error('Geocoding failed');
}

// Listener para el botón de reserva (adaptar según backend)
document.getElementById('reserve-button').addEventListener('click', () => {
    alert('¡Reserva realizada!'); // Simulación de reserva exitosa
    window.location.href = 'home_client.html'; // Redirige al home después de la reserva
});

/*
const warehouses = [
    {
        id: 'AB12C34D',
        address: 'Calle Blasco de Garay 4, 28015, Madrid, España',
        maxCapacity: 4,
        freeCapacity: 1,
        creationDate: '2023-01-01',
        lastReview: '2024-01-01',
        location: null, // Será geocodificado
        slots: [
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Cerrado', situation: 'Bloqueado' },
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Abierto', situation: 'En funcionamiento' }
        ]
    },
    {
        id: 'BX12R89T',
        address: 'Paseo de la Castellana 80, 28046, Madrid, España',
        maxCapacity: 2,
        freeCapacity: 2,
        creationDate: '2023-01-01',
        lastReview: '2024-01-01',
        location: null, // Será geocodificado
        slots: [
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Abierto', situation: 'En funcionamiento' }
        ]
    },
    {
        id: 'CX12R89T',
        address: 'Avenida del Litoral 34, 08005, Sant Martí, Barcelona, España',
        maxCapacity: 2,
        freeCapacity: 2,
        creationDate: '2023-01-01',
        lastReview: '2024-01-01',
        location: null, // Será geocodificado
        slots: [
            { status: 'Abierto', situation: 'En funcionamiento' },
            { status: 'Abierto', situation: 'En funcionamiento' }
        ]
    }
    // Agrega más almacenes según sea necesario
];

let map, markers = [];

async function initMap() {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Geocodificar direcciones y añadir marcadores
    await Promise.all(warehouses.map(async (warehouse, index) => {
        const location = await geocodeAddress(warehouse.address);
        warehouse.location = location;

        const marker = L.marker(location).addTo(map)
            .bindPopup(`<div><strong>${warehouse.id}</strong><br>${warehouse.address}</div>`);

        marker.on('click', () => {
            map.setView(location, 14);
            marker.openPopup();
        });

        markers.push(marker);

        // Añadir el punto a la lista
        const listItem = document.createElement('li');
        listItem.className = 'warehouse-item';
        listItem.innerHTML = `
            <div class="warehouse-id" data-index="${index}"><strong>ID:</strong> ${warehouse.id}</div>
            <div><strong>Dirección:</strong> ${warehouse.address}</div>
            <div><strong>Capacidad:</strong> ${warehouse.freeCapacity}/${warehouse.maxCapacity}</div>
            <div><strong>Disponibilidad:</strong>
                ${Array(warehouse.maxCapacity).fill().map((_, i) => {
                    return `<span class="badge ${i < warehouse.freeCapacity ? 'badge-success' : 'badge-danger'}"></span>`;
                }).join(' ')}
            </div>
            <div>
                <strong>Huecos:</strong>
                ${warehouse.slots.map((slot, i) => {
                    return `<div class="slot">
                        <span>Hueco ${i + 1}: </span>
                        <input type="checkbox" data-id="${warehouse.id}" data-slot="${i}" class="slot-checkbox">
                    </div>`;
                }).join('')}
            </div>
        `;
        listItem.querySelector('.warehouse-id').addEventListener('click', () => {
            map.setView(location, 14);
            marker.openPopup();
        });
        document.getElementById('warehouse-list').appendChild(listItem);
    }));

    map.setView(warehouses[0].location, 14);

    // Inicializar calendarios
    const now = new Date();
    $("#start-date").datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm",
        minDateTime: now,
        onSelectDate: function(selectedDate) {
            const startDate = new Date(selectedDate);
            const endDate = new Date($("#end-date").val());

            // Si la fecha de fin es anterior a la fecha de inicio, ajusta la fecha de fin
            if (endDate < startDate) {
                $("#end-date").datetimepicker('setDate', startDate);
            }

            // Actualiza la fecha mínima del datepicker de fin
            $("#end-date").datetimepicker('setOptions', {'minDateTime': startDate});
        },
        onSelectTime: function(selectedTime) {
            const selectedDate = new Date($("#start-date").val() + ' ' + selectedTime);
            const endDate = new Date($("#end-date").val());

            // Si la fecha de fin es anterior a la fecha de inicio, ajusta la fecha de fin
            if (endDate <= selectedDate) {
                $("#end-date").datetimepicker('setDate', selectedDate);
            }
        }
    });

    $("#end-date").datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm",
        minDateTime: now,
        onSelectDate: function(selectedDate) {
            const startDate = new Date($("#start-date").val());
            const endDate = new Date(selectedDate);

            // Si la fecha de fin es anterior a la fecha de inicio, ajusta la fecha de inicio
            if (endDate <= startDate) {
                $("#start-date").datetimepicker('setDate', endDate);
            }
        },
        onSelectTime: function(selectedTime) {
            const selectedDate = new Date($("#end-date").val() + ' ' + selectedTime);
            const startDate = new Date($("#start-date").val());

            // Si la fecha de fin es anterior a la fecha de inicio, ajusta la fecha de inicio
            if (selectedDate <= startDate) {
                $("#start-date").datetimepicker('setDate', selectedDate);
            }
        }
    });

}


async function geocodeAddress(address) {
    const apiKey = 'e17f9f72dbd44f93bbe8e1b7b07d7166';
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`);
    const data = await response.json();
    if (data.features.length > 0) {
        const { lat, lon } = data.features[0].properties;
        return [lat, lon];
    }
    throw new Error('Geocoding failed');
}
*/
