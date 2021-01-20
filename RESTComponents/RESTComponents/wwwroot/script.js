
let root = document.documentElement;
var isStateSelected = 0;
var prevSelectedPolygon;
var prevSelectedTarget;
var prevSelectedPoint;
var geojson;
var markers;
var arrow = null;
var mymap;
var arrowHead = null;
var selectedMarkerId = -1; // int value -- used in fortify phase 
var prevSelectedMarkerId = -1; // --------||-----------
var markerStates = [];
const FIRST_LAYER = 109; // created to search through markers in geojson
var PLAYER_PHASE = 0; // 0 - deployment, 1 - attack, 2 - fortify
var TurnColors = ["red", "orange", "green"];
var statesData;

var listOfPlayers = [
    { Name: 'Player1', Troops: 27, Id: 1, Color: "red", TerritoryColor: '#d9534f' },
    { Name: 'Player2', Troops: 27, Id: 2, Color: "orange", TerritoryColor: '#f0ad4e' },
    { Name: 'Buffor', Troops: 27, Id: 3, Color: "green", TerritoryColor: '#5cb85c' }
];
var actualTurn = 0;
function waitForElement(response) {
    statesData = response;
    if (typeof statesData !== "undefined") {
        //variable exists, do what you want
        $("#new-game-button").attr("disabled", false);
        for (var i = 0; i < statesData.features.length; i++) {
            //console.log(statesData.features[i]);

            var tmpId = statesData.features[i].properties.playerId;

            statesData.features[i].properties.playerName = listOfPlayers[tmpId - 1].Name;
        }
    }
    else {
        setTimeout(statesData, 250);
    }
   
}
function getStates() {

    $.ajax({
        url: "Player/GetMy",
        type: "GET",
        contentType: "application/json",


    }).done(function (response) {
        waitForElement(response);
    });
    
}
getStates();

function completeStates(callback) {
    callback();
   
}

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

function getPolygonTroops(marker_id) {
    return parseInt(markers._layers[getMarkerId(marker_id)]._icon.innerHTML);
}

function assignTroopToMarker(marker_id,e) {
    $.ajax({
        url: "Player/GetPlayerTerList/" + actualTurn,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            for (let i = 0; i < response.length ; ++i){
                if (marker_id == response[i].id) {
                    addTroopsToTerritory(marker_id,e);
                }
            }
        },
        error: function (response) {
            console.warn('error', response);

        }
    })
}

$("#forward-button").click(function () {
    markers._layers[getMarkerId(prevSelectedMarkerId)]._icon.innerHTML = parseInt(markers._layers[getMarkerId(prevSelectedMarkerId)]._icon.innerHTML)
        - parseInt(document.getElementById("fortify-slider").value);

    markers._layers[getMarkerId(selectedMarkerId)]._icon.innerHTML = parseInt(markers._layers[getMarkerId(selectedMarkerId)]._icon.innerHTML)
        + parseInt(document.getElementById("fortify-slider").value);
    document.getElementById("fortify-slider-container").style.display = "none";
    selectedMarkerId = -1;
    prevSelectedMarkerId = -1;
    document.getElementById("slider_value").value = 0;

})

$("#cross-button").click(function () {
    selectedMarkerId = -1;
    prevSelectedMarkerId = -1;
    document.getElementById("fortify-slider-container").style.display = "none";
    document.getElementById("slider_value").value = 0;

})

function addTroopsToTerritory(marker_id,e) {
    //Increase troop number on marker and assign new value
    var temp = parseInt(markers._layers[getMarkerId(marker_id)]._icon.innerHTML) + 1;
    let number = parseInt(document.getElementById("troop-count").innerHTML) - 1;
    document.getElementById("troop-count").innerHTML = number;
    markers._layers[getMarkerId(marker_id)]._icon.innerHTML = temp;
    statesData.features[marker_id].properties.troops = temp;
    e.target.feature.properties.troops = temp;
    
}


