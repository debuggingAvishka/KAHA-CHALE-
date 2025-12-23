let map;
let markerGroup;

// Initialize map
function initMap() {
  map = L.map("map").setView([23.1815, 79.9864], 13); // Jabalpur

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markerGroup = L.layerGroup().addTo(map);
}

// Add markers (generic function)
function addMarkers(placeList) {
  markerGroup.clearLayers();

  placeList.forEach(place => {
    const marker = L.marker([place.lat, place.lng])
      .addTo(markerGroup)
      .bindPopup(`<strong>${place.name}</strong>`);

    marker.on("click", () => {
      marker.openPopup();
    });
  });
}
