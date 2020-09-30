var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [20.52, -20],
    zoom: 2
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

d3.json(queryUrl, data => {
    data.features.forEach(obj => {
        var mag = +obj.properties.mag;
        var lat = obj.geometry.coordinates[1];
        var lng = obj.geometry.coordinates[0];

        L.circle([lat, lng], {
            color: "green",
            fillColor: "green",
            fillOpacity: 0.75,
            radius: mag * 10000
          }).addTo(myMap);
    });
})