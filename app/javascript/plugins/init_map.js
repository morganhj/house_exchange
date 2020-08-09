var gmap;
const initMap = () => {
  gmap = new google.maps.Map(document.getElementById("google_map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
}

export { initMap };