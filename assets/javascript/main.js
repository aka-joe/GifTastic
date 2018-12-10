$(document).ready(function () {
    // API key for Giphy
    var APIkey = "mngk5SvzQ4ueJME0P1Ny4MaxnGV169e3";

    // Initialize variables
    var choices = ["Ed Sheeran", "Taylor Swift", "Bruno Mars", "Ariana Grande", "Big Bang", "Psy", "BTS", "SNSD"];
    var choiceDisplay = $(".choices");
    var itunesDisplay = $(".logo");
    var resultDisplay = $(".resultDisplay");
    var welcome = $("#welcome");
    var welcomeImg = $("#welcomeImg");
    var popup = $("#titleCenter");
    var music = document.createElement('audio');
    var favID = [];
    var favGif = [];
    var favStill = [];
    var favRating = [];
    var page = "empty";

    // Initialize local storage
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
    var favList = $(".badge").text(favID.length);

    // Initialize default buttons
    choices.forEach(function (x, i) {
        var choice = $("<button>").attr({ value: x, "data-count": 10, class: "btn btn-sm btn-outline-danger mt-2 ml-2 choice" }).text(x);
        choiceDisplay.append(choice);
    });

    // Reset
    reset();
    welcome.fadeIn();

    // Adding click event listen listener to all buttons
    $(document).on("click", ".choice", function () {
        if (page != "main") {
            page = "main";
            reset();
        }

        var query = $(this).val();
        itunesAPI(query); // Call Itunes API function

        var limit = Number($(this).attr("data-count"));
        $(this).attr("data-count", limit + 10);
        queryURL = "https://api.giphy.com/v1/gifs/search?rating=pg-13&q=" + query + "&limit=" + limit + "&api_key=" + APIkey;

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

    // Using Itunes API to play random track and show title on the screen
    function itunesAPI(term) {
        $.ajax({
            url: 'https://itunes.apple.com/search',
            crossDomain: true,
            dataType: 'jsonp',
            data: {
                term: term,
                entity: 'song',
                limit: 20,
                explicit: 'No'
            },
            method: 'GET'
        }).then(function (data) {
            var results = data.results;
            var n = Math.floor((Math.random() * 20));
            var trackName = results[n].trackName;
            if (trackName.length > 20) {
                trackName = trackName.substring(0, 18) + "...";
            }
            var image = $("<img class='albumArt rounded'>").attr("src", results[n].artworkUrl60);
            var title = $("<a class='title text-light' target='_blank'>").attr("href", results[n].trackViewUrl).text(trackName);
            var playBtn = $("<button class='playBtn btn btn-sm btn-warning'>").text("▶");
            itunesDisplay.empty().append(image, title, playBtn);

            music.setAttribute('src', results[n].previewUrl);
            music.currentTime = 0;
            music.play();
        });
    };

    // Create GIF card (+ Favorite button, Showing rating, Download button)
    function pictureCard(id, gifUrl, stillUrl, rate, favStatus) {
        var starDiv = $("<div>").addClass("card mr-2 mb-2 result " + id);
        var p = $("<div class='input-group p-0'>")
        var rating = $("<div class='form-control'>").text("Rating: " + rate);
        var downloadBtn = $("<img class='downloadBtn'>").attr({
            src: "./assets/images/download.gif",
            height: 38,
            style: "cursor: pointer",
            data: gifUrl
        });
        var starImage = $("<img>").attr({
            "src": stillUrl,
            "data-still": stillUrl,
            "data-gif": gifUrl,
            "data-state": "still",
            "class": "img-fluid starImg card-top-img"
        });
        var fav = $("<button class='input-group-prepend pl-2 pr-2 favBtn'>")
            .text("♥").attr({
                style: 'z-index:9999; cursor:pointer;',
                "data-rating": rate,
                "data-still": stillUrl,
                "data-gif": gifUrl,
                id: id,
                "data-toggle": "modal",
                "data-target": "#modalCenter"
            });
        if (favStatus === -1) {
            fav.addClass("btn-outline-danger");
        } else {
            fav.addClass("btn-warning");
        }
        p.append(fav, rating, downloadBtn);
        starDiv.append(starImage, p).hide();
        resultDisplay.prepend(starDiv);
        starDiv.fadeIn();
    };

    // Clicked GIF to toggle action
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

    // Clicked 'Clear' button
    $("#clear").on("click", function () {
        page = "empty";
        reset();
        welcome.fadeIn();
    });

    // Create new button
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

    // Clicked Favorites list button
    $("#favorite").on("click", function (event) {
        page = "favorite";
        reset();
        favID.forEach(function (x, i) {
            pictureCard(x, favGif[i], favStill[i], favRating[i], 0);
        });
    });

    // Reset GIF search limit count
    function reset() {
        welcome.hide();
        itunesDisplay.text("Artist GIFs");
        resultDisplay.empty();
        $(".choice").attr("data-count", 10);
        music.pause();
        music.setAttribute('src', "");
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/random?rating=pg-13&tag=hello&api_key=" + APIkey,
            method: "GET"
        }).then(function (response) {welcomeImg.attr("src", response.data.image_original_url)});
    };

    // Add-to or remove-from Favorites list 
    $(document).on("click", ".favBtn", function () {
        var id = $(this).attr("id");
        var position = favID.indexOf(id);

        if (position === -1) {
            popup.text("Added to your ♥ Favorites list");
            favID.push(id);
            favGif.push($(this).attr("data-gif"));
            favStill.push($(this).attr("data-still"));
            favRating.push($(this).attr("data-rating"));
            $(this).removeClass("btn-outline-danger").addClass("btn-warning");
        } else {
            popup.text("Removed from your Favorites list");
            if (page === "favorite") {
                $("." + favID[position]).fadeOut();
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

        favList.text(favID.length);
        $('#modalCenter').delay(1500).fadeOut('slow');
        setTimeout(function () {
            $("#modalCenter").modal('hide');
        }, 2000);
    });

    // Control music play
    $(document).on("click", ".playBtn", function () {
        if (music.paused) {
            $(this).text("▶");
            music.play();
        } else {
            $(this).text("❚❚");
            music.pause();
        }
    });

    // Download GIF image
    $(document).on("click", ".downloadBtn", function (e) {
        e.preventDefault();
        var x = new XMLHttpRequest();
        x.open("GET", $(this).attr("data"), true);
        x.responseType = 'blob';
        x.onload = function (e) { download(x.response, "download.gif", "image/gif"); }
        x.send();
    });
});