export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGh5YXNobGV5IiwiYSI6ImNrYXhudmE5aTA4MGQyeG8ydjF4ZnZyMGsifQ.8TD3kw_rep4-3I66Iw9MRA';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/thyashley/ckaxnz9a30su11illhdqc5n69',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 12
    });
    
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(loc => {
        // Create Marker
        const el = document.createElement('div')
        el.className = 'marker';
        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
    
        //Add Popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        // Extend map bounds to include current location
        bounds.extend(loc.coordinates)
    })
    
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}
