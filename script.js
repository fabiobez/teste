function moverParaDireita() {
    const listaEsquerda = document.getElementById('idfield');
    const listaDireita = document.getElementById('listaDireita');

    var selectedOpts = $("#idField option:selected");
    console.log(selectedOpts);

    // Percorre todas as opções selecionadas na lista da esquerda
    for (let iop = 1; iop < selectedOpts; iop++) {
        if (selectedOpts[iop]) {

            console.log(selectedOpts[iop]);
            // Cria uma nova opção na lista da direita com o mesmo valor e texto
            const novaOpcao = document.createElement('option');
            novaOpcao.value = selectedOpts[iop].value;
            novaOpcao.text = selectedOpts[iop].text;
            listaDireita.add(selectedOpts);

            // Remove a opção da lista da esquerda
            listaEsquerda.remove(iop);
            // Ajusta o índice para não pular elementos após a remoção
            iop--;
        }
    }
}

function moverParaEsquerda() {
    const listaEsquerda = document.getElementById('idfield');
    const listaDireita = document.getElementById('listaDireita');

    // Percorre todas as opções selecionadas na lista da direita
    for (let i = 0; i < listaDireita.options.length; i++) {
        if (listaDireita.options[i].selected) {
            // Cria uma nova opção na lista da esquerda com o mesmo valor e texto
            const novaOpcao = document.createElement('option');
            novaOpcao.value = listaDireita.options[i].value;
            novaOpcao.text = listaDireita.options[i].text;
            listaEsquerda.add(novaOpcao);

            // Remove a opção da lista da direita
            listaDireita.remove(i);
            // Ajusta o índice para não pular elementos após a remoção
            i--;
        }
    }

}