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
