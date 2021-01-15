
let root = document.documentElement;
var isStateSelected = 0;
var prevSelectedPolygon;
var prevSelectedPoint;
var geojson;
var markers;
var arrow = null;
var arrowHead = null;
var markerStates = [];
const FIRST_LAYER = 109; // created to search through markers in geojson
var PLAYER_PHASE = 0; // 0 - deployment, 1 - attack, 2 - fortify
var TurnColors = ["red", "orange", "green"];

var listOfPlayers = [
    { Name: 'Buffor', Troops: 30, Id: 1, Color: "red"  },
    { Name: 'Player1', Troops: 30, Id: 2, Color:"orange"},
    { Name: 'Player2', Troops: 30, Id: 3, Color: "green" }
];

var actualTurn = 0;

//New game button event handler - transition between game menu and game map
$("#new-game-button").click(function () {
    document.getElementById("game-menu").style.display = "none";
    document.getElementById("map-container").style.display = "inline";
    mapInit();
})


// This function instantiates the map after the New Game button is pressed. IMPORTANT - without it there are bugs in deploy phase.
function mapInit() {

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
    for (var i = 0; i < statesData.features.length; i++) {
        markerStates.push(getTroopsMarker(statesData.features[i]));

    }

    markers = L.geoJson(markerStates, {
        style: function (feature) {

            return root.style.setProperty('color', feature.properties.color);

        },
        pointToLayer: function (feature, latlng) {

            return new L.marker(latlng, {

                icon: L.divIcon({
                    className: 'my-custom-icon',
                    html: feature.properties.number

                })

            });
        }
    }).addTo(mymap);
    GetPlayerMaxTroops(actualTurn);
}






function changeColor(playerColor) {
    var cols = document.getElementsByClassName('active');
    var gearCol = document.getElementsByClassName('gear');
    var wraperCol = document.getElementsByClassName('wrapper');
    var turnCol = document.getElementsByClassName('turn-container');
    var personBkg = document.getElementsByClassName('turn-info');
    //var troopcounter = document.getElementsByClassName('turn-info');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = playerColor;
    }
    gearCol[0].style.borderColor = playerColor;
    wraperCol[0].style.borderColor = playerColor;
    turnCol[0].style.borderColor = playerColor;
    personBkg[0].style.backgroundColor = playerColor;
}

function changePlayersName(player) {
    var pNameContainer = document.getElementById("turn-info-person");
    pNameContainer.innerHTML = player;
}
function changePhaseName(phase) {
    var phaseContainer = document.getElementById("phase-info");
    phaseContainer.innerHTML = phase;
}


function GetPlayerMaxTroops(Id) {
    var result;
    $.ajax({
        url: "Player/GetPlayerTroopLimit/" + Id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            document.getElementById("troop-count").innerHTML = response;
        },
        error: function (response) {
            //console.warn('error', response);
            document.getElementById("troop-count").innerHTML = 0;

        }
    })

}

function assignTroopToMarker(marker_id) {
    $.ajax({
        url: "Player/GetPlayerTerList/" + actualTurn,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            for (let i = 0; i < response.length ; ++i){
                if (marker_id == response[i].id) {
                    addTroopsToTerritory(marker_id);
                }
            }
        },
        error: function (response) {
            console.warn('error', response);

        }
    })
}



//Updates UI - changes colors of bars, changes phase label and modifies turn variables
function whichPhaseItIs(listOfTurns) {
    changeColor("gray");
    if ($("#deploy-turn-label").hasClass('active')) {
        $("#deploy-turn-label").removeClass('active');
        $("#attk-turn-label").addClass('active');
        changePhaseName("Attack");
        document.getElementById("troop-count-container").style.display = "none";
        
    }
    else if ($("#attk-turn-label").hasClass('active')) {
        if (arrow != null) {
            mymap.removeLayer(arrow);
            mymap.removeLayer(arrowHead);
        }
        $("#attk-turn-label").removeClass('active');
        $("#fortify-turn-label").addClass('active');
        changePhaseName("Fortify");
        
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
        changePhaseName("Deploy");
        document.getElementById("troop-count-container").style.display = "flex";
        GetPlayerMaxTroops(actualTurn);
           
    }
    
    changeColor(listOfPlayers[actualTurn].Color);
    changePlayersName(listOfPlayers[actualTurn].Name);
}

