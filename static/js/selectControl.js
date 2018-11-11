//地图上select控件选择不同视图(pieCharts和markers)
var myselectCtr = L.control({position: 'topright'});

myselectCtr.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'form-group');
    this._div.innerHTML = '<select id="myselect" onchange="selectOnchange(this);"> \
                           <option value='+1+' selected>circle markers</option> \
                           <option value='+2+'>pie charts</option></select>';
    return this._div;
};

function selectOnchange(obj) {
    var value = obj.options[obj.selectedIndex].value;
    //alert(value);
    var geoFile = geojsondataPath + xzqh_value + window.type + ".geojson";
    if(value == 1) {
        poilegend.remove();
        markerclusters.clearLayers();
        drawMarkers(geoFile);
    } else if(value == 2) {
        poilegend.remove();
        geoLayer.clearLayers();
        drawPieChart(geoFile);
    }
}