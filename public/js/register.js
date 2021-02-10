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
        $(".sf-menu #loginlink").addClass("loggedin");
        $('#offcanvas-menu #loginlink').addClass("loggedin");
        var database = firebase.database();
        var userId = firebase.auth().currentUser.uid;
        var ref = database.ref("/Users/" + userId);
        ref.once('value').then(function(snapshot) {
            if (snapshot.exists()) {
                let fullname = snapshot.val().firstname + " " + snapshot.val().lastname;
                $('.sf-menu #loginlink').text(fullname);
                $('#offcanvas-menu #loginlink').text(fullname);
            }
        });
      } else {
        console.log("No user.");
        $(".sf-menu #loginlink").removeClass("loggedin");
        $('#offcanvas-menu #loginlink').removeClass("loggedin");
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

$(document).on("click", "#confirmregisterbtn", function() {
if($('#honeypot-div input').val() == '') {
    if ($("#registerfirstname").val() && $("#registerlastname").val() && $("#registeremail").val() && $("#registerconfirmemail").val() && $("#registerpassword").val() && $("#registerconfirmpassword").val()) {
        if ($("#registeremail").val() == $("#registerconfirmemail").val()) {
            if ($("#registerpassword").val() == $("#registerconfirmpassword").val()) {
                firebase.auth().createUserWithEmailAndPassword($("#registerconfirmemail").val(), $("#registerconfirmpassword").val()).catch(function(error) {
                        $("#subtext").text(error.message);
                        $("#subtext").css("color", "red");
                    }).then(function() {
                        var database = firebase.database();
                        var userId = firebase.auth().currentUser.uid;
                        var ref = database.ref("/Users/" + userId);
                        var firstname = $("#registerfirstname").val();
                        var lastname =  $("#registerlastname").val();
                        ref.set({
                            capacity: "100",
                            firstname: firstname,
                            lastname: lastname
                        }).then(function() {
                            console.log("User profile registration complete.");
                        	$("#registerbasic").addClass("disabled");
                        	$("#registerservices").addClass("enabled");
                        });
                    });
            } else {
                $("#subtext").text("Passwords do not match.");
                $("#subtext").css("color", "red");
            }
        } else {
            $("#subtext").text("Emails do not match.");
            $("#subtext").css("color", "red");
        }
    } else {
        $("#subtext").text("All fields are required.");
        $("#subtext").css("color", "red");
    }
} else {
	alert("Oops, we couldn't verify your identity. Please try again.");
}
});

$(document).on("click", "#confirmservicesbtn", function() {
    var netflix = "";
    var hulu = "";
    var amazon = "";
    var amazonpurchase = "";
    var crunchyroll = "";
    if ($("#netflixtoggle").is(":checked")) {
        netflix = "Yes";
    } else {
        netflix = "No";
    }
    if ($("#hulutoggle").is(":checked")) {
        hulu = "Paid";
    } else {
        hulu = "Free";
    }
    if ($("#amazontoggle").is(":checked")) {
        amazon = "Paid";
    } else {
        amazon = "Free";
    }
    if ($("#amazonpurchasetoggle").is(":checked")) {
        amazonpurchase = "Yes";
    } else {
        amazonpurchase = "No";
    }
    if ($("#crunchyrolltoggle").is(":checked")) {
        crunchyroll = "Paid";
    } else {
        crunchyroll = "Free";
    }

    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    var ref = database.ref("/Users/" + userId + "/Services/");
    ref.set({
        netflix: netflix,
        hulu: hulu,
        amazon: amazon,
        amazon_purchase: amazonpurchase,
        crunchyroll: crunchyroll
    }).then(function() {
        window.location.replace("https://www.theverapp.com/myaccount.html");
    });
});
