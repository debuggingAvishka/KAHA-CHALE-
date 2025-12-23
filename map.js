let map;
let markerGroup;

function initMap() {
  if (map) return; // ✅ prevents double init

  map = L.map("map").setView([23.1815, 79.9864], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markerGroup = L.layerGroup().addTo(map);
}

function addMarkers(placeList) {
  if (!markerGroup) return;

  markerGroup.clearLayers();

  placeList.forEach(place => {
    L.marker([place.lat, place.lng])
      .addTo(markerGroup)
      .bindPopup(`<strong>${place.name}</strong>`);
  });
}

