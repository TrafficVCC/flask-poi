            var crs = new L.Proj.CRS('EPSG:3395',
                '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
            {
                resolutions: function () {
                    level = 19;
                    var res = [];
                    res[0] = Math.pow(2, 18);
                    for (var i = 1; i < level; i++) {
                        res[i] = Math.pow(2, (18 - i))
                    }
                    return res;
                }(),
                origin: [0, 0],
                bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
            });
            var map = L.map('map', {
                crs: crs
            });

            new L.TileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518', {
                maxZoom: 25,
                minZoom: 3,
                subdomains: [0,1,2],
                tms: true
            }).addTo(map);

           // new L.marker([31.829155,117.238256]).addTo(map);

            map.setView([31.829155,117.238256], 15);