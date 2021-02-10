'use strict';
angular.module('ver.subscription', ['ngRoute', 'firebase'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/subscription', {
        templateUrl: 'subscription.html',
        controller: 'SubscriptionCtrl'
    });
}]);
Stripe.setPublishableKey('<STRIPE_KEY>');
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
            $("#usercapacity").text("Current DVD Collection Capacity: " + snapshot.val().capacity);
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
var app = angular.module('ver', []);
app.controller('verCtrl', ['$window', '$scope',
function ($window, $scope) {
    $scope.$on("$includeContentLoaded", function() {
    	// iPad and iPod detection
    	var isiPad = function(){
    		return (navigator.platform.indexOf("iPad") != -1);
    	};

    	var isiPhone = function(){
    	    return (
    			(navigator.platform.indexOf("iPhone") != -1) ||
    			(navigator.platform.indexOf("iPod") != -1)
    	    );
    	};

    	// Main Menu Superfish
    	var mainMenu = function() {
    		$('#fh5co-primary-menu').superfish({
    			delay: 0,
    			animation: {
    				opacity: 'show'
    			},
    			speed: 'fast',
    			cssArrows: true,
    			disableHI: true
    		});

    	};

    	// Parallax
    	var parallax = function() {
    		$(window).stellar();
    	};


    	// Offcanvas and cloning of the main menu
    	var offcanvas = function() {

    		var $clone = $(document).find('#fh5co-menu-wrap').clone();
    		$clone.attr({
    			'id' : 'offcanvas-menu'
    		});
    		$clone.find('> ul').attr({
    			'class' : '',
    			'id' : ''
    		});

    		$(document).find('#fh5co-page').prepend($clone);

    		// click the burger
    		$(document).on('click', function(){
    			if ( $('body').hasClass('fh5co-offcanvas') ) {
    				$('body').removeClass('fh5co-offcanvas');
    			} else {
    				$('body').addClass('fh5co-offcanvas');
    			}
    			// $('body').toggleClass('fh5co-offcanvas');

    		});

    		$(document).find('#offcanvas-menu').css('height', $(window).height());

    		$(window).resize(function(){
    			var w = $(window);


    			$(document).find('#offcanvas-menu').css('height', w.height());

    			if ( w.width() > 769 ) {
    				if ( $('body').hasClass('fh5co-offcanvas') ) {
    					$('body').removeClass('fh5co-offcanvas');
    				}
    			}

    		});

    	}



    	// Click outside of the Mobile Menu
    	var mobileMenuOutsideClick = function() {
    		$(document).click(function (e) {
    	    var container = $("#offcanvas-menu, .js-fh5co-nav-toggle");
    	    if (!container.is(e.target) && container.has(e.target).length === 0) {
    	      if ( $('body').hasClass('fh5co-offcanvas') ) {
    				$('body').removeClass('fh5co-offcanvas');
    			}
    	    }
    		});
    	};


    	// Animations

    	var contentWayPoint = function() {
    		var i = 0;
    		$('.animate-box').waypoint( function( direction ) {

    			if( direction === 'down' && !$(this.element).hasClass('animated') ) {

    				i++;

    				$(this.element).addClass('item-animate');
    				setTimeout(function(){

    					$('body .animate-box.item-animate').each(function(k){
    						var el = $(this);
    						setTimeout( function () {
    							el.addClass('fadeInUp animated');
    							el.removeClass('item-animate');
    						},  k * 200, 'easeInOutExpo' );
    					});

    				}, 100);

    			}

    		} , { offset: '85%' } );
    	};

    	// Document on load.
    	$(function(){
    		mainMenu();
    		parallax();
    		offcanvas();
    		mobileMenuOutsideClick();
    		contentWayPoint();
    	});
	});
}
]);

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
