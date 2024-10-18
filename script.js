const listaPalavras = ["big-data", "javascript", "python", "informatica", "node","algoritmo","virus"];

// Função pura para inicializar o estado do jogo
const inicializarEstado = () => {
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
const processarChute = (estado, letra) => {
    if (estado.letrasChutadas.includes(letra)) return estado; // Sem mudança se a letra já foi chutada

    const letrasChutadasAtualizadas = [...estado.letrasChutadas, letra];
    const exibicaoAtualizada = estado.exibicaoPalavra.map((char, index) =>
        estado.palavraEscolhida[index] === letra ? letra : char
    );

    return estado.palavraEscolhida.includes(letra)
        ? { ...estado, exibicaoPalavra: exibicaoAtualizada, letrasChutadas: letrasChutadasAtualizadas }
        : {
            ...estado,
            letrasChutadas: letrasChutadasAtualizadas,
            tentativasRestantes: estado.tentativasRestantes - 1,
            numeroErros: estado.numeroErros + 1,
        };
};

// Função pura para verificar se o jogo terminou
const verificarFimDeJogo = (estado) => {
    if (estado.tentativasRestantes === 0) return 'VOCÊ MORREU!';
    if (!estado.exibicaoPalavra.includes('_')) return 'Parabéns! Você venceu!';
    return null;
};

// Função de efeito colateral: Atualiza o DOM
const atualizarExibicao = (estado) => {
    document.getElementById("exibicao-palavra").innerText = estado.exibicaoPalavra.join(' ');
    document.getElementById("letras-chutadas").innerText = estado.letrasChutadas.join(', ');
    document.getElementById("imagem").src = `imagens/imagem${estado.numeroErros}.png`;

    const mensagem = verificarFimDeJogo(estado);
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
    const estadoInicial = inicializarEstado();
    configurarEventos(estadoInicial);
    atualizarExibicao(estadoInicial);
};

// Função pura para processar entrada e gerar um novo estado
const criarProcessadorDeEntrada = (estadoAtual, letra) => {
    const novoEstado = processarChute(estadoAtual, letra);
    atualizarExibicao(novoEstado); // Exibir o novo estado
    return novoEstado; // Retornar o novo estado
};

// Configura eventos de clique e entrada
const configurarEventos = (estadoInicial) => {
    const botaoChutar = document.getElementById('btn-chutar');
    const entradaLetra = document.getElementById('entrada-letra');
    const botaoReiniciar = document.getElementById('botao-reiniciar');

    botaoReiniciar.style.display = 'none';
    entradaLetra.disabled = false;

    let estadoAtual = estadoInicial; // Estado local gerenciado funcionalmente

    botaoChutar.onclick = () => {
        const letra = entradaLetra.value.toLowerCase();
        if (letra.match(/[a-zà-ùç-]/i) && letra.length === 1) {
            estadoAtual = criarProcessadorDeEntrada(estadoAtual, letra); // Atualiza o estado localmente
            entradaLetra.value = ''; // Limpa a entrada
        } else {
            alert('Por favor, insira uma letra válida.');
        }
    };

    botaoReiniciar.onclick = iniciarJogo;
};

// Inicializa o jogo quando a página é carregada
window.onload = iniciarJogo;
