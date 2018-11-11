//选择某一类后, 以marker显示该类别
function drawMarkers(geojsonPath) {
    d3.json(geojsonPath, function(error, data) {
        clusterGroup.clearLayers();
        //geoLayer.clearLayers();
        console.log(data);
        geoLayer = L.geoJSON(data, {
            pointToLayer: pointToLayer,
            onEachFeature: onEachFeature
        }).addTo(map);
        var bounds = geoLayer.getBounds();
        map.fitBounds(bounds);
    });

    var pointToLayer = function (feature, latlng) {
        var options = {
            fillColor: colorlist[window.type],
            radius: 7,
            color: "gray",
            opacity: 0.8,
            weight: 1.0,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng, options);
    };

    var onEachFeature = function (feature, layer) {
        var popupContent = feature.properties.sgdd + "<br>count: " + feature.properties.count;
        layer.bindPopup(popupContent);
    };
}
