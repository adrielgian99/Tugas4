//Inisialisasi peta dengan fokus Kota Malang
const map = L.map('map').setView([-7.975, 112.633], 12);

//Tambahkan layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors, Weather from <a href="https://open-meteo.com/">Open-Meteo</a>',
    maxZoom: 18,
    minZoom: 10
}).addTo(map);

// Custom icon untuk marker kecamatan
const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Icon lokasi custom
    iconSize: [32, 32], // ukuran icon
    iconAnchor: [16, 32], // titik anchor icon
    popupAnchor: [0, -32] // posisi popup relatif terhadap icon
});

//Data Kecamatan di Kota Malang (Nama dan Kordinat)
const districts = [
    { name: 'Klojen', coords: [-7.982, 112.630] },
    { name: 'Blimbing', coords: [-7.939, 112.647] },
    { name: 'Lowokwaru', coords: [-7.952, 112.611] },
    { name: 'Sukun', coords: [-8.003, 112.614] },
    { name: 'Kedungkandang', coords: [-7.978, 112.664] }
];

// Fungsi untuk mendapatkan data cuaca dari OpenMeteo API
async function getWeatherData(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation&timezone=Asia/Jakarta`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            temperature: data.current.temperature_2m,
            temperatureUnit: data.current_units.temperature_2m,
            precipitation: data.current.precipitation,
            precipitationUnit: data.current_units.precipitation
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

// Tambahkan marker untuk setiap kecamatan dengan custom icon
districts.forEach(district => {
    const marker = L.marker(district.coords, { icon: customIcon }).addTo(map);
    
    // Tambahkan initial popup content
    marker.bindPopup(`<b>${district.name}</b><br>Loading weather data...`);
    
    // Ketika marker di-klik, ambil data cuaca dan update popup
    marker.on('click', async function() {
        const popup = marker.getPopup();
        popup.setContent(`<b>${district.name}</b><br>Loading weather data...`);
        
        const weatherData = await getWeatherData(district.coords[0], district.coords[1]);
        
        if (weatherData) {
            popup.setContent(`
                <b>${district.name}</b><br>
                <strong>Current Temperature:</strong> ${weatherData.temperature} ${weatherData.temperatureUnit}<br>
                <strong>Precipitation Sum:</strong> ${weatherData.precipitation} ${weatherData.precipitationUnit}<br>
                <small>Lat: ${district.coords[0].toFixed(3)}, Lng: ${district.coords[1].toFixed(3)}</small>
            `);
        } else {
            popup.setContent(`
                <b>${district.name}</b><br>
                Weather data unavailable<br>
                <small>Lat: ${district.coords[0].toFixed(3)}, Lng: ${district.coords[1].toFixed(3)}</small>
            `);
        }
        
        popup.update();
    });
});