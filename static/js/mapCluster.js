   function updateCluster(cluster, center) {
        $.getJSON(clusterdataPath + cluster, function (data) {
            clusterData = data;
            clusterCount = [];  //每次clusterCount必须清空
            var layers = [];
            clusterGroup.clearLayers();
            for (var i=0; i<data.length; i++) {
                //var color = i < 10 ? c10.range()[i] : getRandomColor();
                var color = window.colorlist[data[i]['class']];
                var points = data[i]['points'];
                console.log(points);
                for (var j=0; j<points.length; j++) {
                    var layer = L.circleMarker([points[j].lat, points[j].lng], {
                        fillColor: color,
                        radius: 6,
                        color: "gray",
                        opacity: 0.8,
                        weight: 1.0,
                        fillOpacity: 0.8
                    }).bindTooltip(points[j].sgdd,{ direction: 'left' });
                    layers.push(layer);
                }
            }
            clusterGroup = L.layerGroup(layers);
            map.addLayer(clusterGroup);
            map.setView(center, 12);

            for (var i=0; i<data.length; i++) {
                clusterCount.push({'name': "class"+data[i]['class'], 'value': data[i]['points'].length, 'color': window.colorlist[data[i]['class']]});
            }
            console.log(clusterCount);
            drawBarChart(clusterCount);
        });
    }


    var getRandomColor = function() {
          return (function(m,s,c){
            return (c ? arguments.callee(m,s,c-1) : '#') +
              s[m.floor(m.random() * 16)]
          })(Math,'0123456789abcdef',5)
    };