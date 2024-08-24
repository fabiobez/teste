define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var dataextension;

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
                nome: "{{Event." + eventDefinitionKey + '."Nome"}}',
                email: "{{Event." + eventDefinitionKey + '."Email"}}',
                telefone: "{{Event." + eventDefinitionKey + '."Telefone"}}'                
            }
        }];
        payload["metaData"].isConfigured = true;
        connection.trigger("updateActivity", payload);
    }

});
