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
    connection.on("clickedNext", onClickedNext);
    connection.on("clickedBack", onClickedBack);
    connection.on("gotoStep", onGotoStep); 
    
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
      connection.trigger("ready");  
      
      // Disable the next button if a value isn't selected
      $("#listadireita").change(function () {
        console.log('RETORNO' + getMessage());
        if(getMessage() > 0){
        connection.trigger("updateButton", {
          button: "next",
          enabled: true,
        });
      }
        console.log(message);
        $("#message").html(message);
      });
  
      
      // If inactive, wizard hides it and skips over it during navigation
      $("#toggleLastStep").click(function () {
        lastStepEnabled = !lastStepEnabled; // toggle status
        steps[3].active = !steps[3].active; // toggle active
  
        connection.trigger("updateSteps", steps);
      });     
    }
    

    function initialize(data) {
        $('#step1').show();
        if (data) {
            payload = data;
        }
    
        connection.trigger('requestSchema');
        connection.on('requestedSchema', function(data) {
            const schema = data['schema'];
            console.log(schema);
            var x;
                
            for (var i = 0, l = schema.length; i < l; i++) {
                let attr = schema[i].key;                
                // populate select dropdown 
                let option = $('<option></option>')
                    .attr('id', schema[i].key)
                    .text(schema[i].name);
    
                $('#listaEsquerda').append(option);
    
            }
            var message;
            if($("#listaDireita").find('option:selected').length > 0){
              message = "SIM";
              connection.trigger("updateButton", { button: "next", enabled: false });
            } else {
              message = "NÃO";
            }

        });
    } 
    
    function onClickedNext() {
        var listaEsquerda = $('#listaEsquerda').find('option:selected').html();
        payload['arguments'].execute.inArguments.push({
          listaEsquerda: listaEsquerda
        })
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);

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

    function getMessage() {      
      return $("#listaDireita").find('option:selected').length;
    }
    
    function save() {

        /* the following code is optional, but provides an example of 
           how to append additional key/value pair(s) as inArguments, 
           for example, a form field value from the custom activity html
      
        var fieldVal = document.getElementById('your-field-id').value;
        var keyObj = { InsertKeyName: fieldVal };
        payload['arguments'].execute.inArguments.push(keyObj);      
        */
      
        payload.metaData.isConfigured = true;
        connection.trigger('updateActivity', payload);
      
      }
    
});
