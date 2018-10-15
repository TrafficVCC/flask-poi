var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGl0ZXh5IiwiYSI6ImNqa2pwbXh3ODBkYzUzcW5sMTU5NTVuNmUifQ.mYPyYxT1lZwZMIxJCVi3qg';

var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

var streets = L.tileLayer(mbUrl, { id: 'mapbox.streets', attribution: mbAttr });
var grayscale = L.tileLayer(mbUrl, { id: 'mapbox.light', attribution: mbAttr });
var osm = L.tileLayer(osmUrl, { attribution: osmAttr });

var baseLayers = {
    "osm": osm,
    "streets": streets,
    "grayscale": grayscale
};

var map = L.map('map', {
    center: [31.834912, 117.220102],
    zoom: 11,
    layers: [streets]
});

L.control.layers(baseLayers).addTo(map);
