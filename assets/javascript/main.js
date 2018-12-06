$(document).ready(function () {

    var choices = ["Ed Sheeran", "Taylor Swift", "Bruno Mars", "Ariana Grande", "Big Bang", "Psy", "BTS", "SNSD"];

    var limit = 10;
    var APIkey = "mngk5SvzQ4ueJME0P1Ny4MaxnGV169e3";

    var choiceDisplay = $(".choices");
    var resultDisplay = $(".resultDisplay");

    choices.forEach(function (x, i) {
        var choice = $("<button>").attr({ value: x, class: "btn btn-sm btn-outline-danger mt-2 ml-2 choice" }).text(x);
        choiceDisplay.append(choice);
    });

    // Adding click event listen listener to all buttons
    $(document).on("click", ".choice", function () {

        var query = $(this).val();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + query + "&api_key=" + APIkey + "&limit=" + limit;

        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var results = response.data;

            console.log(results);

            for (var i = 0; i < limit; i++) {
                var starDiv = $("<div class='mr-2 result'>");
                var p = $("<p>").text("Rating: " + results[i].rating);
                var starImage = $("<img>").attr({
                    "src": results[i].images.fixed_height_still.url,
                    "data-still": results[i].images.fixed_height_still.url,
                    "data-gif": results[i].images.fixed_height.url,
                    "data-state": "still",
                    "class": "img-fluid starImg"
                });

                starDiv.append(starImage, p);
                resultDisplay.prepend(starDiv);
            };
        });

        $(document).on("click", ".starImg", function (e) {
            e.stopImmediatePropagation(); // Prevent multi-runs the function;

            var gifSrc = $(this).attr("data-gif");
            var stillSrc = $(this).attr("data-still");
            var state = $(this).attr("data-state");

            if (state === "still") {
                $(this).attr({ "data-state": "gif", src: gifSrc });
            }
            else {
                $(this).attr({ "data-state": "still", src: stillSrc });
            };
        });

        $("#clear").on("click", function (event) {
            resultDisplay.empty();
        });

        $("#addon").on("click", function (event) {
            event.preventDefault();
            var x = $(".form-control").val();
            if (x != "") {
                var choice = $("<button>").attr({ value: x, class: "btn btn-sm btn-outline-danger mt-2 ml-2 choice" }).text(x);
                $(".choices").append(choice);
                $(".form-control").val("");
            };
        });
    });
});