// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
 // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features); 
});

// var circleMarkers = {
//     radius: 25,
//     fillColor: "#000000",
//     color: "#000000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8,  
//   }
    
function color(mag) {
        var color = ""
        // Conditionals for color
        if (mag > 6) {
          color = "#d73027";
        }
        else if (mag > 5) {
          color = "#fc8d59";
        }
        else if (mag > 4) {
          color = "#fee08b";
        }
        else if (mag > 3) {
            color = "#ffffbf";
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
        return color
}

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>" + "Magnitude: " + feature.properties.mag + "</p>");
  }

function createFeatures(earthquakeData) {
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature, 
    pointToLayer: function (data, latlng) {
        return L.circleMarker(latlng, {
            radius: data.properties.mag * 4,
            fillColor: color(data.properties.mag),
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
    "World Map": streetmap,
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

 // Set up the legend
 var legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   var limits = ["0-1","1-2","2-3","3-4","4-5","5-6","6+"];
   var colors = ['#1a9850','#91cf60','#d9ef8b','#ffffbf','#fee08b', '#fc8d59', '#d73027'];
   var labels = [];

   var legendInfo = "<h1>Earthquake</h1>" + "<h1>Magnitude</h1>"; 
      //  +
      // "<div class=\"labels\">" +
      //   "<div class=\"min\">" + limits[0] + "</div>" +
      //   "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      // "</div>";

    div.innerHTML = legendInfo;


   colors.forEach(function(color, index) {
     labels.push("<ol><div style=\"background-color: " + color + "\"</div><div>" + limits[index] + "</div></ol>");
   });

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

 // Adding legend to the map
 legend.addTo(myMap);

};

