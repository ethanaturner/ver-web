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
        var userAvailableSources = [];
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
            let servicesSnapshot = snapshot.val().Services;
            // Build the array of sources
            if (servicesSnapshot.netflix == "Yes") {
                userAvailableSources.push("netflix");
            }
            if (servicesSnapshot.hulu == "Paid") {
                userAvailableSources.push("hulu_free");
                userAvailableSources.push("hulu_plus");
            } else {
                userAvailableSources.push("hulu_free");
            }
            if (servicesSnapshot.amazon == "Paid") {
                userAvailableSources.push("amazon_prime_free");
                userAvailableSources.push("amazon_prime");
            } else {
                userAvailableSources.push("amazon_prime_free");
            }
            if (servicesSnapshot.amazon_purchase== "Yes") {
                userAvailableSources.push("amazon_buy");
            }
            if (servicesSnapshot.crunchyroll == "Paid") {
                userAvailableSources.push("crunchyroll_free");
                userAvailableSources.push("crunchyroll_premium");
            } else {
                userAvailableSources.push("crunchyroll_free");
            }
        });
        $(".sf-menu #loginlink").addClass("loggedin");
        $('#offcanvas-menu #loginlink').addClass("loggedin");
        $("#add").css("display", "inline-block");
        getInformation(userAvailableSources);
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
        $("#add").css("display", "none");
        getInformation(userAvailableSources);
    }
});

$(document).on("click", "#add", function() {
    $("#addtocollectiondialog").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            autoOpen: true,
            buttons: [{
                id:"nobtn",
                text: "Nevermind",
                click: function() {
                    $(this).dialog( "close" );
                }
                }, {
                id: "yesbtn",
                text: "Yes",
                click: function() {
                    $(this).dialog("close");
                    var type = getParameterByName('type');
                    var id = getParameterByName('id');
                    var database = firebase.database();
                    var userId = firebase.auth().currentUser.uid;
                    var ref = database.ref("/Data/" + userId);
                    var collectionIDS = [];
                    ref.once('value').then(function(snapshot) {
                        collectionIDS = [];
                        if (snapshot.exists()) {
                            snapshot.forEach(function(childSnapshot) {
                                let snapshotID = childSnapshot.val().id;
                                let snapshotType = childSnapshot.val().type;
                                console.log(snapshotType);
                                if (snapshotType == type) {
                                    collectionIDS.push(snapshotID);
                                }
                            });
                        }
                    }).then(function() {
                        if (collectionIDS.includes(id)) {
                            console.log("Already in collection.");
                        } else {
                            addToFirebase();
                        }
                    });
                }
            }]
        }).dialog("open");

        function addToFirebase() {
            var type = getParameterByName('type');
            var id = getParameterByName('id');
            var database = firebase.database();
            var userId = firebase.auth().currentUser.uid;
            var ref = database.ref("/Data/" + userId);
            ref.push().set({
                id: id.toString(),
                type: type
            });
            console.log("Added.");
        }

});

