// Añade un evento para que el dropdown se mantenga Open cuando se está sobre él
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
            { status: 'Open', situation: 'Working' },
            { status: 'Closed', situation: 'Blocked' },
            { status: 'Open', situation: 'Working' },
            { status: 'Open', situation: 'Working' }
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
            { status: 'Open', situation: 'Working' },
            { status: 'Open', situation: 'Working' }
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
            { status: 'Open', situation: 'Working' },
            { status: 'Open', situation: 'Working' }
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
            <div><strong>Address:</strong> ${warehouse.address}</div>
            <div><strong>Capacity:</strong> ${warehouse.freeCapacity}/${warehouse.maxCapacity}</div>
            <div><strong>Creation Date:</strong> ${warehouse.creationDate}</div>
            <div><strong>Last maintenance check:</strong> ${warehouse.lastReview}</div>
            <div>
                <strong>Slots:</strong>
                ${warehouse.slots.map((slot, i) => {
                    return `<div class="slot">
                        <span>Slot ${i + 1}: </span>
                        <select data-id="${warehouse.id}" data-slot="${i}" onchange="updateSlotStatus(this)">
                            <option value="Open"${slot.status === 'Open' ? ' selected' : ''}>Open</option>
                            <option value="Closed"${slot.status === 'Closed' ? ' selected' : ''}>Closed</option>
                        </select>
                        <select data-id="${warehouse.id}" data-slot="${i}" onchange="updateSlotSituation(this)">
                            <option value="Working"${slot.situation === 'Working' ? ' selected' : ''}>Working</option>
                            <option value="Blocked"${slot.situation === 'Blocked' ? ' selected' : ''}>Blocked</option>
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
