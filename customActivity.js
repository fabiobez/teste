define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;

    $(window).ready(onRender);
  
    connection.on("initActivity", initialize);
    connection.on("requestedTokens", onGetTokens);
    connection.on("requestedEndpoints", onGetEndpoints);
  
    connection.on("clickedNext", onClickedNext);
    connection.on("clickedBack", onClickedBack);
    connection.on("gotoStep", onGotoStep);
  
    function onRender() {
      // JB will respond the first time 'ready' is called with 'initActivity'
      connection.trigger("ready");
  
      connection.trigger("requestTokens");
      connection.trigger("requestEndpoints");
  
      // Disable the next button if a value isn't selected
      $("#select1").change(function () {
        var message = getMessage();
        connection.trigger("updateButton", {
          button: "next",
          enabled: Boolean(message),
        });
  
        $("#message").html(message);
      });  

    }


    function initialize(data) {
        message = "Hello world";
    }


});
