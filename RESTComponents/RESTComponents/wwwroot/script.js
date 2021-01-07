
let root = document.documentElement;
var geojson;
var markers;
var markerStates = [];
var listOfPlayers = [
    { Name: 'Player1', Troops: 30, Id: 1 },
    { Name: 'Player2', Troops: 30, Id: 2 },
    { Name: 'Buffor', Troops: 30, Id: 3 }
];

var actualTurn = 0;
var TurnColors = ["red", "orange", "green"];

function changeColor(playerColor) {
    var cols = document.getElementsByClassName('active');
    var gearCol = document.getElementsByClassName('gear');
    var wraperCol = document.getElementsByClassName('wrapper');
    var turnCol = document.getElementsByClassName('turn-container');
    var personBkg = document.getElementsByClassName('turn-info');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = playerColor;
    }
    gearCol[0].style.borderColor = playerColor;
    wraperCol[0].style.borderColor = playerColor;
    turnCol[0].style.borderColor = playerColor;
    personBkg[0].style.backgroundColor = playerColor;
}

function whichPhaseItIs(listOfTurns) {
    changeColor("gray");
    if ($("#deploy-turn-label").hasClass('active')) {
        $("#deploy-turn-label").removeClass('active');
        $("#attk-turn-label").addClass('active');
    }
    else if ($("#attk-turn-label").hasClass('active')) {
        
        $("#attk-turn-label").removeClass('active');
        $("#fortify-turn-label").addClass('active');
        
       
    }
    else if ($("#fortify-turn-label").hasClass('active')) {
        
        $("#fortify-turn-label").removeClass('active');
        $("#deploy-turn-label").addClass('active');
        switch (actualTurn) {
            case 0:
                actualTurn = 1;
                break;
            case 1:
                actualTurn = 2;
                break;
            case 2:
                actualTurn = 0;
                break;
        }
       
      
           
    }
    
    changeColor(TurnColors[actualTurn]);
}


$(".gear").hover(function () {
    $("#gear-icon").addClass("fa-spin");
    $("#gear-icon").css("color", "#39ffff");

})

$(".gear").mouseleave(function(){
    $("#gear-icon").removeClass("fa-spin");
    $("#gear-icon").css("color", "rgb(181, 240, 255)");

})

$(".wrapper").click(function () {
    
    whichPhaseItIs();
})

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
function getTroopsMarker(d) {
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
        // find biggest polygon
        let max = -Infinity;
        let index = -1;
        d.geometry.coordinates.forEach(function(a, k){
        if (a.length > max) {
        max = a.length;
        index = k;
        }
        });
        // use biggest polygon for troops marker center
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
var counter1 = 0;
for (var i = 0; i < statesData.features.length; i++)
{
    statesData.features[i].properties.numnum = counter1;
    counter1 = counter1 + 2;
}
console.log(statesData.features);
// set view 
var mymap = L.map('mapid')
    .setView([37.8, -96], 3.5);
// setting bounds(disallowing moving outside of the US)
mymap.setMaxBounds(mymap.getBounds());
mymap.doubleClickZoom.disable(); 
// set all layers
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
    maxZoom: 7,
    minZoom: 5,
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


// get centers to draw markers on all polygons
for(var i = 0; i< statesData.features.length;i++)
{
    markerStates.push(getTroopsMarker(statesData.features[i]));
   
}
console.log(markerStates);
markers= L.geoJson(markerStates, {
    style: function(feature) {
       
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

