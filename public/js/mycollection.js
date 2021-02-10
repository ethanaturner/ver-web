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
        if ($('#nouserdialog').dialog() != null) {
            $("#nouserdialog").removeClass("visible");
            $("#nouserdialog" ).dialog("close");
        }
        $("#fh5co-page #overlay").addClass("disabled");
        getCollection();
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
        $("#overlay").removeClass("disabled");
        $("#nouserdialog").addClass("visible");
        $("#nouserdialog" ).dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: 400,
            autoOpen: true,
            buttons: [{
                id: "backhome",
                text: "Return to home",
                click: function() {
                    window.location.replace("https://www.theverapp.com");
                }
            }]
        });
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

function getCollection() {
     $("#progressbar").progressbar({
      value: false
    });
    var retryAttempts = 0;
    console.log("User signed in, starting collection download.");
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    var ref = database.ref("/Data/" + userId);
    var apiKey = "<API_KEY>";
    ref.once('value').then(function(snapshot) {
        if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
                $("#collectionplaceholder").css("display", "none");
                let id = childSnapshot.val().id;
                let type = childSnapshot.val().type;
                if (type == "show") {
                    var url = "<API_KEY>" + "<API_KEY>" + id + "<API_KEY>" + apiKey;
                    console.log(url);
                    getAjax();
                    function getAjax() {
                        $.ajax({
                            type: 'GET',
                            url: url,
                            dataType: 'json',
                            success: function (data) {
                                setTimeout(function() {
                                    var rawyear = data.first_aired;
                                    var year = rawyear.substring(0, 4);
                                    function firstToUpperCase( str ) {
                                        return str.substr(0, 1).toUpperCase() + str.substr(1);
                                    };
                                    var capitalType = firstToUpperCase(type);
                                    $("#mycollectionlist").append("<a href='information.html?type=" + type + "&id=" + id + "' class='list-group-item collection-list-item'><h4 class='list-group-item-heading'>" + data.title + "</h4><h5>" + year + ", " + capitalType + "</h5><p class='list-group-item-text'>" + data.overview + "</p></a>")
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
                    var url = "<API_KEY>" + "<API_KEY>" + id + "<API_KEY>" + apiKey;
                    console.log(url);
                    getMovieAjax();
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
                                    $("#mycollectionlist").append("<a href='information.html?type=" + type + "&id=" + id + "' ' class='list-group-item collection-list-item'><h4 class='list-group-item-heading'>" + data.title + "</h4><h5>" + year + ", " + capitalType + "</h5><p class='list-group-item-text'>" + data.overview + "</p></a>")
                                }, 1000);
                            }
                        }).fail(function() {
                            console.log("API Requests might be being made too fast.");
                            setTimeout(function() {
                                if (retryAttempts <= 4) {
                                    retryAttempts++;
                                    console.log(retryAttempts)
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
        });
    }
     setTimeout(function() {
        $("#progressbar").css("display", "none");
    },4000);
});
}
