mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: currentEvent.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(currentEvent.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${currentEvent.eventName}</h3><p>${currentEvent.eventAddress}</p>`
    )
  )
  .addTo(map);
