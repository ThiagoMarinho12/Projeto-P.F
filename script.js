const listaPalavras = ["big-data", "javascript", "python", "informatica", "node","algoritmo","virus"];

// Função pura para inicializar o estado
const inicializarGame = () => {
    const palavraEscolhida = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];
    return {
        palavraEscolhida,
        exibicaoPalavra: Array(palavraEscolhida.length).fill('_'),
        letrasChutadas: [],
        tentativasRestantes: 7,
        numeroErros: 0,
    };
};

// Função pura para processar o chute e retornar um novo estado
const processarChute = (status, letra) => {
    if (status.letrasChutadas.includes(letra)) return status; // Sem mudança se a letra já foi chutada

    const letrasChutadasAtualizadas = [...status.letrasChutadas, letra];
    const exibicaoAtualizada = status.exibicaoPalavra.map((char, index) =>
        status.palavraEscolhida[index] === letra ? letra : char
    );

    return status.palavraEscolhida.includes(letra)
        ? { ...status, exibicaoPalavra: exibicaoAtualizada, letrasChutadas: letrasChutadasAtualizadas }
        : {
            ...status,
            letrasChutadas: letrasChutadasAtualizadas,
            tentativasRestantes: status.tentativasRestantes - 1,
            numeroErros: status.numeroErros + 1,
        };
};

// Função pura para verificar se o jogo terminou
const verificarFimDeJogo = (status) => {
    if (status.tentativasRestantes === 0) return 'VOCÊ MORREU!';
    if (!status.exibicaoPalavra.includes('_')) return 'Parabéns! Você venceu!';
    return null;
};

// Função de efeito colateral: Atualiza o DOM
const atualizarExibicao = (status) => {
    document.getElementById("exibicao-palavra").innerText = status.exibicaoPalavra.join(' ');
    document.getElementById("letras-chutadas").innerText = status.letrasChutadas.join(', ');
    document.getElementById("imagem").src = `imagens/imagem${status.numeroErros}.png`;

    const mensagem = verificarFimDeJogo(status);
    if (mensagem) encerrarJogo(mensagem);
};

// Função de efeito colateral: Encerrar o jogo e manipular o DOM
const encerrarJogo = (mensagem) => {
    document.getElementById('entrada-letra').disabled = true;
    document.getElementById('mensagem').innerText = mensagem;
    document.getElementById('mensagem').style.display = 'block';
    document.getElementById('botao-reiniciar').style.display = 'block';
};

// Função principal para inicializar o jogo e gerenciar o fluxo de estado
const iniciarJogo = () => {
    const statusInicial = inicializarGame();
    configurarEventos(statusInicial);
    atualizarExibicao(statusInicial);
};

// Função pura para processar entrada e gerar um novo estado
const criarProcessadorDeEntrada = (statusAtual, letra) => {
    const novoStatus = processarChute(statusAtual, letra);
    atualizarExibicao(novoStatus); // Exibir o novo estado
    return novoStatus; // Retornar o novo estado
};

// Configura eventos de clique e entrada
const configurarEventos = (statusInicial) => {
    const botaoChutar = document.getElementById('btn-chutar');
    const entradaLetra = document.getElementById('entrada-letra');
    const botaoReiniciar = document.getElementById('botao-reiniciar');

    botaoReiniciar.style.display = 'none';
    entradaLetra.disabled = false;

    let statusAtual = statusInicial; // Estado local gerenciado funcionalmente

    botaoChutar.onclick = () => {
        const letra = entradaLetra.value.toLowerCase();
        if (letra.match(/[a-zà-ùç-]/i) && letra.length === 1) {
            statusAtual = criarProcessadorDeEntrada(statusAtual, letra); // Atualiza o estado localmente
            entradaLetra.value = ''; // Limpa a entrada
        } else {
            alert('Por favor, insira uma letra válida.');
        }
    };

    botaoReiniciar.onclick = iniciarJogo;
};

// Inicializa o jogo quando a página é carregada
window.onload = iniciarJogo;