// spinning of the options button
$(".gear").hover(function () {
    $("#gear-icon").addClass("fa-spin");
    $("#gear-icon").css("color", "#39ffff");

})
// spinning of the options button
$(".gear").mouseleave(function(){
    $("#gear-icon").removeClass("fa-spin");
    $("#gear-icon").css("color", "rgb(181, 240, 255)");
})
//change turn button click event handler
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
    //console.log("fea", feature.properties.color);
    return {
        fillColor: feature.properties.color,
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

// GET PROPER MARKER ID WHEN SEARCHING FROM LAYERS
function getMarkerId(marker_id) {
    return FIRST_LAYER + (marker_id == 1 ? 0 : marker_id);
}

function addTroopsToTerritory(marker_id) {
    //Increase troop number on marker and assign new value
    var temp = parseInt(markers._layers[getMarkerId(marker_id)]._icon.innerHTML) + 1;
    let number = parseInt(document.getElementById("troop-count").innerHTML) - 1;
    document.getElementById("troop-count").innerHTML = number;
    markers._layers[getMarkerId(marker_id)]._icon.innerHTML = temp;
}

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}





function zoomToFeature(e) {
    var currentPlayer = document.getElementById("turn-info-person");
    //let obj = listOfPlayers.find(o => o.Name === currentPlayer.innerHTML);
    //let tmpgearCol = document.getElementsByClassName('gear');
    //let index = findWithAttr(listOfPlayers, "Name", currentPlayer.innerHTML);
    
    var intersects = null;
    var mytime2;
    if (prevSelectedPolygon != undefined) {
        console.log("prev:", prevSelectedPolygon);
        if (prevSelectedPolygon.geometry.type == "Polygon" && e.target.feature.geometry.type == "Polygon") {
            intersects = turf.intersect(e.target.toGeoJSON(), prevSelectedPolygon);
        }
        else if (prevSelectedPolygon.geometry.type == "Polygon") {
            mytime2 = turf.explode(e.target.toGeoJSON());

            intersects = turf.pointsWithinPolygon(mytime2, prevSelectedPolygon.geometry);
        }
        else if (prevSelectedPolygon.geometry.type = "MultiPolygon") {
            mytime2 = turf.explode(e.target.toGeoJSON());
            
            intersects = turf.pointsWithinPolygon(mytime2, prevSelectedPolygon.geometry);
        }
        
       
    }
   
    if (arrow != null) {
        mymap.removeLayer(arrow);
        mymap.removeLayer(arrowHead);
        geojson.resetStyle(e.target);
    }
    if ($("#attk-turn-label").hasClass('active') ) {
        if (isStateSelected == 1 && e.target.feature.properties.color != prevSelectedPolygon.properties.color && e.target.feature.properties.player != currentPlayer.innerHTML && intersects!=null ) {
            
            e.target.feature.properties.color = JSON.parse(JSON.stringify(prevSelectedPolygon.properties.color));
            e.target.feature.properties.player = JSON.parse(JSON.stringify(currentPlayer.innerHTML));
            geojson.resetStyle(e.target);
            isStateSelected = 0;
            console.log("You attacked this territory", e.target.feature.id);
            arrow = L.polyline([prevSelectedPoint, e.latlng]).addTo(mymap);
            arrowHead = L.polylineDecorator(arrow, {
                patterns: [
                    {
                        offset: '100%',
                        repeat: 0,
                        symbol: L.Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } })

                    }]
            }).addTo(mymap);

        }
        else if (e.target.feature.properties.player == currentPlayer.innerHTML) {
            mymap.fitBounds(e.target.getBounds());
            console.log("0");
            console.log("Place from where attack is coming",e.target);
            prevSelectedPolygon = JSON.parse(JSON.stringify(e.target.feature));
            prevSelectedPoint = JSON.parse(JSON.stringify(e.latlng));
            isStateSelected = 1;
        } else {
            mymap.fitBounds(e.target.getBounds());
            isStateSelected = 0
        }
        var count = 0;

        
    }
    else if ($("#fortify-turn-label").hasClass('active')){

        mymap.fitBounds(e.target.getBounds())
    }
    else {
        let marker_id = parseInt(e.target.feature.id);
        if (parseInt(document.getElementById("troop-count").innerHTML) <= 0) return;
        assignTroopToMarker(marker_id);
        
    }
    for (var i = 0; i < statesData.features.length; i++) {

        if (statesData.features[i].properties.player == e.target.feature.properties.player) {
            count++;
        }
    }
    if (count == 40) {
        alert("GAME OVER.\n" + e.target.feature.properties.player + " won the war!!!");
        location.reload(true);
    }
    
    
}
var returnMatrix = [];
function getMatrixofNgb() {
    
    for (var i = 0; i < statesData.features.length; i++) {
        
        
        returnMatrix[i] = new Array(statesData.features.length);
        for (var k = 0; k < statesData.features.length; k++) {
            var intersects = null;
            if (statesData.features[k].id == statesData.features[i].id) {
                returnMatrix[i][k] = -1;
            }
            
            else {
                if (statesData.features[k].geometry.type == "Polygon" && statesData.features[i].geometry.type == "Polygon") {
                    
                    intersects = turf.intersect(statesData.features[i], statesData.features[k]);
                }
                else if (statesData.features[k].geometry.type == "Polygon") {
                    
                    temporary = turf.explode(statesData.features[i]);
                    intersects = turf.pointsWithinPolygon(temporary, statesData.features[k]);
                }
                else if (statesData.features[k].geometry.type = "MultiPolygon") {
                    
                    temporary = turf.explode(statesData.features[i]);
                    intersects = turf.pointsWithinPolygon(temporary, statesData.features[k]);
                }
            }
            if (intersects == null) {
                returnMatrix[i][k] = -1;
            }
            else {
                if (statesData.features[k].properties.player != statesData.features[i].properties.player) {
                    returnMatrix[i][k] = 0;
                }
                else {
                    returnMatrix[i][k] = 1;
                }
            }
        }
        
        
    }
    console.log(returnMatrix);
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
                "number": d.properties.troops
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
                "number": d.properties.troops
            },
            "geometry": {
                "type": "Point",
                "coordinates": centroid.geometry.coordinates
            }
        };
    }
    return geojsonFeatureMarker;            
}
function getNewColor(tmp) {
    return tmp=='Player2' ? '#f0ad4e' :
        tmp=='Player1' ? '#d9534f' :
            '#5cb85c';

}
function tmpAssign(tmpID) {
    return tmpID > 40 ? 'nobody' :
        tmpID > 30 ? 'Player2' :
            tmpID > 20 ? 'Player1' :
                'Buffer';
}

for (var i = 0; i < statesData.features.length; i++)
{
    
    statesData.features[i].properties.color = getColor(statesData.features[i].id);
    var tmpID = statesData.features[i].id;
    statesData.features[i].properties.player = tmpAssign(tmpID);
   
}

//for (var i = 0; i < initialTerritories; i++) {
//    switch (i) {
//        case i < 13:
//            statesData.features[initialTerritories[i]].player = 'Player1';
//            statesData.features[initialTerritories[i]].properties.color = getNewColor('Player1');
//            break;
//        case i < 26:
//            statesData.features[initialTerritories[i]].player = 'Player2';
//            statesData.features[initialTerritories[i]].properties.color = getNewColor('Player2');
//            break;
//        default:
//            statesData.features[initialTerritories[i]].player = 'Buffer';
//            statesData.features[initialTerritories[i]].properties.color = getNewColor('Buffor');

//    }
//    statesData.features[i].properties.numnum = initialTroopsNum[i.toString];
    
    

//}
console.log(statesData.features[0]);
// set view 


