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
    
    function onRender() {
        connection.trigger('ready');

        $('#select1').change(function() {
            var name = $('#select1').find('option:selected').html();
            console.log('PNR Field selected : ', name);
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
    
            for (var i = 0, l = schema.length; i < l; i++) {
                let attr = schema[i].key;
    
                // populate select dropdown 
                let option = $('<option></option>')
                    .attr('id', schema[i].key)
                    .text(schema[i].name);
    
                $('#idField').append(option);
    
            }
        });
    }         


    function moverParaDireita() {
        const listaEsquerda = document.getElementById('idfield');
        const listaDireita = document.getElementById('listaDireita');
    
        // Percorre todas as opções selecionadas na lista da esquerda
        for (let i = 0; i < listaEsquerda.options.length; i++) {
            if (listaEsquerda.options[i].selected) {
                // Cria uma nova opção na lista da direita com o mesmo valor e texto
                const novaOpcao = document.createElement('option');
                novaOpcao.value = listaEsquerda.options[i].value;
                novaOpcao.text = listaEsquerda.options[i].text;
                listaDireita.add(novaOpcao);
    
                // Remove a opção da lista da esquerda
                listaEsquerda.remove(i);
                // Ajusta o índice para não pular elementos após a remoção
                i--;
            }
        }
    }
    
    function moverParaEsquerda() {
            // Lógica similar para mover da direita para a esquerda, com as operações invertidas
    }
    
    
    function onClickedNext() {

        var idField = $('#idField').find('option:selected').html();
    payload['arguments'].execute.inArguments.push({
        idField: idField
    })
    payload['metaData'].isConfigured = true;
    connection.trigger('updateActivity', payload);

        /*if (
          (currentStep.key === "step2" && steps[2].active === false) ||
          currentStep.key === "step3"
        ) {
          save();
        } else {
          connection.trigger("nextStep");
        }*/
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
