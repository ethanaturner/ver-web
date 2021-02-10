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
            let fullname = snapshot.val().firstname + " " + snapshot.val().lastname;
            $('.sf-menu #loginlink').text(fullname);
            $('#offcanvas-menu #loginlink').text(fullname);
            $("#userfullname").text(fullname);
            $("#useremail").text(user.email);
            $("#usercapacity").text("DVD Collection Capacity: " + snapshot.val().capacity);
            $("#firstname").val(snapshot.val().firstname);
            $("#lastname").val(snapshot.val().lastname);
            $("#changeemail").val(user.email);
            $("#confirmemail").val(user.email);
        });
        if ($('#nouserdialog').dialog() != null) {
            $("#nouserdialog").removeClass("visible");
            $("#nouserdialog" ).dialog("close");
        }
        $("#fh5co-page #overlay").addClass("disabled");
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
        $("#userfullname").text("Loading profile . . . ");
        $("#useremail").text("Loading email . . . ");
        $("#usercapacity").text("Loading capacity . . . ");
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
$(document).on("click",'#editprofilebtn',function(){
        $("#updateprofiledialog").dialog({
            resizable: false,
            height: "auto",
            width: 500,
            autoOpen: true,
            buttons: [{
                    id:"cancel",
                    text: "Nevermind",
                    click: function() {
                        $(this).dialog("close");
                    }
                }, {
                    id:"changepasswordbtn",
                    text: "Change Password",
                    click: function() {
                        $("#updatepassworddialog").dialog({
                            resizable: false,
                            height: "auto",
                            width: 500,
                            autoOpen: true,
                            buttons: [{
                                id:"nevermind",
                                text: "Nevermind",
                                click: function() {
                                    $(this).dialog("close");
                                }
                            }, {
                                id:"savepassword",
                                text: "Save (you will be logged out)",
                                click: function() {
                                    if ($("#newpassword").val() == $("#confirmnewpassword").val()) {
                                        $("#newpasswordlabel").text("Changing password . . . ");
                                        firebase.auth().currentUser.updatePassword($("#confirmnewpassword").val()).then(function() {
                                              firebase.auth().signOut().then(function() {
                                                    window.location.replace("https://www.theverapp.com");
                                                }, function(error) {
                                                 $("#newpasswordlabel").text("An error occured: " + error.message);
                                                });
                                            }, function(error) {
                                                $("#newpasswordlabel").text("An error occured: " + error.message);
                                            });
                                    } else {
                                        $("#newpasswordlabel").text("Passwords do not match.");
                                    }
                                }
                            }]
                        });
                    }
                }, {
                    id: "save",
                    text: "Save (you may need to refresh)",
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
});

$(document).on("click", "#editcapacitybtn", function() {
    $("#comingsoondialog").dialog({
        resizable: false,
            height: "auto",
            width: 500,
            autoOpen: true,
            buttons: [{
                id: "okay",
                text: "Okay, cool.",
                click: function() {
                    $(this).dialog("close");
                }
            }]
    }).dialog("open");
});
