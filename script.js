// Simple slideshow rotation
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;

function showSlide(index) {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === index);
  });
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

if (slides.length) {
  setInterval(nextSlide, 3500);
}

// Very basic geolocation (for later map use)
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
        // Later: send these coords to your map / API
      },
      (err) => {
        output.textContent = "Could not detect location: " + err.message;
      }
    );
  });
}

