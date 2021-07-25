function createMap(quakeLayer) {
    // Create the tile layer that will be the background of our map
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      Light: light,
    };
  
    // Create an overlayMaps object to hold the Eathquake layer
    var overlayMaps = {
      Earthquakes: quakeLayer
    };
  
    // Create the map object with options
    var myMap = L.map("map", {
      center: [39.8283, -98.5795],
      zoom: 4,
      layers: [light, quakeLayer]
    });
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Add a Legend to the map
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ['90 =<','70 - 90','50 - 70','30 - 50','10 - 20','=< 10'];
      var colors = ['#ff0000', '#fc5f00', '#ee9000', '#d6b900', '#b3de00', '#7dff0e'];
      var labels = [];

      // Add min & max
      var legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\"></div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + `\">${limit}</li>`);
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
  }
  // Create a createMarkers function
  function mapEarthquakes(data) {
    console.log(data)
    
    var quakeLayer = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
            radius: Math.round(feature.properties.mag)*5,             
            });
        },
        style: function(feature) {
            var depth = feature.geometry.coordinates[2];
            if (depth >= 90) {
                return { color: '#ff0000' }; 
            } 
            else if (depth >= 70) {
                return { color: '#fc5f00' };
            } 
            else if (depth >= 50) {
                return { color: '#ee9000' };
            } 
            else if (depth >= 30) {
                return { color: '#d6b900' };
              } 
            else if (depth >= 10) {
                return { color: '#b3de00' };
              } 
            else {
                return { color: '#7dff0e' };
            }
        },
        onEachFeature: function (feature, layer) {
            var p = feature.properties;
            layer.bindPopup('<h3>'+p.title+'</h3>')
        }
    });
    createMap(quakeLayer);
  }
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  var apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  d3.json(apiUrl).then(info => mapEarthquakes(info));