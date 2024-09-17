// Initialize Socket.IO connection
const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Emit the user's location to the server
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}
// if (navigator.geolocation) {
//   setInterval(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;

//         // Emit the user's location to the server
//         socket.emit("send-location", { latitude, longitude });
//       },
//       (error) => {
//         console.log(error);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//       }
//     );
//   }, 5000); // Send location every 5 seconds
// }


// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 18);

//original https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png
// terrain https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "CargoSync",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});
// socket.on("receive-location", (data) => {
//   const { id, latitude, longitude } = data;

//   if (markers[id]) {
//     markers[id].setLatLng([latitude, longitude]); // Update marker position
//   } else {
//     markers[id] = L.marker([latitude, longitude]).addTo(map);
//     map.setView([latitude, longitude]);  // Center map only for new markers
//   }
// });


socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
