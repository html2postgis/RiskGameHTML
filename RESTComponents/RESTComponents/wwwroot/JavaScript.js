
let root = document.documentElement;
var isStateSelected = 0;
var prevSelectedPolygon;
var prevSelectedTarget;
var prevSelectedPoint;
var geojson;
var markers;
var arrow = null;
var arrowHead = null;
var markerStates = [];
const FIRST_LAYER = 109; // created to search through markers in geojson
var PLAYER_PHASE = 0; // 0 - deployment, 1 - attack, 2 - fortify
var TurnColors = ["red", "orange", "green"];
var mymap;

var listOfPlayers = [
    { Name: 'Player1', Troops: 27, Id: 1, Color: "red", TerritoryColor: '#d9534f' },
    { Name: 'Player2', Troops: 27, Id: 2, Color: "orange", TerritoryColor: '#f0ad4e' },
    { Name: 'Buffor', Troops: 27, Id: 3, Color: "green", TerritoryColor: '#5cb85c' }
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
    mymap = L.map('mapid')
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
}



function changeColor(playerColor) {
    var cols = document.getElementsByClassName('active');
    var gearCol = document.getElementsByClassName('gear');
    var wraperCol = document.getElementsByClassName('wrapper');
    var turnCol = document.getElementsByClassName('turn-container');
    var personBkg = document.getElementsByClassName('turn-info');
    //var troopcounter = document.getElementsByClassName('troop-count');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = playerColor;
    }
    gearCol[0].style.borderColor = playerColor;
    wraperCol[0].style.borderColor = playerColor;
    turnCol[0].style.borderColor = playerColor;
    personBkg[0].style.backgroundColor = playerColor;
    //troopcounter[0].style.backgroundColor = playerColor;
}

function changePlayersName(player) {
    var pNameContainer = document.getElementById("turn-info-person");
    pNameContainer.innerHTML = player;
}
function changePhaseName(phase) {
    var phaseContainer = document.getElementById("phase-info");
    phaseContainer.innerHTML = phase;
}

//Updates UI - changes colors of bars, changes phase label and modifies turn variables
function whichPhaseItIs(listOfTurns) {
    changeColor("gray");
    //document.getElementsByClassName('active').style.backgroundColor = "gray";
    if ($("#deploy-turn-label").hasClass('active')) {
        $("#deploy-turn-label").removeClass('active');
        $("#attk-turn-label").addClass('active');
        changePhaseName("Attack");
        document.getElementById("troop-count-container").style.display = "none";

    }
    else if ($("#attk-turn-label").hasClass('active')) {
        console.log("attack");
        if (arrow != null) {
            mymap.removeLayer(arrow);
            mymap.removeLayer(arrowHead);
        }
        $("#attk-turn-label").removeClass('active');
        $("#fortify-turn-label").addClass('active');
        changePhaseName("Fortify");

    }
    else if ($("#fortify-turn-label").hasClass('active')) {
        PLAYER_PHASE = 0;
        $("#fortify-turn-label").removeClass('active');
        $("#deploy-turn-label").addClass('active');

        actualTurn = ((actualTurn != listOfPlayers.length - 1) ? actualTurn + 1 : 0);
        changePhaseName("Deploy");
        document.getElementById("troop-count-container").style.display = "flex";


    }

    changeColor(listOfPlayers[actualTurn].Color);
    changePlayersName(listOfPlayers[actualTurn].Name);
}

// spinning of the options button
//GEAR HOVER ANIMATION
$(".gear").hover(function () {
    $("#gear-icon").addClass("fa-spin");
    $("#gear-icon").css("color", "#39ffff");
})
// spinning of the options button
$(".gear").mouseleave(function () {
    $("#gear-icon").removeClass("fa-spin");
    $("#gear-icon").css("color", "rgb(181, 240, 255)");
})
//change turn button click event handler
$(".wrapper").click(function () {
    whichPhaseItIs();
})

//function getColor(d) {
//    return d > 40 ? '#0275d8' :
//           d > 30  ? '#f0ad4e' :
//           d > 20  ? '#d9534f' :
//                    '#5cb85c';

//}

