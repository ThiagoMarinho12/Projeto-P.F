// LISTA DE PALAVRAS PARA O JOGO
const listaPalavras = ["big-data"];

// Função para inicializar o estado do jogo
const inicializarEstado = () => {
    const palavraEscolhida = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];
    console.log(palavraEscolhida);

    return {
        palavraEscolhida,
        exibicaoPalavra: Array(palavraEscolhida.length).fill('_'),
        letrasChutadas: [],
        tentativasRestantes: 7,
        numeroErros: 0,
    };
};

// Função para atualizar a exibição na interface
const atualizarExibicao = (estado) => {
    console.log(estado);

    document.getElementById("exibicao-palavra").innerText = estado.exibicaoPalavra.join(' ');
    document.getElementById("letras-chutadas").innerText = `${estado.letrasChutadas.join(',')}`;
    document.getElementById("imagem").src = `imagens/imagem${estado.numeroErros}.png`;
    document.getElementById("mensagem").style.display = 'none';

    if (estado.tentativasRestantes === 0) {
        encerrarJogo('VOCÊ MORREU!');
    } else if (!estado.exibicaoPalavra.includes('_')) {
        encerrarJogo('Parabéns! Você venceu!');
    }
};

// Função para processar um chute e retornar um novo estado
const chutarLetra = (estado, letra) => {
    console.log(letra);

    if (estado.letrasChutadas.includes(letra)) {
        alert('Você já tentou esta letra. Tente outra.');
        return estado;
    }

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
            numeroErros: estado.numeroErros + 1 
          };
};

// Função para encerrar o jogo
const encerrarJogo = (mensagem) => {
    console.log(mensagem);

    document.getElementById('entrada-letra').disabled = true;
    document.getElementById('mensagem').innerText = mensagem;
    document.getElementById('mensagem').style.display = 'block';
    document.getElementById('botao-reiniciar').style.display = 'block';
};

// Função principal para inicializar o jogo
const iniciarJogo = () => {
    const estadoInicial = inicializarEstado();

    const processarEntrada = (estadoAtual) => (letra) => {
        const novoEstado = chutarLetra(estadoAtual, letra);
        atualizarExibicao(novoEstado);
        return novoEstado;
    };

    const botaoChutar = document.getElementById('btn-chutar');
    const entradaLetra = document.getElementById('entrada-letra');
    const botaoReiniciar = document.getElementById('botao-reiniciar');

    document.getElementById('botao-reiniciar').style.display = 'none';
    document.getElementById('entrada-letra').disabled = false;

    let estadoAtual = estadoInicial; // Estado inicial do jogo

    atualizarExibicao(estadoAtual);

    // Evento de clique no botão "Chutar"
    botaoChutar.onclick = () => {
        const letra = entradaLetra.value.toLowerCase();
        if (letra.match(/[a-zà-ùç--]/i) && letra.length === 1) {
            estadoAtual = processarEntrada(estadoAtual)(letra);
            entradaLetra.value = ''; // Limpa a entrada
        } else {
            alert('Por favor, insira uma letra válida.');
        }
    };

    // Evento de clique no botão "Reiniciar"
    botaoReiniciar.onclick = () => iniciarJogo();
};

// Inicia o jogo ao carregar a página
window.onload = iniciarJogo;