function playerPossessPolygon(marker_id) {
    var result = false;
    $.ajax({
        url: "Player/GetPlayerTerList/" + actualTurn,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            for (let i = 0; i < response.length; ++i) {
                if (marker_id == response[i].id) {
                    result = true;
                }
            }
            if (!result) {
                alert("You can only move troops on your territories!");
                return;
            }
            else if (marker_id == 1) {
                alert("You can move troops only when there are at least 2 armies in origin territory.");
                return;
            }
            else {
                if (prevSelectedMarkerId == -1) {
                    prevSelectedMarkerId = marker_id
                }
                else if (selectedMarkerId == -1 && marker_id != prevSelectedMarkerId) {
                    selectedMarkerId = marker_id;
                    document.getElementById("fortify-slider").max = (getPolygonTroops(prevSelectedMarkerId) - 1);
                    document.getElementById("fortify-slider").value = 0;
                    document.getElementById("slider_max").value = document.getElementById("fortify-slider").max;
                    document.getElementById("fortify-slider-container").style.display = "flex";
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
        actualTurn = ((actualTurn != listOfPlayers.length - 1) ? actualTurn + 1 : 0);
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
    
    if (parseInt(layer.feature.properties.playerId)-1 == actualTurn) {
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
    

   
}

function resetHighlight(e) {

    if ($("#attk-turn-label").hasClass('active') && (prevSelectedPolygon != undefined || prevSelectedPolygon !=null)&&e.target.feature.id == prevSelectedPolygon.id ) {
        console.log("here");
    }
    else
    {
        geojson.resetStyle(e.target);
    }
   
    
}

// GET PROPER MARKER ID WHEN SEARCHING FROM LAYERS
function getMarkerId(marker_id) {
    return FIRST_LAYER + (marker_id == 1 ? 0 : marker_id);
}
function replaceTroops(marker_id, num) {
    //Increase troop number on marker and assign new value
    if (marker_id != null) {
        var temp = num;
        markers._layers[getMarkerId(marker_id)]._icon.innerHTML = temp;
        statesData.features[marker_id].properties.troops = temp;
    }

}
function subTroopsToTerritory2(marker_id, num) {
    //Increase troop number on marker and assign new value
    if (marker_id != null) {
        var temp = parseInt(markers._layers[getMarkerId(marker_id)]._icon.innerHTML) - num;
        markers._layers[getMarkerId(marker_id)]._icon.innerHTML = temp;
        statesData.features[marker_id].properties.troops = temp;
    }

}

function zoomToFeature(e) {
    var currentPlayer = document.getElementById("turn-info-person");
    var intersects = null;
    var mytime2;
    if (prevSelectedPolygon != undefined) {
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
    if ($("#attk-turn-label").hasClass('active')) {
        if (isStateSelected == 1 && e.target.feature.properties.playerName != prevSelectedPolygon.properties.playerName && e.target.feature.properties.playerName != currentPlayer.innerHTML && intersects != null) {

            e.target.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
          
            isStateSelected = 0;

            callAjaxfunc(e.target, parseInt(e.target.feature.id), currentPlayer);


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
            if (prevSelectedTarget != undefined || prevSelectedTarget != null) {
                geojson.resetStyle(prevSelectedTarget);
            }
           
            mymap.fitBounds(e.target.getBounds());
            prevSelectedTarget = e.target;
            prevSelectedPolygon = JSON.parse(JSON.stringify(e.target.feature));
            prevSelectedPoint = JSON.parse(JSON.stringify(e.latlng));
            isStateSelected = 1;
        }
        else {
           
            mymap.fitBounds(e.target.getBounds());
            isStateSelected = 0
        }
       


    }
    else if ($("#fortify-turn-label").hasClass('active')){
        playerPossessPolygon(parseInt(e.target.feature.id));
        isStateSelected = 0;
    }
    else {
        isStateSelected = 0;
        let marker_id = parseInt(e.target.feature.id);
        if (parseInt(document.getElementById("troop-count").innerHTML) <= 0) return;
        assignTroopToMarker(marker_id,e);
        
        
    }
    var count = 0;
    
    for (var i = 0; i < statesData.features.length; i++) {

        if (statesData.features[i].properties.playerName == e.target.feature.properties.playerName) {
            count++;
        }
    }
    if (count == 40) {
        alert("GAME OVER.\n" + e.target.features.properties.playerName + " won the war!!!");
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
    var geojsonFeatureMarker;
    if(d.geometry.type=="Polygon")
    {
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

function updateTerr(Id, defenderId) {
    var js = { "attackerid": actualTurn, "defenderid": defenderId, "territoryid": Id };
    $.ajax({
        url: "Player/AddPlayerTerr",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(js),
        dataType: "json",
        success: function (response) {
            console.log(response);

        },
        error: function (response) {
            console.log(response);

        }
    })
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
                geojson.resetStyle(prevSelectedTarget);
                geojson.resetStyle(target);

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
            }

        },
        error: function (response) {
            console.warn('Send - error', response);
        }
    });
    //updateTerr(target.feature.id, target.feature.properties.playerId);

}