$(document).on("click", "#offcanvas-menu #loginlink", function() {
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

$(document).on("click", "#addtocollectionbtn", function() {
    $("#addtocollectiondialog").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        autoOpen: true,
        buttons: [{
                id:"nobtn",
                text: "No",
                click: function() {
                    $(this).dialog( "close" );
                }
            }, {
                id: "yesbtn",
                text: "Yes",
                click: function() {
                    var type = getParameterByName('type');
                    var id = getParameterByName('id');
                    var database = firebase.database();
                    var userId = firebase.auth().currentUser.uid;
                    var ref = database.ref("/Data/" + userId);
                    ref.once('value').then(function(snapshot) {
                        if (snapshot.exists()) {
                            snapshot.forEach(function(childSnapshot) {
                                let snapshotID = childSnapshot.val().id;
                                let snapshotType = childSnapshot.val().type;
                                if (snapshotType == type) {
                                    var collectionIDS = [];
                                    collectionIDS.push(snapshotID);
                                    if (collectionIDS.includes(id)) {
                                       console.log("Already in collection.");
                                    } else {
                                        var newRecordRef = ref.push();
                                        newRecordRef.set({
                                            id: id.toString(),
                                            type: type
                                        });
                                        console.log("Added.");
                                    }
                                }
                            });
                        }
                    });
                }
            }]
    }).dialog("open");
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

function getInformation(userAvailableSources) {
    $("#progressbar").progressbar({
      value: false
    });
    var retryAttempts = 0;
    console.log("Starting information request.");
    var apiKey = "<API_KEY>";
    if (type == "show") {
        var url = "<API_URL>" + "<API_URL>" + id + "<API_URL>" + apiKey;
        if (type != null && id != null) {
            getAjax();
        }
        function getAjax() {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: function (data) {
                    setTimeout(function() {
                        var firstaired= data.first_aired;
                        function firstToUpperCase( str ) {
                                        return str.substr(0, 1).toUpperCase() + str.substr(1);
                        }
                        var capitalType = firstToUpperCase(type);
                        var posterURL = data.poster.replace("http", "https");
                        var imdbLink = "https://www.imdb.com/title/" + data.imdb_id;
                        var wikipediaLink = "https://en.wikipedia.org/wiki?curid=" + data.wikipedia_id;
                        $("#headertitle").text(data.title);
                        document.title = "Ver - " + data.title;
                        $("#contenttitle").text(data.title);
                        $("#contentimage").attr("src", posterURL);
                        $("#contentyeartype").text("First aired: " + firstaired + ", " + capitalType);
                        $("#contentoverview").text(data.overview);
                        $("#imdblink").attr("href", imdbLink);
                        $("#imdblink").text("IMDB");
                        $("#wikipedialink").attr("href", wikipediaLink);
                        $("#wikipedialink").text("Wikipedia");
                        $("#progressbar").css("display", "none");
                       getShowSources(id, userAvailableSources);
                    }, 1000);
                }
            }).fail(function() {
                console.log("API Requests might be being made too fast.");
                setTimeout(function() {
                    if (retryAttempts <= 4) {
                        retryAttempts++;
                        console.log(retryAttempts);
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
        var availableMovieSources = [];
        var url = "<API_URL>" + "<API_URL>" + id + "<API_URL>" + apiKey;
        if (type != null && id != null) {
            getMovieAjax();
        }
        function getMovieAjax() {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: function (data) {
                    setTimeout(function() {
                        var year = data.release_year;
                        function firstToUpperCase( str ) {
                            return str.substr(0, 1).toUpperCase() + str.substr(1);
                        }
                        var capitalType = firstToUpperCase(type);
                        var posterURL = data.poster_240x342.replace("http", "https");
                        var imdbLink = "https://www.imdb.com/title/" + data.imdb;
                        var wikipediaLink = "https://en.wikipedia.org/wiki?curid=" + data.wikipedia_id;
                        $("#headertitle").text(data.title);
                        document.title = "Ver - " + data.title;
                        $("#contenttitle").text(data.title);
                        $("#contentimage").attr("src", posterURL);
                        $("#contentyeartype").text(year + ", " + capitalType);
                        $("#contentoverview").text(data.overview);
                        $("#imdblink").attr("href", imdbLink);
                        $("#imdblink").text("IMDB");
                        $("#wikipedialink").attr("href", wikipediaLink);
                        $("#wikipedialink").text("Wikipedia");
                        $("#progressbar").css("display", "none");

                        if (firebase.auth().currentUser != null) {
                            var database = firebase.database();
                            var userId = firebase.auth().currentUser.uid;
                            var ref = database.ref("/Data/" + userId);
                            var done;
                            var presentInCollection;
                            ref.orderByChild('id').equalTo(id).once("value").then(function(snapshot) {
                                if (snapshot.exists()) {
                                    snapshot.forEach(function(childSnapshot) {
                                        if (childSnapshot.val().id == id && childSnapshot.val().type == type) {
                                            if (availableMovieSources.includes("Your Collection") == false) {
                                                availableMovieSources.push("Your Collection");
                                            }
                                        }
                                    });
                                }
                            }).then(function() {
                                done = true;
                                console.log(availableMovieSources);
                            }).then(function() {
                                let freeIOSSources = Array.from(data.free_ios_sources);
                                freeIOSSources.forEach(function(titleSource) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (titleSource.source == userSource) {
                                                if (availableMovieSources.includes(userSource) == false) {
                                                    availableMovieSources.push(userSource);
                                                }
                                            }
                                    });
                                });
                                let subscriptionWebSources = Array.from(data.subscription_web_sources);
                                subscriptionWebSources.forEach(function(titleSource) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (titleSource.source == userSource) {
                                                if (availableMovieSources.includes(userSource) == false) {
                                                    availableMovieSources.push(userSource);
                                                }
                                            }
                                    });
                                });
                                let subscriptionIOSSources = Array.from(data.subscription_ios_sources);
                                subscriptionIOSSources.forEach(function(titleSource) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (titleSource.source == userSource) {
                                                if (availableMovieSources.includes(userSource) == false) {
                                                    availableMovieSources.push(userSource);
                                                }
                                            }
                                    });
                                });
                                let subscriptionAndroidSources = Array.from(data.subscription_android_sources);
                                subscriptionAndroidSources.forEach(function(titleSource) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (titleSource.source == userSource) {
                                                if (availableMovieSources.includes(userSource) == false) {
                                                    availableMovieSources.push(userSource);
                                                }
                                            }
                                    });
                                });
                                let purchaseWebSources = Array.from(data.purchase_web_sources);
                                purchaseWebSources.forEach(function(titleSource) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (titleSource.source == userSource) {
                                                if (availableMovieSources.includes(userSource) == false) {
                                                    availableMovieSources.push(userSource);
                                                }
                                            }
                                    });
                                });
                                let purchaseIOSSources = Array.from(data.purchase_ios_sources);
                                purchaseIOSSources.forEach(function(titleSource) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (titleSource.source == userSource) {
                                                if (availableMovieSources.includes(userSource) == false) {
                                                    availableMovieSources.push(userSource);
                                                }
                                            }
                                    });
                                });

                                let otherSources = Array.from(data.other_sources);
                                otherSources.forEach(function(titleSource) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (titleSource.source == userSource) {
                                                if (availableMovieSources.includes(userSource) == false) {
                                                    availableMovieSources.push(userSource);
                                                }
                                            }
                                    });
                                });
                                var stringSources = availableMovieSources.join(", ").replace("amazon_prime", "Amazon Prime").replace("amazon_buy", "Amazon (Purchase)").replace("hulu_plus", "Hulu Plus");
                                console.log(availableMovieSources);
                                if (stringSources != "") {
                                    $("#availablesourcesparagraph").text(stringSources);
                                } else {
                                    $("#availablesourcesparagraph").text("Sorry, this title doesn't appear to be available on your services.");
                                }
                            });
                        } else {
                            let freeIOSSources = Array.from(data.free_ios_sources);
                            freeIOSSources.forEach(function(titleSource) {
                                if (availableMovieSources.includes(titleSource.source) == false) {
                                    availableMovieSources.push(titleSource.source);
                                }
                            });
                            let subscriptionWebSources = Array.from(data.subscription_web_sources);
                            subscriptionWebSources.forEach(function(titleSource) {
                                if (availableMovieSources.includes(titleSource.source) == false) {
                                    availableMovieSources.push(titleSource.source);
                                }
                            });
                            let subscriptionIOSSources = Array.from(data.subscription_ios_sources);
                            subscriptionIOSSources.forEach(function(titleSource) {
                                if (availableMovieSources.includes(titleSource.source) == false) {
                                    availableMovieSources.push(titleSource.source);
                                }
                            });
                            let subscriptionAndroidSources = Array.from(data.subscription_android_sources);
                            subscriptionAndroidSources.forEach(function(titleSource) {
                                if (availableMovieSources.includes(titleSource.source) == false) {
                                    availableMovieSources.push(titleSource.source);
                                }
                            });
                            let purchaseWebSources = Array.from(data.purchase_web_sources);
                            purchaseWebSources.forEach(function(titleSource) {
                                if (availableMovieSources.includes(titleSource.source) == false) {
                                    availableMovieSources.push(titleSource.source);
                                }
                            });
                            let purchaseIOSSources = Array.from(data.purchase_ios_sources);
                            purchaseIOSSources.forEach(function(titleSource) {
                                if (availableMovieSources.includes(titleSource.source) == false) {
                                    availableMovieSources.push(titleSource.source);
                                }
                            });

                            let otherSources = Array.from(data.other_sources);
                            otherSources.forEach(function(titleSource) {
                                if (availableMovieSources.includes(titleSource.source) == false) {
                                    availableMovieSources.push(titleSource.source);
                                }
                            });
                            var stringSources = availableMovieSources.join(", ").replace("amazon_prime", "Amazon Prime").replace("amazon_buy", "Amazon (Purchase)").replace("hulu_plus", "Hulu Plus").replace("itunes", "iTunes (Purchase)").replace("google_play", "Google Play (Purchase)").replace("youtube_purchase", "YouTube (Purchase)").replace("verizon_on_demand", "Verizon On Demand");
                            if (stringSources != "") {
                                $("#availablesourcesparagraph").text(stringSources);
                            } else {
                                $("#availablesourcesparagraph").text("Sorry, this title doesn't appear to be available on your services.");
                            }
                        }
                    }, 1000);
                }
            }).fail(function() {
                console.log("API Requests might be being made too fast.");
                setTimeout(function() {
                    if (retryAttempts <= 4) {
                        retryAttempts++;
                        console.log(retryAttempts);
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
                }, 4000);
            });
        }
    }
}

