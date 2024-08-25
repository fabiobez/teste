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

    // If there is no message selected, disable the next button
    if (!message) {
      showStep(null, 1);
      connection.trigger("updateButton", { button: "next", enabled: false });
      // If there is a message, skip to the summary step
    } else {
      $("#listaEsquerda")
        .find("option[value=" + message + "]")
        .attr("selected", "selected");
      $("#message").html(message);
      showStep(null, 3);
    }

    connection.trigger('requestSchema');
    connection.on('requestedSchema', function (data) {
      const schema = data['schema'];

      for (var i = 0, l = schema.length; i < l; i++) {
        let attr = schema[i].key;
        // populate select dropdown 
        let option = $('<option></option>')
          .attr('id', schema[i].key)
          .text(schema[i].name);

        $('#listaEsquerda').append(option);
      }

    });

  }

  $("#moveright").on("click", function () {
    const listaEsquerda = document.getElementById('listaEsquerda');
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
    // Habilita/Desabilita botão next
    var message = getMessage();
    console.log('MESSAGE:' + message);
    connection.trigger("updateButton", {
      button: "next",
      enabled: Boolean(message),
    });

    $("#message").html(message);


  });

  $("#moveleft").on("click", function () {
    const listaEsquerda = document.getElementById('listaEsquerda');
    const listaDireita = document.getElementById('listaDireita');

    // Percorre todas as opções selecionadas na lista da esquerda
    for (let i = 0; i < listaDireita.options.length; i++) {
      if (listaDireita.options[i].selected) {
        // Cria uma nova opção na lista da direita com o mesmo valor e texto
        const novaOpcao = document.createElement('option');
        novaOpcao.value = listaDireita.options[i].value;
        novaOpcao.text = listaDireita.options[i].text;
        listaEsquerda.add(novaOpcao);

        // Remove a opção da lista da esquerda
        listaDireita.remove(i);
        // Ajusta o índice para não pular elementos após a remoção
        i--;
      }
    }

    // Habilita/Desabilita botão next
    var message = getMessage();
    console.log('MESSAGE:' + message);
    connection.trigger("updateButton", {
      button: "next",
      enabled: Boolean(message),
    });

    $("#message").html(message);

  });


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

  function atualizarDivMensagem() {
    const listaDireita = document.getElementById('listaDireita');
    const divMensagem = document.getElementById('mensagem'); // Adiciona um elemento div com id "mensagem"
    let mensagem = "";

    for (let i = 0; i < listaDireita.options.length; i++) {
      if (listaDireita.options[i].selected) {
        mensagem += listaDireita.options[i].text + ", ";
      }
    }

    divMensagem.textContent = mensagem.slice(0, -2); // Remove a última vírgula e espaço
  }

  function getMessage() {
    return $("#listaDireita").find('option').length > 0;
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
