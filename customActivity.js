define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};
    var dataextension;
    var steps = [
        // initialize to the same value as what's set in config.json for consistency
        { label: "Step 1", key: "step1" },
        { label: "Step 2", key: "step2" },  
        ];
      var currentStep = steps[0].key;
    
      $(window).ready(onRender);

    connection.on("initActivity", initialize);  

    connection.on("requestedTriggerEventDefinition", function(
        eventDefinitionModel
    ) {
        if (eventDefinitionModel) {
            definition = eventDefinitionModel;
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        }
    });
    
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger("ready");    
        connection.trigger("requestTokens");
        connection.trigger("requestEndpoints");    
        
        
      }
  

      function initialize(data) {
        if (data) {
          payload = data;
        }
    
        var message;
        var hasInArguments = Boolean(
          payload["arguments"] &&
            payload["arguments"].execute &&
            payload["arguments"].execute.inArguments &&
            payload["arguments"].execute.inArguments.length > 0
        );
    
        var inArguments = hasInArguments
          ? payload["arguments"].execute.inArguments
          : {};
    
        $.each(inArguments, function (index, inArgument) {
          $.each(inArgument, function (key, val) {
            if (key === "message") {
              message = val;
            }
          });
        });    
        
      }

    function save() {
        var campaign_id = $("#campaign_id").val();
        payload["arguments"].execute.inArguments = [{
            campaign_id: campaign_id,
            recipient: {
                nome: "{{Event." + eventDefinitionKey + '."Nome"}}',
                email: "{{Event." + eventDefinitionKey + '."Email"}}',
                telefone: "{{Event." + eventDefinitionKey + '."Telefone"}}'                
            }
        }];
        payload["metaData"].isConfigured = true;
        connection.trigger("updateActivity", payload);
    }

});
