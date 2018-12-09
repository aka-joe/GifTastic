$(document).ready(function () {
    var APIkey = "mngk5SvzQ4ueJME0P1Ny4MaxnGV169e3";

    var choices = ["Ed Sheeran", "Taylor Swift", "Bruno Mars", "Ariana Grande", "Big Bang", "Psy", "BTS", "SNSD"];
    var choiceDisplay = $(".choices");
    var resultDisplay = $(".resultDisplay");
    var favID = [];
    var favGif = [];
    var favStill = [];
    var favRating = [];
    var favPage = false;

    if (localStorage.getItem("favID") && localStorage.getItem("favGif") && localStorage.getItem("favStill") && localStorage.getItem("favRating")) {
        favID = JSON.parse(localStorage.getItem("favID"));
        favGif = JSON.parse(localStorage.getItem("favGif"));
        favStill = JSON.parse(localStorage.getItem("favStill"));
        favRating = JSON.parse(localStorage.getItem("favRating"));
    } else {
        localStorage.setItem("favID", JSON.stringify(favID));
        localStorage.setItem("favGif", JSON.stringify(favGif));
        localStorage.setItem("favStill", JSON.stringify(favStill));
        localStorage.setItem("favRating", JSON.stringify(favRating));
    }

    choices.forEach(function (x, i) {
        var choice = $("<button>").attr({ value: x, "data-count": 10, class: "btn btn-sm btn-outline-danger mt-2 ml-2 choice" }).text(x);
        choiceDisplay.append(choice);
    });

    // Adding click event listen listener to all buttons
    $(document).on("click", ".choice", function () {
        if (favPage) {
            favPage = false;
            resultDisplay.empty();
            $(".choice").attr("data-count", 10);
        }

        var query = $(this).val();
        var limit = Number($(this).attr("data-count"));
        $(this).attr("data-count", limit + 10);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + query + "&limit=" + limit + "&api_key=" + APIkey;

        // Performing an AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var results = response.data;
            for (var i = limit - 10; i < limit; i++) {
                var id = results[i].id;
                var gifUrl = results[i].images.fixed_height.url;
                var stillUrl = results[i].images.fixed_height_still.url;
                var rate = results[i].rating.toUpperCase();
                var favStatus = favID.indexOf(results[i].id);
                pictureCard(id, gifUrl, stillUrl, rate, favStatus);
            };
        });
    });

    function pictureCard(id, gifUrl, stillUrl, rate, favStatus) {
        var starDiv = $("<div>").addClass("card mr-2 mb-2 result " + id);
        var p = $("<div class='input-group p-0'>")
        var rating = $("<div class='form-control'>").text("Rating: " + rate);
        var starImage = $("<img>").attr({
            "src": stillUrl,
            "data-still": stillUrl,
            "data-gif": gifUrl,
            "data-state": "still",
            "class": "img-fluid starImg card-top-img"
        });
        var fav = $("<button class='input-group-prepend pl-2 pr-2 favBtn'>")
            .text("♥").attr({
                style: 'z-index:9999',
                "data-rating": rate,
                "data-still": stillUrl,
                "data-gif": gifUrl,
                id: id
            });
        if (favStatus === -1) {
            fav.addClass("btn-outline-danger");
        } else {
            fav.addClass("btn-warning");
        }

        p.append(fav, rating);
        starDiv.append(starImage, p);
        resultDisplay.prepend(starDiv);
    };

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
        $(".choice").attr("data-count", 10);
    });

    $("#addon").on("click", function (event) {
        event.preventDefault();
        var x = $(".form-control").val();
        if (x != "") {
            var choice = $("<button>").text(x).attr({
                value: x,
                "data-count": 10,
                class: "btn btn-sm btn-outline-danger mt-2 ml-2 choice"
            });
            $(".choices").append(choice);
            $(".form-control").val("");
        };
    });

    $("#favorite").on("click", function (event) {
        favPage = true;
        resultDisplay.empty();
        $(".choice").attr("data-count", 10);
        favID.forEach(function (x, i) {
            pictureCard(x, favGif[i], favStill[i], favRating[i], 0);
        });
    });

    $(document).on("click", ".favBtn", function () {
        var id = $(this).attr("id");
        var position = favID.indexOf(id);

        if (position === -1) {
            favID.push(id);
            favGif.push($(this).attr("data-gif"));
            favStill.push($(this).attr("data-still"));
            favRating.push($(this).attr("data-rating"));
            $(this).removeClass("btn-outline-danger").addClass("btn-warning");
        } else {
            if (favPage) {
                $("."+favID[position]).fadeOut();
            } else {
                $(this).removeClass("btn-warning").addClass("btn-outline-danger");
            };
            favID.splice(position, 1);
            favGif.splice(position, 1);
            favStill.splice(position, 1);
            favRating.splice(position, 1);
        };

        localStorage.setItem("favID", JSON.stringify(favID));
        localStorage.setItem("favGif", JSON.stringify(favGif));
        localStorage.setItem("favStill", JSON.stringify(favStill));
        localStorage.setItem("favRating", JSON.stringify(favRating));
    });
});