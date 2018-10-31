//选择某一类别后绘制该类别相关数据
poilist = ['休闲娱乐', '教育培训', '旅游景点', '交通设施', '美食', '购物'];
poicolor = [
    {'fill': "#F88", 'stroke': '#800'},
    {'fill': "#FA0", 'stroke': '#B60'},
    {'fill': "#FF3", 'stroke': '#D80'},
    {'fill': "#BFB", 'stroke': '#070'},
    {'fill': "#9DF", 'stroke': '#007'},
    {'fill': "#CCC", 'stroke': '#444'}
];

function drawGeoType(geojsonPath) {
    renderLegend();

    d3.json(geojsonPath, function(error, data) {
        if (!error) {
            clusterGroup.clearLayers();
            console.log(data);
            var geojsonOptions = {
                fillColor: colorlist[window.type],
                radius: 6,
                color: "gray",
                opacity: 0.8,
                weight: 1.0,
                fillOpacity: 0.8
            };
            geoLayer = L.geoJSON(data, {
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeature
            }).addTo(map);

        } else {
            console.log('Could not load data...');
        }
    });
}

var pointToLayer = function (feature, latlng) {
    return drawPieChartMarker(feature, latlng);
};

var onEachFeature = function (feature, layer) {
    var popupContent = feature.properties.sgdd + "<br>count: " + feature.properties.count;
    layer.bindPopup(popupContent);
};

function drawPieChartMarker(feature, latlng) {
    var colorValue = Math.random() * 360;
    var options = {
        color: '#000',
        weight: 1.5,
        fillColor: 'hsl(' + colorValue + ',100%,50%)',
        radius: 20,
        fillOpacity: 1.0,
        rotation: 0.0,
        position: {
            x: 0,
            y: 0
        },
        offset: 0,
        numberOfSides: 50,
        barThickness: 12
    };
    var poi_map = function() {
        var res = new Map();
        var poi = feature.properties.poi;
        for (let i=0; i<poi.length; i++) {
            res[poi[i]['type']] = poi[i]['count'];
        }
        return res;
    }();

    console.log(poi_map);

    options.data = {
        '休闲娱乐': poi_map['休闲娱乐'],
        '教育培训': poi_map['教育培训'],
        '旅游景点': poi_map['旅游景点'],
        '交通设施': poi_map['交通设施'],
        '美食': poi_map['美食'],
        '购物': poi_map['购物']
    };

    options.chartOptions = {
        '休闲娱乐': {
            fillColor: poicolor[0].fill,
            color: poicolor[0].stroke,
            minValue: 0,
            maxValue: 10,
            maxHeight: 10,
            displayText: function (value) {
                return value;
            }
        },
        '教育培训': {
            fillColor: poicolor[1].fill,
            color: poicolor[1].stroke,
            minValue: 0,
            maxValue: 10,
            maxHeight: 10,
            displayText: function (value) {
                return value;
            }
        },
        '旅游景点': {
            fillColor: poicolor[2].fill,
            color: poicolor[2].stroke,
            minValue: 0,
            maxValue: 10,
            maxHeight: 10,
            displayText: function (value) {
                return value;
            }
        },
         '交通设施': {
            fillColor: poicolor[3].fill,
            color: poicolor[3].stroke,
            minValue: 0,
            maxValue: 10,
            maxHeight: 10,
            displayText: function (value) {
                return value;
            }
        },
        '美食': {
            fillColor: poicolor[4].fill,
            color: poicolor[4].stroke,
            minValue: 0,
            maxValue: 10,
            maxHeight: 10,
            displayText: function (value) {
                return value;
            }
        },
        '购物': {
            fillColor: poicolor[5].fill,
            color: poicolor[5].stroke,
            minValue: 0,
            maxValue: 10,
            maxHeight: 10,
            displayText: function (value) {
                return value;
            }
        },
    };
    return new L.PieChartMarker(latlng, options);
}

/*Function for generating a legend with the same categories as in the clusterPie*/
function renderLegend() {
    poilegend = L.control({position: 'bottomright'});

    poilegend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < poilist.length; i++) {
            div.innerHTML +=
                '<i style="background:' + poicolor[i].fill + '"></i> ' +
                poilist[i] + '<br>';
        }

        return div;
    };

    poilegend.addTo(map);
};

