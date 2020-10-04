// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

    createFeatures(data.features);
  // Once we get a response, send the data.features object to the createFeatures function
    // var circleMarkers = {
    //   opacity: 1,
    //   fillOpacity: 1,
    //   fillColor: color,
    //   color: "#000000",
    //   radius: +data.properties.mag,
    //   stroke: true,
    //   weight: 0.5
    // };
  
//   data.features.forEach(obj => {
//     var mag = +obj.properties.mag;
    
//   var circleMarkers = {
//     radius: mag * 40000,
//     fillColor: "lightgreen",
//     color: "green",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
//   }
});

function color(mag) {
            var color = ""
        // Conditionals for color
        if (mag > 5) {
          color = "#d73027";
        }
        else if (mag > 4) {
          color = "#fc8d59";
        }
        else if (mag > 3) {
          color = "#fee08b";
        }
        else if (mag > 2) {
            color = "#d9ef8b";
          }
        else if (mag > 1) {
            color = "#91cf60";
          }
        else {
          color = "#1a9850";
        }
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer,) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>" + "Magnitude: " + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature, 
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: +feature.properties.mag * 40000,
            fillColor: color,
            color: "#000000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,   
          });
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
        20.52, -20
    ],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

//   d3.json(queryUrl, data => {
//     data.features.forEach(obj => {
//         var mag = +obj.properties.mag;
//         var lat = obj.geometry.coordinates[1];
//         var lng = obj.geometry.coordinates[0];

//         L.circle([lat, lng], {
//             color: "green",
//             fillColor: "lightgreen",
//             fillOpacity: 0.75,
//             radius: mag * 40000
//           }).addTo(myMap);
//     });
// })

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//  // Set up the legend
//  var legend = L.control({ position: "bottomright" });
//  legend.onAdd = function() {
//    var div = L.DomUtil.create("div", "info legend");
//    var limits = [0,1,2,3,4,5];
//    var colors = ['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404'];
//    var labels = [];


//    limits.forEach(function(colors, index) {
//      labels.push("<ol><div style=\"background-color: " + colors + "\"></div><div>" + limit[index] + "</div></ol>");
//    });

//    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//    return div;
//  };

//  // Adding legend to the map
//  legend.addTo(myMap);

};

