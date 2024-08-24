define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload['arguments'].execute.inArguments = [{
        "subscriberKey": "{{Contact.Key}}",
        "surveyID": surveyID,
        "de":de,
        "firstName":"{{Event.AutomationAud-myInstance.firstName}}",
        "lastName":"{{Event.AutomationAud-myInstance.lastName}}",
        "accountID":"{{Event.AutomationAud-myInstance.accountID}}"
      }];
    var lastStepEnabled = false;

    $(window).ready(onRender);
  
    connection.on("initActivity", initialize);    
  
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
        let message = document.getElementById("message");
        message.textContent = "Hello world";
    }

    connection.on("requestedTriggerEventDefinition", function(
        eventDefinitionModel
    ) {
        if (eventDefinitionModel) {
            definition = eventDefinitionModel;
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        }
    });
    
    function save() {
        var campaign_id = $("#campaign_id").val();
        payload["arguments"].execute.inArguments = [{
            campaign_id: campaign_id,
            recipient: {
                name: "{{Event." + eventDefinitionKey + '."Nome"}}',
                email: "{{Event." + eventDefinitionKey + '."Email"}}',
                phone: "{{Event." + eventDefinitionKey + '."Telefone"}}'
            }
        }];
        payload["metaData"].isConfigured = true;
        connection.trigger("updateActivity", payload);
    }


});
