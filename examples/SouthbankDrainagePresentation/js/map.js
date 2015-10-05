/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-03 08:08:40
 * @version $Id$
 */
function mapper() {
    var map = L.map('map', {
        zoomControl: true,
        maxZoom: 19
    }).fitBounds([
        [-37.9048881532, 144.825871924],
        [-37.7992424603, 145.018490465]
    ]);
    var hash = new L.Hash(map);
    var additional_attrib = 'created w. <a href="https://github.com/geolicious/qgis2leaf" target ="_blank">qgis2leaf</a> by <a href="http://www.geolicious.de" target ="_blank">Geolicious</a> & contributors<br>';
    var feature_group = new L.featureGroup([]);
    var raster_group = new L.LayerGroup([]);
    var basemap_0 = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
        attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });
    basemap_0.addTo(map);
    var layerOrder = new Array();

    function pop_YarraRiver(feature, layer) {
        var popupContent = feature.properties.html_exp;
        layer.bindPopup(popupContent);
    }

    function doStyleYarraRiver(feature) {
        return {
            color: '#000000',
            fillColor: '#1f78b4',
            weight: 1.3,
            dashArray: '',
            opacity: 1.0,
            fillOpacity: 1.0
        };

    }
    var exp_YarraRiverJSON = new L.geoJson(exp_YarraRiver, {
        onEachFeature: pop_YarraRiver,
        style: doStyleYarraRiver
    });
    layerOrder[layerOrder.length] = exp_YarraRiverJSON;
    for (index = 0; index < layerOrder.length; index++) {
        feature_group.removeLayer(layerOrder[index]);
        feature_group.addLayer(layerOrder[index]);
    }
    //add comment sign to hide this layer on the map in the initial view.
    feature_group.addLayer(exp_YarraRiverJSON);

    function pop_Drainage(feature, layer) {
        var popupContent = '<table><tr><th scope="row">id</th><td>' + Autolinker.link(String(feature.properties['id'])) + '</td></tr></table>';
        layer.bindPopup(popupContent);
    }

    function doStyleDrainage(feature) {
        return {
            weight: 4.3,
            color: '#41b6c4',
            dashArray: '',
            opacity: 1.0,
            fillOpacity: 1.0
        };
    }
    var exp_DrainageJSON = new L.geoJson(exp_Drainage, {
        onEachFeature: pop_Drainage,
        style: doStyleDrainage
    });
    layerOrder[layerOrder.length] = exp_DrainageJSON;
    for (index = 0; index < layerOrder.length; index++) {
        feature_group.removeLayer(layerOrder[index]);
        feature_group.addLayer(layerOrder[index]);
    }
    //add comment sign to hide this layer on the map in the initial view.
    feature_group.addLayer(exp_DrainageJSON);

    function pop_Southbank(feature, layer) {
        var popupContent = feature.properties.html_exp;
        layer.bindPopup(popupContent);
    }

    function doStyleSouthbank(feature) {
        return {
            color: '#ff0000',
            fillColor: 'none',
            weight: 4.3,
            dashArray: '0',
            opacity: 1.0,
            fillOpacity: 1.0
        };

    }
    var exp_SouthbankJSON = new L.geoJson(exp_Southbank, {
        onEachFeature: pop_Southbank,
        style: doStyleSouthbank
    });
    layerOrder[layerOrder.length] = exp_SouthbankJSON;
    for (index = 0; index < layerOrder.length; index++) {
        feature_group.removeLayer(layerOrder[index]);
        feature_group.addLayer(layerOrder[index]);
    }
    //add comment sign to hide this layer on the map in the initial view.
    feature_group.addLayer(exp_SouthbankJSON);

    function pop_PortPhillipBay(feature, layer) {
        var popupContent = feature.properties.html_exp;
        layer.bindPopup(popupContent);
    }

    function doStylePortPhillipBay(feature) {
        return {
            color: '#000000',
            fillColor: '#41ab5d',
            weight: 1.3,
            dashArray: '',
            opacity: 1.0,
            fillOpacity: 1.0
        };

    }
    var exp_PortPhillipBayJSON = new L.geoJson(exp_PortPhillipBay, {
        onEachFeature: pop_PortPhillipBay,
        style: doStylePortPhillipBay
    });
    layerOrder[layerOrder.length] = exp_PortPhillipBayJSON;
    for (index = 0; index < layerOrder.length; index++) {
        feature_group.removeLayer(layerOrder[index]);
        feature_group.addLayer(layerOrder[index]);
    }
    //add comment sign to hide this layer on the map in the initial view.
    feature_group.addLayer(exp_PortPhillipBayJSON);

    feature_group.addTo(map);
    var title = new L.Control();
    title.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    title.update = function() {
        this._div.innerHTML = '<h2>Southbank Sources of Flood Risk</h2>Overland, Fluvial and Tidal'
    };
    title.addTo(map);
    var baseMaps = {
        'OSM Black & White': basemap_0
    };
    L.control.layers(baseMaps, {
        "PortPhillipBay": exp_PortPhillipBayJSON,
        "Southbank": exp_SouthbankJSON,
        "Drainage": exp_DrainageJSON,
        "YarraRiver": exp_YarraRiverJSON
    }, {
        collapsed: false
    }).addTo(map);
    L.control.scale({
        options: {
            position: 'bottomleft',
            maxWidth: 100,
            metric: true,
            imperial: false,
            updateWhenIdle: false
        }
    }).addTo(map);
};
