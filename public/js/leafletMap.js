// Wait for everything to load
// window.addEventListener('DOMContentLoaded', function () {

//     
//     if (!mapElement) {
//         console.log('No map element found');
//         return;
//     }

export const dispplayMap = (locations) => {
    // Create map
    const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: false,  // Changed to false since you want interactive: false
        dragging: true,          // Disable dragging
        touchZoom: false,         // Disable touch zoom
        doubleClickZoom: true,   // Disable double-click zoom
        boxZoom: false,           // Disable box zoom
        keyboard: false,          // Disable keyboard navigation
        zoom: 10                  // Set initial zoom level
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add markers
    const bounds = [];
    locations.forEach(loc => {
        const coords = [loc.coordinates[1], loc.coordinates[0]];
        L.marker(coords)
            .addTo(map)
            .bindPopup(`<h1>${loc.description}</h1>`, {
                direction: 'top'
            })
        bounds.push(coords);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [100, 100] });
    }
}


// });