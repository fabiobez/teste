define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();

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
                first_name: "{{Event." + eventDefinitionKey + '."first_name"}}',
                last_name: "{{Event." + eventDefinitionKey + '."last_name"}}',
                company: "{{Event." + eventDefinitionKey + '."company"}}',
                email: "{{Event." + eventDefinitionKey + '."email"}}',
                address_1: "{{Event." + eventDefinitionKey + '."address_1"}}',
                city: "{{Event." + eventDefinitionKey + '."city"}}',
                state: "{{Event." + eventDefinitionKey + '."state"}}',
                postal_code: "{{Event." + eventDefinitionKey + '."postal_code"}}',
                identifier: "{{Event." + eventDefinitionKey + '."identifier"}}'
            }
        }];
        payload["metaData"].isConfigured = true;
        connection.trigger("updateActivity", payload);
    }

});
