define(['postmonger'], function(postmonger) {
    var connection = new postmonger.connections.dynamic(
        /* Configuration */
    );

    const dataExtensionNameInput = document.getElementById('dataExtensionName');
    const loadFieldsButton = document.getElementById('carregarCampos');
    const fieldsSelect = document.getElementById('fields');

    loadFieldsButton.addEventListener('click', () => {
        const dataExtensionName = dataExtensionNameInput.value;

        // Chamada ao AMPScript para obter os campos
        connection.trigger('request', {
            request: 'getDataExtensionFields',
            payload: {
                dataExtensionName: dataExtensionName
            }
        });
    });

    connection.on('init', function(initRequest) {
        // ... (inicialização da activity)
    });

    connection.on('requestedPreview', function(data) {
        // ... (pré-visualização da activity)
    });

    connection.on('getDataExtensionFields', function(response) {
        const fields = response.payload.fields;
        fields.forEach(field => {
            const option = document.createElement('option');
            option.value = field;
            option.text = field;
            fieldsSelect.appendChild(option);
        });
    });

    // ... (restante do código)
});
