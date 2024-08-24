define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};    
    var steps = [
        // initialize to the same value as what's set in config.json for consistency
        { label: "Definir Atributos", key: "step1" },
        { label: "Definir Endpoint", key: "step2" },  
        { label: "Salvar Definições", key: "step3" },
        ];
      var currentStep = steps[0].key;
    
      $(window).ready(onRender);

    connection.on("initActivity", initialize); 
    connection.on("requestedTokens", onGetTokens);
    connection.on("requestedEndpoints", onGetEndpoints);  
    connection.on("clickedNext", onClickedNext);
    connection.on("clickedBack", onClickedBack); 


    
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger("ready");    
        connection.trigger("requestTokens");
        connection.trigger("requestEndpoints");

        connection.on("requestedTriggerEventDefinition", function(
            eventDefinitionModel
        ) {
            if (eventDefinitionModel) {
                definition = eventDefinitionModel;
                eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            }
        });

        if (payload && payload.eventDefinition) {
            const eventDefinition = payload.eventDefinition;
            var fieldname;

            const mensagemElement = document.getElementById('mensagem');
            const mensagem = "Hello, world!";
            mensagemElement.textContent = mensagem;

            var dataextension = "xxx";
            $("#dataextension").html(dataextension);
            var teste = payload;
        
            // Itera sobre os campos da eventDefinition
            for (const field in eventDefinition.fields) {
              if (eventDefinition.fields.hasOwnProperty(field)) {
                const fieldValue = eventDefinition.fields[field].value;
                fieldname = field, fieldValue;
                console.log(field, fieldValue); // Exemplo de como usar o valor do campo
        
                // Aqui você pode adicionar sua lógica para processar os campos
                // Por exemplo, armazenar os valores em um objeto, enviar para um servidor, etc.
              }
            }
          }
    
        // Disable the next button if a value isn't selected
        $("#select1").change(function () {
          var message = getMessage();
          connection.trigger("updateButton", {
            button: "Próximo",
            enabled: Boolean(message),
          });
    
          $("#message").html(message);
        });  
  
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

      function onGetTokens(tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        // console.log(tokens);
      }
    
      function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        // console.log(endpoints);
      }
    
      function onClickedNext() {
        if (
          (currentStep.key === "step2" && steps[2].active === false) ||
          currentStep.key === "step3"
        ) {
          save();
        } else {
          connection.trigger("nextStep");
        }
      }
    
      function onClickedBack() {
        connection.trigger("prevStep");
      }

      function onGotoStep(step) {
        showStep(step);
        connection.trigger("ready");
      }
    
      function showStep(step, stepIndex) {
        if (stepIndex && !step) {
          step = steps[stepIndex - 1];
        }
    
        currentStep = step;
    
        $(".step").hide();
    
        switch (currentStep.key) {
          case "step1":
            $("#step1").show();
            connection.trigger("updateButton", {
              button: "next",
              enabled: Boolean(getMessage()),
            });
            connection.trigger("updateButton", {
              button: "back",
              visible: false,
            });
            break;
          case "step2":
            $("#step2").show();
            connection.trigger("updateButton", {
              button: "back",
              visible: true,
            });
            connection.trigger("updateButton", {
              button: "next",
              text: "next",
              visible: true,
            });
            break;
          case "step3":
            $("#step3").show();
            connection.trigger("updateButton", {
              button: "back",
              visible: true,
            });
            connection.trigger("updateButton", {
                button: "next",
                text: "done",
                visible: true,
              });
            break;
        }
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
