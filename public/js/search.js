var config = {
    apiKey: "<API_KEY>",
    authDomain: "<AUTH_DOMAIN>",
    databaseURL: "<DB_URL>",
    storageBucket: "<SB_URL>",
    messagingSenderId: "<MESSAGESENDER_ID>"
};
if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
}
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    	console.log("User signed in.");
        $("#accountmenu").addClass("visible");
        $(".fh5co-sub-menu").addClass("visible");
        $('.sf-menu #loginlink').text("Loading . . .");
        $('#offcanvas-menu #loginlink').text("Loading . . .");
        var database = firebase.database();
        var userId = firebase.auth().currentUser.uid;
        var ref = database.ref("/Users/" + userId);
        ref.once('value').then(function(snapshot) {
            let fullname = snapshot.val().firstname + " " + snapshot.val().lastname;
            $('.sf-menu #loginlink').text(fullname);
            $('#offcanvas-menu #loginlink').text(fullname);
        });
        $(".sf-menu #loginlink").addClass("loggedin");
        $('#offcanvas-menu #loginlink').addClass("loggedin");
        getSearchResults();
      } else {
        $(".sf-menu #loginlink").removeClass("loggedin");
        $('#offcanvas-menu #loginlink').removeClass("loggedin");
        console.log("No user signed in.");
      	$("#accountmenu").removeClass("visible");
        $(".fh5co-sub-menu").removeClass("visible", function() {
        	$('.sf-menu #loginlink').text("Signing out . . .");
        	$('#offcanvas-menu #loginlink').text("Signing out . . .");
            $('.sf-menu #loginlink').text("Log in");
            $('#offcanvas-menu #loginlink').text("Log in");
        });
        getSearchResults();
    }
});

$(document).on("click", "#offcanvas-menu #loginlink", function() {
    console.log("Hello");
    if ($(".sf-menu #loginlink").hasClass("loggedin")) {

    } else {
        $("#logindialog").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            autoOpen: true,
            buttons: [{
                id: "registerinstead",
                text: "Register instead",
                click: function() {
                    $(this).dialog("close");
                    window.location.replace("https://www.theverapp.com/register.html");
                }
                }, {
                id:"cancel",
                text: "Nevermind",
                click: function() {
                    $(this).dialog( "close" );
                }
                }, {
                id: "signin",
                text: "Sign in",
                click: function() {
                    $(this).dialog("close");
                    var username = $("#email").val();
                    var password = $("#password").val();
                    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
                    console.log(error.message);
                    });
                }
            }]
        }).dialog("open");
    }
});

$(document).on("click", "#offcanvas-menu #logoutlink", function() {
    firebase.auth().signOut().then(function() {
        console.log("Logged out.");
    }, function(error) {
        console.log(error.message);
    });
});

$(document).on("click", ".sf-menu #logoutlink", function() {
    firebase.auth().signOut().then(function() {
        console.log("Logged out.");
    }, function(error) {
        console.log(error.message);
    });
});

$(document).on("click",'.sf-menu #loginlink',function(){
    if ($(".sf-menu #loginlink").hasClass("loggedin")) {

    } else {
        $("#logindialog").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            autoOpen: true,
            buttons: [{
                id: "registerinstead",
                text: "Register instead",
                click: function() {
                    $(this).dialog("close");
                    window.location.replace("https://www.theverapp.com/register.html");
                }
                }, {
                id:"cancel",
                text: "Nevermind",
                click: function() {
                    $(this).dialog( "close" );
                }
                }, {
                id: "signin",
                text: "Sign in",
                click: function() {
                    $(this).dialog("close");
                    var username = $("#email").val();
                    var password = $("#password").val();
                    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
                    console.log(error.message);
                    });
                }
            }]
        }).dialog("open");
    }
});

