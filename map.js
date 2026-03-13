let map;
let markerGroup;

function initMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv || map) return;

  map = L.map("map").setView([23.1815, 79.9864], 13);
  // expose globally so other scripts can access
  window.map = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markerGroup = L.layerGroup().addTo(map);
  window.markerGroup = markerGroup;
}

function addMarkers(placeList) {
  if (!markerGroup) return;

  markerGroup.clearLayers();

  placeList.forEach(place => {
    if (!place.lat || !place.lng) return;

    L.marker([place.lat, place.lng])
      .addTo(markerGroup)
      .bindPopup(place.name);
  });
}
