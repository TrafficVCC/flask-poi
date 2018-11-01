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

lookup = {
    "1": "休闲娱乐",
    "2": "教育培训",
    "3": "旅游景点",
    "4": "交通设施",
    "5": "美食",
    "6": "购物"
};

revlookup = {
    "休闲娱乐": "1",
    "教育培训": "2",
    "旅游景点": "3",
    "交通设施": "4",
    "美食": "5",
    "购物": "6"
};

var rmax = 35; //Maximum radius for cluster pies
markerclusters = L.markerClusterGroup({
    maxClusterRadius: 2*rmax,
    iconCreateFunction: defineClusterIcon //this is where the magic happens
});
map.addLayer(markerclusters);


function drawGeoType(geojsonPath) {
    renderLegend();

    d3.json(geojsonPath, function(error, data) {
        if (!error) {
            clusterGroup.clearLayers();
            console.log(data);
            markers = L.geoJSON(data, {
                pointToLayer: pointToLayer,
                onEachFeature: onEachFeature
            });
            markerclusters.addLayer(markers);
            map.fitBounds(markers.getBounds());

        } else {
            console.log('Could not load data...');
        }
    });
}

var pointToLayer = function (feature, latlng) {
    var options = {
        fillColor: colorlist[window.type],
        radius: 8,
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

function defineClusterIcon(cluster) {
    var children = cluster.getAllChildMarkers(),
        n = children.length, //Get number of markers in cluster
        strokeWidth = 1, //Set clusterpie stroke width
        r = rmax-2*strokeWidth-(n<10?12:n<100?8:n<1000?4:0), //Calculate clusterpie radius...
        iconDim = (r+strokeWidth)*2, //...and divIcon dimensions (leaflet really want to know the size)

        // data = d3.nest() //Build a dataset for the pie chart
        //     .key(function(d) { return d.feature.properties[categoryField]; })
        //     .entries(children, d3.map),
        data = convertNest(children),
        data2 = [{"key": "1", "values":[22,33]}, {"key": "2", "values": [1]}],
        //bake some svg markup
        html = bakeThePie({data: data,
            valueFunc: function(d){console.log(d); return d.values.total_count;},
            strokeWidth: 1,
            outerRadius: r,
            innerRadius: r-10,
            pieClass: 'cluster-pie',
            pieLabel: n,
            pieLabelClass: 'marker-cluster-pie-label',
            pathClassFunc: function(d){console.log(d); return "category-"+revlookup[d.data.key];},
            pathTitleFunc: function(d){return d.data.key+' ('+d.data.values.total_count+' poi'+(d.data.values.total_count!=1?'s':'')+')';}
        }),
        //Create a new divIcon and assign the svg markup to the html property
        myIcon = new L.DivIcon({
            html: html,
            className: 'marker-cluster',
            iconSize: new L.Point(iconDim, iconDim)
        });

    console.log(data);
    console.log(children);
    return myIcon;
}

//转换成[{"key": "1", "values": 5}, {"key": "2", "values": 2}, ...]
function convertNest(children) {
    var all_poi = [];
    for (var i=0; i<children.length; i++) {
        var poi = children[i].feature.properties.poi;
        for (var j=0; j<poi.length; j++) {
            //poi[j]['type'] = revlookup[poi[j]['type']];
            all_poi.push(poi[j]);
        }
    }
    console.log(all_poi);
    var nested_data = d3.nest()
        .key(function(d) { return d.type; })
        .rollup(function (leaves) {
            return {"length": leaves.length, "total_count": d3.sum(leaves, function(d) {return d.count;})}
        })
        .entries(all_poi);
    console.log(nested_data);
    return nested_data;
}

/*function that generates a svg markup for the pie chart*/
function bakeThePie(options) {
    /*data and valueFunc are required*/
    if (!options.data || !options.valueFunc) {
        return '';
    }
    var data = options.data,
        valueFunc = options.valueFunc,
        r = options.outerRadius?options.outerRadius:28, //Default outer radius = 28px
        rInner = options.innerRadius?options.innerRadius:r-10, //Default inner radius = r-10
        strokeWidth = options.strokeWidth?options.strokeWidth:1, //Default stroke is 1
        pathClassFunc = options.pathClassFunc?options.pathClassFunc:function(){return '';}, //Class for each path
        pathTitleFunc = options.pathTitleFunc?options.pathTitleFunc:function(){return '';}, //Title for each path
        pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
        pieLabel = options.pieLabel?options.pieLabel:d3.sum(data,valueFunc), //Label for the whole pie
        pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label

        origo = (r+strokeWidth), //Center coordinate
        w = origo*2, //width and height of the svg element
        h = w,
        donut = d3.layout.pie(),
        arc = d3.svg.arc().innerRadius(rInner).outerRadius(r);

    //Create an svg element
    var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    //Create the pie chart
    var vis = d3.select(svg)
        .data([data])
        .attr('class', pieClass)
        .attr('width', w)
        .attr('height', h);

    var arcs = vis.selectAll('g.arc')
        .data(donut.value(valueFunc))
        .enter().append('svg:g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + origo + ',' + origo + ')');

    arcs.append('svg:path')
        .attr('class', pathClassFunc)
        .attr('stroke-width', strokeWidth)
        .attr('d', arc)
        .append('svg:title')
        .text(pathTitleFunc);

    vis.append('text')
        .attr('x',origo)
        .attr('y',origo)
        .attr('class', pieLabelClass)
        .attr('text-anchor', 'middle')
        //.attr('dominant-baseline', 'central')
        /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
        .attr('dy','.3em')
        .text(pieLabel);
    //Return the svg-markup rather than the actual element
    return serializeXmlNode(svg);
}

/*Helper function*/
function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}