$(document).on("click", "#resetpassword", function() {
    console.log("Resetting password.");
    if ($("#email").val()) {
        firebase.auth().sendPasswordResetEmail($("#email").val()).then(function() {
          $("#resetpassword").text("Email sent");
        }, function(error) {
          $("#resetpassword").text(error.message);
        });
    } else {
        $("#resetpassword").text("Please enter your email first.");
    }
});

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getSearchResults() {
    $("#progressbar").progressbar({
      value: false
    });
    var retryAttempts = 0;
    console.log("Starting information request");
    var apiKey = "<API_KEY>";
    $("#headertitle").text("Search for: " + query);
    document.title = "Ver - Search for '" + query + "'";
    $("#resultspaneltitle").text("Results for: '" + query + "'");
    if (type == "show") {
        var url = "<API_URL>" + apiKey + "<API_URL>" + rawQuery;
        getAjax();
        function getAjax() {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: function (data) {
                    setTimeout(function() {
                        var results = data.results;
                        if ($.isEmptyObject(results)) {
                            setTimeout(function() {
                                $("#resulttitle").text("Sorry, no results turned up.");
                            },4000);
                        } else {
                            $("#resultsplaceholder").css("display", "none");
                            results.forEach(function(singleResult) {
                                var id = singleResult.id;
                                var rawYear = singleResult.first_aired;
                                var year = "";
                                if (rawYear != null) {
                                    year = rawYear.substring(0,4);
                                }
                                var posterURL = singleResult.artwork_208x117.replace("http", "https");
                                var title = singleResult.title;
                                var infoURL = "information.html?type=" + type + "&id=" + id;
                                $("#resultslist").append("<a href='" + infoURL + "' class='list-group-item collection-list-item'><img id='resultimage' src='" + posterURL + "'/><div class='resultinfocontainer'><h4 id='resulttitle'>" + title + "</h4><p id='resultoverview'>" + year + "</p></div></a>");
                        });
                        }
                    }, 1000);

                }
            }).fail(function() {
                console.log("API Requests might be being made too fast.");
                setTimeout(function() {
                    if (retryAttempts <= 4) {
                        retryAttempts++;
                        console.log(retryAttempts)
                        getAjax();
                    } else {
                        $("#requestfaileddialog").dialog({
                            resizable: false,
                            height: "auto",
                            width: 400,
                            autoOpen: true,
                            buttons: [{
                                    id:"cancel",
                                    text: "Okay",
                                    click: function() {
                                        $(this).dialog( "close" );
                                    }
                                }]
                        }).dialog("open");
                    }
                }, 4000);
            });
        }
    } else {
        var movieRetryAttempts = 0;
        var url = "<API_URL>" + apiKey + "<API_URL>" + rawQuery;
        console.log(url);
        getMovieAjax();
        function getMovieAjax() {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: function (data) {
                    setTimeout(function() {
                        var results = data.results;
                         if ($.isEmptyObject(results)) {
                            setTimeout(function() {
                                $("#resulttitle").text("Sorry, no results turned up.");
                            },4000);
                        } else {
                            $("#resultsplaceholder").css("display", "none");
                            results.forEach(function(singleResult) {
                                var id = singleResult.id;
                                var posterURL = singleResult.poster_120x171.replace("http", "https");
                                var title = singleResult.title;
                                var overview = singleResult.release_year;
                                var infoURL = "information.html?type=" + type + "&id=" + id;
                                $("#resultslist").append("<a href='" + infoURL + "' class='list-group-item collection-list-item'><img id='resultimage' src='" + posterURL + "'/><div class='resultinfocontainer'><h4 id='resulttitle'>" + title + "</h4><p id='resultoverview'>" + overview + "</p></div></a>");
                            });
                        }
                    }, 1000);
                }
            }).fail(function() {
                console.log("API Requests might be being made too fast.");
                setTimeout(function() {
                    if (movieRetryAttempts <= 4) {
                        movieRetryAttempts++;
                        console.log(movieRetryAttempts)
                        getMovieAjax();
                    } else {
                        $("#requestfaileddialog").dialog({
                            resizable: false,
                            height: "auto",
                            width: 400,
                            autoOpen: true,
                            buttons: [{
                                    id:"cancel",
                                    text: "Okay",
                                    click: function() {
                                        $(this).dialog( "close" );
                                    }
                                }]
                        }).dialog("open");
                    }
                }, 40000);
            });
        }
    }
    setTimeout(function() {
        $("#progressbar").css("display", "none");
    },4000);
}

$(document).on("click", "#pagegosearchbtn", function() {
    if ($("#pagesearchfield").val()) {
        var query = $("#pagesearchfield").val();
        var type = "";
        $("#typedialog").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            autoOpen: true,
            buttons: [{
                id:"cancel",
                text: "Nevermind",
                click: function() {
                    $(this).dialog( "close" );
                }
                }, {
                id: "moviebutton",
                text: "Movie",
                click: function() {
                    $(this).dialog("close");
                    type = "movie";
                    var URL = "search.html?type=" + type + "&query=" + query;
                    window.location.replace(URL);
                }
                },{
                    id: "showbutton",
                    text: "Show",
                    click: function() {
                        $(this).dialog("close");
                        type = "show";
                        var URL = "search.html?type=" + type + "&query=" + query;
                        window.location.replace(URL);
                    }
                }]}).dialog("open");
    } else {
        $("#pagesearchfield").attr("placeholder", "Oops, please enter a title first.");
    }
});
