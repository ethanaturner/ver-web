$(document).on("click", "#gosearch", function() {
    if ($("#searchfield").val()) {
        var query = $("#searchfield").val();
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
        $("#headersubtext").text("Oops, please enter a title first.");
    }
});