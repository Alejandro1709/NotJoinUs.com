mapboxgl.accessToken =
  'pk.eyJ1IjoiYWxlamFuZHJvMTcwOTk5IiwiYSI6ImNrZGF1MjcyNTE5YWkyeWx2NDgzcXd2a2QifQ.8Miw-ZpdwarFf9wyKBA9dg';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
