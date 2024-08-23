define(['postmonger'], function(postmonger) {
    var connection = new postmonger.connections.dynamic(
        /* Configuration */
    );

    // Variáveis globais para armazenar os dados
    var dataExtensions = [];
    var steps = [
        // initialize to the same value as what's set in config.json for consistency
        { label: "Step 1", key: "step1" },
        ];
      var currentStep = steps[0].key;

    connection.on('init', function(initRequest) {
        // Carregar as Data Extensions disponíveis
        connection.trigger('request', {
            request: 'retrieve',
            payload: {
                method: 'GET',
                url: '/data/v1/customobjects',
                contentType: 'application/json'
            }
        });
    });

    connection.on('retrieveResponse', function(data) {
        dataExtensions = data.response.payload;
        // Preencher o select de Data Extensions
        var dataExtensionSelect = document.getElementById('dataExtensionSelect');
        dataExtensions.forEach(function(dataExtension) {
            var option = document.createElement('option');
            option.value = dataExtension.name;
            option.text = dataExtension.name;
            dataExtensionSelect.appendChild(option);
        });

        // Atualizar a lista de atributos quando uma nova Data Extension for selecionada
        dataExtensionSelect.addEventListener('change', function() {
            var selectedDataExtension = this.value;
            // Chamar a API para obter os atributos da Data Extension selecionada
            connection.trigger('request', {
                request: 'retrieve',
                payload: {
                    method: 'GET',
                    url: '/data/v1/customobjects/' + encodeURIComponent(selectedDataExtension) + '/columns',
                    contentType: 'application/json'
                }
            });
        });
    });

    connection.on('retrieveResponse', function(data) {
        // Atualizar a lista de atributos
        attributes = data.response.payload;
        var attributeSelect = document.getElementById('attributeSelect');
        attributeSelect.innerHTML = ''; // Limpar a lista antes de preencher
        attributes.forEach(function(attribute) {
            var option = document.createElement('option');
            option.value = attribute;
            option.text = attribute;
            attributeSelect.appendChild(option);
        });
    });
});