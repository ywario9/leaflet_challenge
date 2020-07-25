// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: "pk.eyJ1IjoibWxsMTIxOCIsImEiOiJja2JucnBmMWExdmdoMnJtbGkzcDRiZW5sIn0.cc1zP644hOAVjtMKd6GL2w"
}).addTo(myMap);

// Use this link to get the geojson data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";


function markerColor(magnitude) {
  //console.log(magnitude);
  if (magnitude > 5) {
      return "black";}
  else if (magnitude > 4) {
      return "purple";}    
  else if (magnitude > 3) {
      return "blue";}
  else if (magnitude > 2) {
      return "green";}
  else if (magnitude > 1) {
      return "orange";} 
  else {
      return "yellow";}
  }
;

// Grabbing our GeoJSON data..
d3.json(url, function(data) {

  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {

      style: function(feature) {
          return  { 
            radius : feature.properties.mag * 3.5, 
            fillColor : markerColor(feature.properties.mag),
            color : "#000",
            weight : 1,
            opacity : 1,
            fillOpacity : 0.8
          }
        },
    
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng)
          },
      
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" 
          + "<hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" );
        }

  }).addTo(myMap);


  // Create a legend to display information about our map
  var legend = L.control({position: "bottomright" });
  
  // When the layer control is added, insert a div with the class of "legend"
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];
  
      //Legend Header
      div.innerHTML += '<h3>Magnitude</h3>'
      
      //Looping through to assign colors to labels
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
    
    return div;
  };
  
  legend.addTo(myMap);

});
