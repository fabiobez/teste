define(['postmonger'], function(postmonger) {
    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;

    $(window).ready(onRender);

    connection.on("initActivity", initialize);

});
