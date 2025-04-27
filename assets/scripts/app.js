//Inisialisasi peta dengan fokus Kota Malang
const map = L.map('map').setView([-7.975, 112.633], 12);

//Tambahkan layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 10
}).addTo(map);

//Data Kecamatan di Kota Malang (Nama dan Kordinat)
const districts = [
    { name: 'Klojen', coords: [-7.982, 112.630] },
    { name: 'Blimbing', coords: [-7.939, 112.647] },
    { name: 'Lowokwaru', coords: [-7.952, 112.611] },
    { name: 'Sukun', coords: [-8.003, 112.614] },
    { name: 'Kedungkandang', coords: [-7.978, 112.664] }
];

//Tambahkan marker untuk setiap kecamatan
districts.forEach(district => {
    L.marker(district.coords).addTo(map).bindPopup(`<b>${district.name}</b><br>Lat ${district.coords[0]}, Lng ${district.coords[1]}`);
});