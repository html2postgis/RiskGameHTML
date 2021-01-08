
var initialTroopsNum;
var initialTerritories;

function getInitialSetup() {
    $.ajax({
        url: "Dice/GetInitialTerritories",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            initialTerritories = JSON.parse(JSON.stringify(response));
            console.log('success', response);
            $.ajax({
                url: "Dice/PostInitialTerritories",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(response),
                dataType: "json",
                success: function (response) {
                    console.log('success', response);

                    $.ajax({
                        url: "Dice/GetInitialTroops",
                        type: "GET",
                        contentType: "application/json",

                        dataType: "json",
                        success: function (response) {
                            console.log('success', response);
                            initialTroopsNum = JSON.parse(JSON.stringify(response));

                        },
                        error: function (response) {
                            console.warn('error', response);
                        }
                    });
                },
                error: function (response) {
                    console.warn('error', response);
                }
            });
        },
        error: function (response) {
            console.warn('error', response);
        }
    });
}