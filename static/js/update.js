    //请求som聚类结果
    function updateCluster(cluster, center) {
        $.getJSON('/static/clusterdata2/' + cluster, function (data) {
            clusterData = data;
            clusterCount = [];  //每次clusterCount必须清空
            var layers = [];
            clusterGroup.clearLayers();
            for (var i=0; i<data.length; i++) {
                var color = i < 10 ? c10.range()[i] : getRandomColor();
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
                clusterCount.push({'name': "class"+data[i]['class'], 'value': data[i]['points'].length, 'color': c10.range()[i], 'type': data[i]['class']});
            }
            console.log(clusterCount);
            drawBarChart(clusterCount);
        });
    }

    //选择某个类别后,请求该类别各个事故点POI数据
    function updateTypePoi(type) {
        alert("update");
        $.ajax({
            type: "GET",
            url:'/typepoi',
            data: {'type': type, 'xzqh': xzqh[xzqh_value]['xzqh']},
            dataType:'json',//希望服务器返回json格式的数据
            success: function (data, status) {
                alert(status);
                js = data;
                console.log(js);
                convertGeoJson(js);
            }
        });
    }


    var convertGeoJson = function (js) {
        poiType = [{"poi": "0"}, {'交通设施': "1"}, {'休闲娱乐': '2'}, {'教育培训': '3'}, {'旅游景点': '4'}, {'美食': '5'}, {'购物': '6'}];
        GeoJSON.parse(js, {Point: ['lng', 'lat']}, function (geojson) {
            console.log(JSON.stringify(geojson));
        });
    };

    var getRandomColor = function() {
          return (function(m,s,c){
            return (c ? arguments.callee(m,s,c-1) : '#') +
              s[m.floor(m.random() * 16)]
          })(Math,'0123456789abcdef',5)
    };