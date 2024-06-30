document.addEventListener('DOMContentLoaded', function () {
    const bookingsList = document.getElementById('bookings-list');
    const filterButtons = document.querySelectorAll('.filter-button');
    const mapElement = document.getElementById('map');
    let map, markers = [];

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

    async function initMap() {
        map = L.map(mapElement).setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    async function updateMap(locations) {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        await Promise.all(locations.map(async (location) => {
            const coords = await geocodeAddress(location.address);
            const marker = L.marker(coords).addTo(map)
                .bindPopup(`<div><strong>${location.id}</strong><br>${location.address}</div>`);
            markers.push(marker);
        }));

        if (locations.length > 0) {
            const firstLocationCoords = await geocodeAddress(locations[0].address);
            map.setView(firstLocationCoords, 14);
        }
    }

    function loadBookings(status) {
        const bookings = [
            {
                bookingID: '1',
                warehouseId: 'AB12C34D',
                slots: ['Hueco1', 'Hueco2'],
                startDate: '2024-07-01 10:00',
                endDate: '2024-07-05 18:00',
                deliveryCode: 'ENT12345',
                pickupCode: 'REC67890',
                status: 'active',
                address: 'Calle Blasco de Garay 4, 28015, Madrid, España'
            },
            {
                bookingID: '1',
                warehouseId: 'DB12C34D',
                slots: ['Hueco1', 'Hueco2'],
                startDate: '2024-07-01 10:00',
                endDate: '2024-07-05 18:00',
                deliveryCode: 'ENT12345',
                pickupCode: 'REC67890',
                status: 'active',
                address: 'Calle Príncipe de Vergara 41, 28001, Madrid, España'
            },
            {
                bookingID: '2',
                warehouseId: 'BX12R89T',
                slots: ['Hueco3'],
                startDate: '2024-06-15 12:00',
                endDate: '2024-06-20 14:00',
                deliveryCode: 'ENT54321',
                pickupCode: 'REC09876',
                status: 'completed',
                address: 'Paseo de la Castellana 80, 28046, Madrid, España'
            },
            {
                bookingID: '3',
                warehouseId: 'CX12R89T',
                slots: ['Hueco2'],
                startDate: '2024-05-10 09:00',
                endDate: '2024-05-15 11:00',
                deliveryCode: 'ENT98765',
                pickupCode: 'REC12345',
                status: 'cancelled',
                address: 'Avenida del Litoral 34, 08005, Sant Martí, Barcelona, España'
            }
        ];

        const filteredBookings = bookings.filter(booking => booking.status === status);
        bookingsList.innerHTML = '';

        filteredBookings.forEach((booking, index) => {
            const row = document.createElement('tr');
            row.classList.add('booking-item');
            row.dataset.index = index;

            row.innerHTML = `
                <td>${booking.bookingID}</td>
                <td><a href="#" class="warehouse-link" data-index="${index}">${booking.warehouseId}</a></td>
                <td>${booking.slots.join(', ')}</td>
                <td>${booking.startDate}</td>
                <td>${booking.endDate}</td>
                <td>${booking.deliveryCode}</td>
                <td>${booking.pickupCode}</td>
                <td>${status === 'active' ? `<button class="cancel-button" data-index="${index}">Cancel Booking</button>` : ''}</td>
            `;

            bookingsList.appendChild(row);
        });

        const warehouseLinks = document.querySelectorAll('.warehouse-link');
        warehouseLinks.forEach(link => {
            link.addEventListener('click', async function (event) {
                event.preventDefault();
                const index = this.dataset.index;
                const coords = await geocodeAddress(filteredBookings[index].address);
                map.setView(coords, 14);
                markers[index].openPopup();
            });
        });

        const cancelButtons = document.querySelectorAll('.cancel-button');
        cancelButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                alert(`Booking ${filteredBookings[index].bookingID} cancelled.`);
                loadBookings(status);
            });
        });

        const locations = filteredBookings.map(booking => ({ id: booking.warehouseId, address: booking.address }));
        updateMap(locations);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const status = this.dataset.status;
            loadBookings(status);
        });
    });

    initMap();
    loadBookings('active');
});
