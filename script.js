// Very basic geolocation hooked into Leaflet map
const detectBtn = document.getElementById("detect-location-btn");
const output = document.getElementById("location-output");

if (detectBtn && output) {
  detectBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      output.textContent = "Geolocation is not supported on this device.";
      return;
    }

    output.textContent = "Detecting location...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        output.textContent = `Latitude: ${latitude.toFixed(
          4
        )}, Longitude: ${longitude.toFixed(4)}`;

        // If Leaflet map is available, pan to user location and drop a marker
        if (window.map && window.L) {
          window.map.setView([latitude, longitude], 14);
          L.marker([latitude, longitude])
            .addTo(window.markerGroup || window.map)
            .bindPopup("You are here")
            .openPopup();
        }
      },
      (err) => {
        output.textContent = "Could not detect location: " + err.message;
      }
    );
  });
}

// Simple city/area search using Nominatim + Leaflet
const searchInput = document.getElementById("search-city-input");
const searchBtn = document.getElementById("search-city-btn");

async function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  if (!window.map) {
    alert("Map is not ready yet. Please try again in a moment.");
    return;
  }

  try {
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    if (!data.length) {
      alert("Couldn't find that place. Try another name.");
    } else {
      const { lat, lon } = data[0];
      window.map.setView([parseFloat(lat), parseFloat(lon)], 13);
    }
  } catch (e) {
    console.error(e);
    alert("There was a problem searching for that place.");
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

if (searchInput && searchBtn) {
  searchBtn.addEventListener("click", performSearch);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });
}