function getShowSources(sourcesID, userAvailableSources) {
    var availableSources = [];
    var sourceRetryAttempts = 0;
    var apiKey = "<API_KEY>";
    var url = "<API_URL>" + "shows/" + sourcesID + "<API_URL>" + apiKey;
    getSourceAjax();
    function getSourceAjax() {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function (data) {
                setTimeout(function() {
                    if (firebase.auth().currentUser != null) {
                            var database = firebase.database();
                            var userId = firebase.auth().currentUser.uid;
                            var ref = database.ref("/Data/" + userId);
                            var done;
                            var presentInCollection;
                            ref.orderByChild('id').equalTo(sourcesID).once("value").then(function(snapshot) {
                                if (snapshot.exists()) {
                                    snapshot.forEach(function(childSnapshot) {
                                        if (childSnapshot.val().id == sourcesID && childSnapshot.val().type == "show") {
                                            if (availableSources.includes("Your Collection") == false) {
                                                availableSources.push("Your Collection");
                                            }
                                        }
                                    });
                                }
                            }).then(function() {
                                done = true;
                            }).then(function() {
                                let results = data.results;
                                let webSources = results.web;
                                let episodes = webSources.episodes;
                                let allSources = Array.from(episodes.all_sources);
                                allSources.forEach(function(source) {
                                    userAvailableSources.forEach(function(userSource) {
                                        if (source.source == userSource || source.type == "free") {
                                            if (availableSources.includes(source.source) == false) {
                                                    availableSources.push(source.source);
                                                }
                                        }
                                    });
                                });
                                var stringSources = availableSources.join(", ").replace("hulu_plus", "Hulu Plus").replace("amazon_buy", "Amazon (Purchase)").replace("amazon_prime", "Amazon Prime").replace("netflix", "Netflix");
                                if (stringSources != "") {
                                    $("#availablesourcesparagraph").text(stringSources);
                                } else {
                                    $("#availablesourcesparagraph").text("Sorry, this title doesn't appear to be available on your services.");
                                }
                            });
                    } else {
                        let results = data.results;
                        let webSources = results.web;
                        let episodes = webSources.episodes;
                        let allSources = Array.from(episodes.all_sources);
                        allSources.forEach(function(source) {
                            if (availableSources.includes(source.source) == false) {
                                    availableSources.push(source.source);
                            }
                        });
                        var stringSources = availableSources.join(", ").replace("hulu_plus", "Hulu Plus").replace("amazon_buy", "Amazon (Purchase)").replace("amazon_prime", "Amazon Prime").replace("netflix", "Netflix");
                        if (stringSources != "") {
                            $("#availablesourcesparagraph").text(stringSources);
                        } else {
                            $("#availablesourcesparagraph").text("Sorry, this title doesn't appear to be available on your services.");
                        }
                    }
                }, 1000);
            }
        }).fail(function() {
            console.log("API Requests might be being made too fast.");
            setTimeout(function() {
                if (sourceRetryAttemptsretryAttempts <= 4) {
                    sourceRetryAttemptsretryAttempts++;
                    console.log(sourceRetryAttemptsretryAttempts);
                    getSourceAjax();
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
