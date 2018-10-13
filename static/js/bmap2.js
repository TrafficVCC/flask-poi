  //注意将map的crs赋值 crs: L.CRS.Baidu 详情请阅读示例页面
    var map = L.map('map', {
	crs: L.CRS.Baidu,
	minZoom: 3,
	maxZoom: 18,
	attributionControl: false,
	center: [31.834912, 117.220102],
	zoom: 12
    });

    L.tileLayer.baidu({ layer: 'vec' }).addTo(map);