function style(feature) {
    return {
        fillColor: listOfPlayers[feature.properties.playerId - 1].TerritoryColor,
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


// GET PROPER MARKER ID WHEN SEARCHING FROM LAYERS
function getMarkerId(marker_id) {
    return FIRST_LAYER + (marker_id == 1 ? 0 : marker_id);
}

function addTroopsToTerritory(marker_id) {
    //Increase troop number on marker and assign new value
    if (marker_id != null) {
        var temp = parseInt(markers._layers[getMarkerId(marker_id)]._icon.innerHTML) + 1;
        markers._layers[getMarkerId(marker_id)]._icon.innerHTML = temp;
    }

}

function replaceTroops(marker_id, num) {
    //Increase troop number on marker and assign new value
    if (marker_id != null) {
        var temp = num;
        markers._layers[getMarkerId(marker_id)]._icon.innerHTML = temp;
    }

}

function subTroopsToTerritory2(marker_id, num) {
    //Increase troop number on marker and assign new value
    if (marker_id != null) {
        var temp = parseInt(markers._layers[getMarkerId(marker_id)]._icon.innerHTML) - num;
        markers._layers[getMarkerId(marker_id)]._icon.innerHTML = temp;
    }

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
    console.log("attack", $('#attk-turn-label').hasClass('active'));
    console.log("fortify", $("#fortify-turn-label").hasClass('active'));
    console.log("deploy", $("#deploy-turn-label").hasClass('active'));


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
    } //console.log("color", e.target.feature.properties.color);

    if ($("#attk-turn-label").hasClass('active')) {
        if (isStateSelected == 1 && e.target.feature.properties.playerName != prevSelectedPolygon.properties.playerName && e.target.feature.properties.playerName != currentPlayer.innerHTML && intersects != null) {
            

            isStateSelected = 0;

            callAjaxfunc(e.target, parseInt(e.target.feature.id), currentPlayer);


            console.log("You attacked this territory", e.target.feature.id);
            mymap.fitBounds(e.target.getBounds());
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
        else if (e.target.feature.properties.playerName == currentPlayer.innerHTML) {
            console.log("2");

            mymap.fitBounds(e.target.getBounds());
            console.log("0");
            console.log("Place from where attack is coming", e.target);
            console.log("taraget", e.target);
            prevSelectedTarget = e.target;

            prevSelectedPolygon = JSON.parse(JSON.stringify(e.target.feature));
            prevSelectedPoint = JSON.parse(JSON.stringify(e.latlng));
            isStateSelected = 1;
        } else {
            console.log("3");
            //console.log("StateSelected", isStateSelected == 1);
            //console.log("Diffrent playernamw1", e.target.feature.properties.playerName != prevSelectedPolygon.properties.playerName);
            //console.log("Diffrent playernamw1", e.target.feature.properties.playerName != currentPlayer.innerHTML);
            //console.log("intersetcs", intersects != null);
            mymap.fitBounds(e.target.getBounds());
            isStateSelected = 0
        }
        var count = 0;


    }
    else if ($("#fortify-turn-label").hasClass('active')) {

        mymap.fitBounds(e.target.getBounds())
    }
    else {
        var marker_id = parseInt(e.target.feature.id);
        let player_id = parseInt(e.target.feature.properties.playerId);
        marker_id = (player_id - 1 == actualTurn ? marker_id : null);
        console.log(marker_id);
        addTroopsToTerritory(marker_id);

    }
    for (var i = 0; i < statesData.features.length; i++) {

        if (statesData.features[i].properties.playerName == e.target.feature.properties.playerName) {
            count++;
        }
    }
    if (count == 40) {
        alert("GAME OVER.\n" + e.target.feature.properties.playerName + " won the war!!!");
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

}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

}


function getTroopsMarker(d) {
    //console.log(d.id);
    var geojsonFeatureMarker;
    if (d.geometry.type == "Polygon") {
        var polygon = turf.polygon(d.geometry.coordinates);
        var centroid = turf.centerOfMass(polygon);
        geojsonFeatureMarker = {
            "type": "Feature",
            "properties": {
                "number": d.properties.troops
            },
            "geometry": {
                "type": "Point",
                "coordinates": centroid.geometry.coordinates
            }
        };

    }
    if (d.geometry.type == "MultiPolygon") {
        // find biggest polygon
        let max = -Infinity;
        let index = -1;
        d.geometry.coordinates.forEach(function (a, k) {
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
for (var i = 0; i < statesData.features.length; i++) {
    var tmpId = statesData.features[i].properties.playerId;
    statesData.features[i].properties.playerName = listOfPlayers[tmpId - 1].Name;
}

function callAjaxfunc(target, id, currentPlayer) {
    $.ajax({
        method: "GET",
        url: "Dice/GetWinner2",
        contentType: "application/json",
        data: { attackers: parseInt(prevSelectedPolygon.properties.troops) - 1, defencors: parseInt(target.feature.properties.troops) },
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response[0] != 0) {

                target.feature.properties.playerName = JSON.parse(JSON.stringify(currentPlayer.innerHTML));
                target.feature.properties.playerId = JSON.parse(JSON.stringify(prevSelectedPolygon.properties.playerId));
                target.feature.properties.troops = response[0].length;

                var marker_id1 = parseInt(target.feature.id);
                var marker_id2 = parseInt(prevSelectedPolygon.id);
                replaceTroops(marker_id1, response[0].length);
                replaceTroops(marker_id2, 1);
                prevSelectedPolygon.properties.troops = 1;
                geojson.resetStyle(target);
                geojson.resetStyle(prevSelectedTarget);
                console.log(target);
                console.log("moj", prevSelectedTarget);

                //markers._layers[getMarkerId(parseInt(id))]._icon.innerHTML = response[0].length;
            }
            else {
                target.feature.properties.troops = 1;
                var marker_id1 = parseInt(target.feature.id);
                var marker_id2 = parseInt(prevSelectedPolygon.id);
                replaceTroops(marker_id1, response[1].length);
                replaceTroops(marker_id2, 1);
                prevSelectedPolygon.properties.troops = response[0].length;
                geojson.resetStyle(target);
                geojson.resetStyle(prevSelectedTarget);
                console.log(target);
                console.log("moj", prevSelectedTarget);
            }
            // markers._layers[getMarkerId(parseInt(id))]._icon.innerHTML = response

        },
        error: function (response) {
            console.warn('Send - error', response);
        }
    });

}
