
let root = document.documentElement;
var geojson;
var markers;
var markerStates = [];
var listOfPlayers = [
    { Name: 'Player1', Troops: 30, Id: 1 },
    { Name: 'Player2', Troops: 30, Id: 2 },
    { Name: 'Buffor', Troops: 30, Id: 3 }
];

var actualTurn = [
    1,
    0,
    0
];
function changeToRed() {
    var cols = document.getElementsByClassName('active');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = 'red';
    }
}
function changeToOrange() {
    var cols = document.getElementsByClassName('active');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = 'orange';
    }
}
function changeToGreen() {
    var cols = document.getElementsByClassName('active');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = 'green';
    }
}
function changeToGray() {
    var cols = document.getElementsByClassName('active');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = 'gray';
    }
}
function whichPhaseItIs(listOfTurns) {

    if ($("#deploy-turn-label").hasClass('active')) {
        console.log("hejka");
        changeToGray();
        $("#deploy-turn-label").removeClass('active');
        $("#attk-turn-label").addClass('active');
        
        if (actualTurn[0]) {
            changeToRed();
            //$(".active").css("background-color", "rgb(252, 44, 44)");
        } else if (actualTurn[1]) {
            changeToOrange()
            //$(".active").css("background-color", "rgb(255,140,0)");
        } else {
            changeToGreen()
            //$(".active").css("background-color", "rgb(50,205,50)");
        }
        
    }
    else if ($("#attk-turn-label").hasClass('active')) {
        changeToGray();
        $("#attk-turn-label").removeClass('active');
        $("#fortify-turn-label").addClass('active');
        
        if (actualTurn[0]) {
            changeToRed();
            //$(".active").css("background-color", "rgb(252, 44, 44)");
        } else if (actualTurn[1]) {
            changeToOrange()
            //$(".active").css("background-color", "rgb(255,140,0)");
        } else {
            changeToGreen()
            //$(".active").css("background-color", "rgb(50,205,50)");
        }
    }
    else if ($("#fortify-turn-label").hasClass('active')) {
        changeToGray();
        $("#fortify-turn-label").removeClass('active');
        $("#deploy-turn-label").addClass('active');
        if (actualTurn[0]) {
            actualTurn[0] = 0;
            actualTurn[1] = 1;
        }
        else if (actualTurn[1]) {
            actualTurn[1] = 0;
            actualTurn[2] = 1;
        }
        else{
            actualTurn[2] = 0;
            actualTurn[0] = 1;
        }
        if (actualTurn[0]) {
            changeToRed();
            //$(".active").css("background-color", "rgb(252, 44, 44)");
        } else if (actualTurn[1]) {
            changeToOrange()
            //$(".active").css("background-color", "rgb(255,140,0)");
        } else {
            changeToGreen()
            //$(".active").css("background-color", "rgb(50,205,50)");
        }
      
           
    }
    
       
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

