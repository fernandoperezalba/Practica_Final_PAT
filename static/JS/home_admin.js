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

/*
======================================================================================================
GESTIÓN ALMACENES
*/

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
            <div><strong>Fecha de creación:</strong> ${warehouse.creationDate}</div>
            <div><strong>Última revisión:</strong> ${warehouse.lastReview}</div>
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
                        <select data-id="${warehouse.id}" data-slot="${i}" onchange="updateSlotStatus(this)">
                            <option value="Abierto"${slot.status === 'Abierto' ? ' selected' : ''}>Abierto</option>
                            <option value="Cerrado"${slot.status === 'Cerrado' ? ' selected' : ''}>Cerrado</option>
                        </select>
                        <select data-id="${warehouse.id}" data-slot="${i}" onchange="updateSlotSituation(this)">
                            <option value="En funcionamiento"${slot.situation === 'En funcionamiento' ? ' selected' : ''}>En funcionamiento</option>
                            <option value="Bloqueado"${slot.situation === 'Bloqueado' ? ' selected' : ''}>Bloqueado</option>
                        </select>
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

function updateSlotStatus(select) {
    const warehouseId = select.getAttribute('data-id');
    const slotIndex = select.getAttribute('data-slot');
    const newStatus = select.value;

    // Aquí puedes actualizar el estado del hueco en tu base de datos
    console.log(`Estado del hueco ${slotIndex} del almacén ${warehouseId} cambiado a ${newStatus}`);
}

function updateSlotSituation(select) {
    const warehouseId = select.getAttribute('data-id');
    const slotIndex = select.getAttribute('data-slot');
    const newSituation = select.value;

    // Aquí puedes actualizar la situación del hueco en tu base de datos
    console.log(`Situación del hueco ${slotIndex} del almacén ${warehouseId} cambiado a ${newSituation}`);
}