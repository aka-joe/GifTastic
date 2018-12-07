$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCEadW-yXPvWKvlAuUotl5agky7uGxq67o",
        authDomain: "aj-giftastic.firebaseapp.com",
        databaseURL: "https://aj-giftastic.firebaseio.com",
        projectId: "aj-giftastic",
        storageBucket: "aj-giftastic.appspot.com",
        messagingSenderId: "40057201044"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

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
                var starDiv = $("<div class='card mr-2 mb-2 result'>");
                var p = $("<div class='input-group text-uppercase p-0'>")
                var fav = $("<button class='input-group-prepend btn-outline-danger pl-2 pr-2' style='z-index:9999'>").text("♥");
                var rating = $("<div class='form-control'>").text("Rating: " + results[i].rating);
                var starImage = $("<img>").attr({
                    "src": results[i].images.fixed_height_still.url,
                    "data-still": results[i].images.fixed_height_still.url,
                    "data-gif": results[i].images.fixed_height.url,
                    "data-state": "still",
                    "class": "img-fluid starImg card-top-img"
                });

                p.append(fav, rating);
                starDiv.append(starImage, p);
                resultDisplay.prepend(starDiv);
            };
        });
    });

    $(document).on("click", ".starImg", function (e) {
        var gifSrc = $(this).attr("data-gif");
        var stillSrc = $(this).attr("data-still");
        var state = $(this).attr("data-state");

        if (state === "still") {
            $(this).attr({ "data-state": "gif", src: gifSrc });
        } else {
            $(this).attr({ "data-state": "still", src: stillSrc });
        };
    });

    $("#clear").on("click", function () {
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

    $(".input-group-prepend").on("click", function () {
        
    });
});