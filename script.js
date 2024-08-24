function moverParaDireita() {
    const listaEsquerda = document.getElementById('idfield');
    const listaDireita = document.getElementById('listaDireita');

    var selectedOpts = $("#idField option:selected");
    console.log(selectedOpts);

    // Percorre todas as opções selecionadas na lista da esquerda
    for (let iop = 0; iop < listaEsquerda.selectedOptions; iop++) {
        if (listaEsquerda.options[iop].selected) {

            console.log(listaEsquerda[iop].selectedOptions);
            // Cria uma nova opção na lista da direita com o mesmo valor e texto
            const novaOpcao = document.createElement('option');
            novaOpcao.value = listaEsquerda[iop].value;
            novaOpcao.text = listaEsquerda[iop].text;
            listaDireita.add(novaOpcao);

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