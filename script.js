let root = document.documentElement;
var geojson;
var markers;

function getColor(d) {
    return d > 40 ? '#0275d8' :
           d > 30  ? '#f0ad4e' :
           d > 20  ? '#d9534f' :
                    '#5cb85c';
                      
}

function style(feature) {
    return {
        fillColor: getColor(feature.id),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    
    geojson.resetStyle(e.target);
    
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
function getMarker(d) {
    var geojsonFeatureMarker;
    if(d.geometry.type=="Polygon")
    {
        var polygon = turf.polygon(d.geometry.coordinates);
        var centroid = turf.centerOfMass(polygon);
            geojsonFeatureMarker = {
            "type": "Feature",
            "properties": {
                "color": getColor(d.id),
                "number": d.id
            },
            "geometry": {
                "type": "Point",
                "coordinates": centroid.geometry.coordinates
            }
        };
        
    }
    if(d.geometry.type=="MultiPolygon")
    {
        let max = -Infinity;
        let index = -1;
        d.geometry.coordinates.forEach(function(a, k){
        if (a.length > max) {
        max = a.length;
        index = k;
        }
        });
        var polygon = turf.polygon(d.geometry.coordinates[index]);
        var centroid = turf.centerOfMass(polygon);
        
            geojsonFeatureMarker = {
            "type": "Feature",
            "properties": {
                "color": getColor(d.id),
                "number": d.id
            },
            "geometry": {
                "type": "Point",
                "coordinates": centroid.geometry.coordinates
            }
        };
    }
    return geojsonFeatureMarker;            
}
var mymap = L.map('mapid').setView([37.8, -96], 3.5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
    maxZoom: 6,
    minZoom: 4,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);
geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);

var numberIcon = L.divIcon({
      className: 'my-custom-icon',
      html: "5",
      iconSize: [25, 41],
      iconAnchor: [10, 44],
      popupAnchor: [3, -40]    
});


var markerStates =[];
for(var i = 0; i< statesData.features.length;i++)
{
    markerStates.push(getMarker(statesData.features[i]));
   
}

markers= L.geoJson(markerStates, {
    style: function(feature) {
        console.log(feature.properties.color);
        return root.style.setProperty('color', feature.properties.color);
        
    },
    pointToLayer: function(feature, latlng) {
       
        return new L.marker(latlng, { 
           
            icon: L.divIcon({
                className: 'my-custom-icon',
                html: feature.properties.number
                
            })
            
        });
    }
}).addTo(mymap);
