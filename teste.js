

// Função para iniciar o jogo
function iniciarJogo() {
    const palavraEscolhida = escolherPalavraAleatoria(listaPalavras);
    const estadoInicial = criarEstadoInicial(palavraEscolhida);

    atualizarInterface(estadoInicial);
    configurarEventos(estadoInicial);
}

// Função pura: escolhe uma palavra aleatória da lista
const escolherPalavraAleatoria = (lista) => 
    lista[Math.floor(Math.random() * lista.length)];

// Função pura: cria o estado inicial do jogo
const criarEstadoInicial = (palavra) => ({
    palavra,
    exibicaoPalavra: Array(palavra.length).fill('_'),
    letrasChutadas: [],
    tentativasRestantes: 7,
    numeroErros: 0,
});

// Função que atualiza a interface do jogo
function atualizarInterface(estado) {
    const { exibicaoPalavra, letrasChutadas, numeroErros } = estado;

    document.getElementById("exibicao-palavra").innerText = exibicaoPalavra.join(' ');
    document.getElementById("letras-chutadas").innerText = letrasChutadas.join(', ');
    document.getElementById("imagem").src = `imagens/imagem${numeroErros}.png`;

    document.getElementById('mensagem').innerText = '';
    document.getElementById('botao-reiniciar').style.display = 'none';
    document.getElementById('entrada-letra').disabled = false;
}

// Função que configura os eventos (funções puras)
function configurarEventos(estado) {
    document.getElementById('entrada-letra').addEventListener('input', (evento) => {
        const novaLetra = evento.target.value.toLowerCase();
        const novoEstado = processarLetra(estado, novaLetra);
        atualizarInterface(novoEstado);
        verificarFimDeJogo(novoEstado);
    });

    document.getElementById('botao-reiniciar').addEventListener('click', iniciarJogo);
}

// Função pura: processa a letra inserida e retorna um novo estado do jogo
const processarLetra = (estado, letra) => {
    if (!letra.match(/[a-zà-ùç]/i) || estado.letrasChutadas.includes(letra)) {
        alert('Letra inválida ou já utilizada.');
        return estado;
    }

    const letrasChutadas = [...estado.letrasChutadas, letra];

    if (estado.palavra.includes(letra)) {
        const exibicaoPalavra = estado.exibicaoPalavra.map((char, i) =>
            estado.palavra[i] === letra ? letra : char
        );
        return { ...estado, exibicaoPalavra, letrasChutadas };
    } else {
        return {
            ...estado,
            letrasChutadas,
            tentativasRestantes: estado.tentativasRestantes - 1,
            numeroErros: estado.numeroErros + 1,
        };
    }
};

// Função pura: verifica se o jogo terminou e exibe a mensagem correspondente
const verificarFimDeJogo = (estado) => {
    if (estado.tentativasRestantes === 0) {
        encerrarJogo('VOCÊ MORREU!');
    } else if (!estado.exibicaoPalavra.includes('_')) {
        encerrarJogo('Parabéns! Você venceu!');
    }
};

// Função que encerra o jogo e atualiza a interface
function encerrarJogo(mensagem) {
    document.getElementById('mensagem').innerText = mensagem;
    document.getElementById('mensagem').style.display = 'block';
    document.getElementById('botao-reiniciar').style.display = 'block';
    document.getElementById('entrada-letra').disabled = true;
}

// Inicializar o jogo quando a janela for carregada
window.addEventListener('load', iniciarJogo);
