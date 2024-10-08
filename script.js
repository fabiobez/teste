function moverParaDireita() {
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
}

function moverParaEsquerda() {
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

}