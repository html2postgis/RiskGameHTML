
//var initialTroopsNum;
//var initialTerritories;

//function functABC() {

//    // returns a promise that can be used later. 

//    return $.ajax({
//        url: "Dice/GetInitialTerritories",
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            console.log('success', response)
//        },
//        error: function (response) {
//            console.warn('error', response);
//        }
//    });
//}


//functABC().then(response =>
//    console.log("hello",response));


//functABC().then(response => console.log(response));


$.when(
    //$.ajax({
    //    url: "Dice/GetInitialTerritories",
    //    type: "GET",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {
    //        console.log('success', response)
    //    },
    //    error: function (response) {
    //        console.warn('error', response);
    //    }
    //}),
    //$.ajax({
    //    url: "Dice/GetInitialTroops",
    //    type: "GET",
    //    contentType: "application/json",

    //    dataType: "json",
    //    success: function (response) {
    //        console.log('success', response);
    //        initialTroopsNum = JSON.parse(JSON.stringify(response));

    //    },
    //    error: function (response) {
    //        console.warn('error', response);
    //    }
    //}),
    //$.ajax({
    //    url: "Dice/PostInitialTerritories",
    //    type: "POST",
    //    contentType: "application/json",
    //    data: JSON.stringify(response),
    //    dataType: "json",
    //    success: function (response) {
    //        console.log('success', response);
    //    },
    //    error: function (response) {
    //        console.warn('error', response);
    //    }
    //})
//    $.ajax({
//        url: "Dice/GetInitialTerritories",
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {

//            initialTerritories = JSON.parse(JSON.stringify(response));
//            console.log('success1', response);
//            $.ajax({
//                url: "Dice/PostInitialTerritories",
//                type: "POST",
//                contentType: "application/json",
//                data: JSON.stringify(response),
//                dataType: "json",
//                success: function (response) {
//                    console.log('success2', response);

//                    $.ajax({
//                        url: "Dice/GetInitialTroops",
//                        type: "GET",
//                        contentType: "application/json",

//                        dataType: "json",
//                        success: function (response) {
//                            console.log('success3', response);
//                            initialTroopsNum = JSON.parse(JSON.stringify(response));

//                        },
//                        error: function (response) {
//                            console.warn('error', response);
//                        }
//                    });
//                },
//                error: function (response) {
//                    console.warn('error', response);
//                }
//            });
//        },
//        error: function (response) {
//            console.warn('error', response);
//        }
//    })
//).then(function (response1, repsonse2) {
//    console.log("last", initialTerritories);
//    for (var i = 0; i < initialTerritories; i++) {
//        switch (i) {
//            case i < 13:
//                statesData.features[initialTerritories[i]].player = 'Player1';
//                statesData.features[initialTerritories[i]].properties.color = "black";
//                break;
//            case i < 26:
//                statesData.features[initialTerritories[i]].player = 'Player2';
//                statesData.features[initialTerritories[i]].properties.color = "black";
//                break;
//            default:
//                statesData.features[initialTerritories[i]].player = 'Buffer';
//                statesData.features[initialTerritories[i]].properties.color = "black";

//        }
        
       


//        //console.log(statesData.features[i]);
//    }
    
//});
//function loadFilesAndDoStuff() {
//    checkDone();
//    var cntr = 1;
//    var data1, data2, data3;

//    function checkDone() {
//        --cntr;
//        if (cntr === 0) {
//            // all three are done here
//            someOtherFunction(combined_file_data);
//        }
//    }

   
//}
    //$.ajax({
    //    url: "Dice/GetInitialTerritories",
    //    type: "GET",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {

    //        initialTerritories = JSON.parse(JSON.stringify(response));
    //        console.log('success', response);
    //        $.ajax({
    //            url: "Dice/PostInitialTerritories",
    //            type: "POST",
    //            contentType: "application/json",
    //            data: JSON.stringify(response),
    //            dataType: "json",
    //            success: function (response) {
    //                console.log('success', response);

    //                $.ajax({
    //                    url: "Dice/GetInitialTroops",
    //                    type: "GET",
    //                    contentType: "application/json",

    //                    dataType: "json",
    //                    success: function (response) {
    //                        console.log('success', response);
    //                        initialTroopsNum = JSON.parse(JSON.stringify(response));

    //                    },
    //                    error: function (response) {
    //                        console.warn('error', response);
    //                    }
    //                });
    //            },
    //            error: function (response) {
    //                console.warn('error', response);
    //            }
    //        });
    //    },
    //    error: function (response) {
    //        console.warn('error', response);
    //    }
    //});

   
//function getNewColor(d) {
//    return d > 25 ? '#5cb85c' :
//            d > 12 ? '#f0ad4e' :
//            '#d9534f';
   
//}