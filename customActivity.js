define(['postmonger'], function(postmonger) {
  var connection = new postmonger.connections.dynamic(
      /* Configurations */
  );

  // Quando o botão "Enviar" é clicado, coletamos os dados da UI e enviamos para o AMPScript
  connection.on('clickedNext', function(data) {
      var nome = document.getElementById('nome').value;
      var email = document.getElementById('email').value;

      connection.trigger('request', {
          request: 'save',
          payload: {
              nome: nome,
              email: email
          }
      });
  });
});
