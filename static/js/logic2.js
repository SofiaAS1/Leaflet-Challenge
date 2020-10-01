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

  var geojson

  function getColor(d) {
    return d > 5 ? '#8c2d04' :
     d > 4  ? '#cc4c02' :
     d > 3  ? '#ec7014' :
     d > 2  ? '#fe9929' :
     d > 1   ? '#fec44f' :
     d > 0   ? '#fee391' :
            '#ffffd4';
    }

  function style(feature) {
    return {
        fillColor: getColor(features.properties.mag),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

d3.json(queryUrl, data => {
    data.features.forEach(obj => {
        var mag = +obj.properties.mag;
        var lat = +obj.geometry.coordinates[1];
        var lng = +obj.geometry.coordinates[0];

        L.circle([lat, lng], {
            color: "green",
            fillColor: "lightgreen",
            fillOpacity: 0.75,
            radius: mag * 39000
          }).addTo(myMap);
        })
     
    geojson = L.choropleth(data, {
    
        // Define what  property in the features to use
        valueProperty: data.features.properties.mag,
        
        // Set color scale
        scale: ["#ffffb2", "#b10026"],
        
        // Number of breaks in step range
        steps: 6,
        
        // q for quartile, e for equidistant, k for k-means
        mode: "e",
        style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
        },
        
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
            }
          }).addTo(myMap);
    });

     // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earthquake Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

