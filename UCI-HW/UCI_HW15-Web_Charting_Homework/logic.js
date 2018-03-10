var mapBox = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
  "T6YbdDixkOBWH_k9GbS8JQ";

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer(mapBox).addTo(myMap);

// Our marker size function that will give each city a different radius based on its population
function markerSize(population) {
  return population / 40;
}

// An array containing each city's name, location, and population
var cities = [
  {
    location: [40.7128, -74.0059],
    name: "New York",
    population: 8550405
  },
  {
    location: [41.8781, -87.6298],
    name: "Chicago",
    population: 2720546
  },
  {
    location: [29.7604, -95.3698],
    name: "Houston",
    population: 2296224
  },
  {
    location: [34.0522, -118.2437],
    name: "Los Angeles",
    population: 3971883
  },
  {
    location: [41.2524, -95.9980],
    name: "Omaha",
    population: 446599
  }
];

for (var i = 0; i < cities.length; i++) {
  L.circle(cities[i].location, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: markerSize(cities[i].population)
  }).bindPopup("<h1>" + cities[i].name + "</h1> <hr> <h3>Population: " + cities[i].population + "</h3>").addTo(myMap);
}
