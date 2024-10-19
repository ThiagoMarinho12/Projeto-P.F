/* Lista de palavras, um array que contem diversas palavras relacionadas a computacao que serao usadas no jogo da forca(Thiago)*/

const listaPalavras = ["big-data", "javascript", "python", "informatica", "node","algoritmo","virus","html"];


/*inicializarGame: função que inicializa o estado do jogo. Ela:
seleciona uma palavra aleatoriamente da listaPalavras. (Luan)*/

const inicializarGame = () => {
    const palavraEscolhida = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];

/* A função retorna um objeto que representa o estado inicial do jogo, contendo:
palavraEscolhida: a palavra sorteada.
exibicaoPalavra: um array que inicialmente contém apenas underscores (_), representando as letras escondidas da palavra a ser descoberta.
letrasChutadas: um array vazio que irá armazenar as letras já tentadas pelo jogador.
tentativasRestantes: o número de tentativas que o jogador ainda possui (inicialmente 7).
numeroErros: contador de erros do jogador (inicialmente 0).(Thiago)*/

    return {
        palavraEscolhida,
        exibicaoPalavra: Array(palavraEscolhida.length).fill('_'),
        letrasChutadas: [],
        tentativasRestantes: 7,
        numeroErros: 0,
    };
};

/*processarChute: função que recebe o estado atual e a letra chutada, e retorna um novo estado. Ela:
verifica se a letra já foi chutada. Se sim, retorna o estado sem alterações.
Se a letra não foi chutada, ela: atualiza a lista de letras chutadas, adicionando a nova letra e cria uma nova exibição da palavra, substituindo os underscores pelas letras corretas, caso a letra chutada esteja presente.(Luan)*/

const processarChute = (status, letra) => {
    if (status.letrasChutadas.includes(letra)) return status; 

    const letrasChutadasAtualizadas = [...status.letrasChutadas, letra];
    const exibicaoAtualizada = status.exibicaoPalavra.map((char, index) =>
        status.palavraEscolhida[index] === letra ? letra : char
    );
/*Retorna um novo status:
Se a letra chutada está na palavra, o novo status inclui a nova exibição da palavra e a lista de letras chutadas atualizada.
Se não está, decrementa o número de tentativas restantes e incrementa o número de erros, mas mantém a exibição da palavra igual.(Thiago)*/
    return status.palavraEscolhida.includes(letra)
        ? { ...status, exibicaoPalavra: exibicaoAtualizada, letrasChutadas: letrasChutadasAtualizadas }
        : {
            ...status,
            letrasChutadas: letrasChutadasAtualizadas,
            tentativasRestantes: status.tentativasRestantes - 1,
            numeroErros: status.numeroErros + 1,
        };
};


/* Se o número de tentativas restantes chegar a zero, a função chama encerrarJogo() com a mensagem "VOCÊ MORREU!".
Se o jogador completar a palavra (ou seja, não houver mais underscores), a função chama encerrarJogo() com a mensagem "Parabéns! Você venceu!".(Luan)*/


const verificarFimDeJogo = (status) => {
    if (status.tentativasRestantes === 0) return 'VOCÊ MORREU!';
    if (!status.exibicaoPalavra.includes('_')) return 'Parabéns! Você venceu!';
    return null;
};

/*atualizarExibicao: Função que atualiza a interface do usuário com base no estado atual do jogo, ela atualiza o texto do elemento que exibe a palavra com os underscores e letras já adivinhadas,atualiza o texto que exibe as letras que já foram chutadas,atualiza a imagem com base no número de erros.(Thiago) */
const atualizarExibicao = (status) => {
    document.getElementById("exibicao-palavra").innerText = status.exibicaoPalavra.join(' ');
    document.getElementById("letras-chutadas").innerText = status.letrasChutadas.join(', ');
    document.getElementById("imagem").src = `imagens/imagem${status.numeroErros}.png`;

    const mensagem = verificarFimDeJogo(status);
    if (mensagem) encerrarJogo(mensagem);
};

/*encerrarJogo: a função que finaliza o jogo, desativando a entrada de letras e exibindo uma mensagem apropriada. Ela:desabilita o campo de entrada de letras,exibe a mensagem de resultado e mostra o botão de reiniciar o jogo.(Luan) */
const encerrarJogo = (mensagem) => {
    document.getElementById('entrada-letra').disabled = true;
    document.getElementById('mensagem').innerText = mensagem;
    document.getElementById('mensagem').style.display = 'block';
    document.getElementById('botao-reiniciar').style.display = 'block';
};

/*iniciarJogo: Função que inicializa o jogo ela chama inicializarGame() para obter o estado inicial,configura os eventos de interação do jogador e atualiza a interface com o estado inicial.(Thiago)*/
const iniciarJogo = () => {
    const statusInicial = inicializarGame();
    configurarEventos(statusInicial);
    atualizarExibicao(statusInicial);
};

/*Chama processarChute() para obter um novo status,atualizando a interface e retornando um novo status.(Luan) */
const criarProcessadorDeEntrada = (statusAtual, letra) => {
    const novoStatus = processarChute(statusAtual, letra);
    atualizarExibicao(novoStatus); 
    return novoStatus; 
};

/*configurarEventos: Função que configura os eventos de interação na interface do jogo ela seleciona os elementos DOM necessários (botões e campo de entrada),inicializa o estado local com o status inicial e esconde o botão de reiniciar, enquanto habilita a entrada de letras,
configura o evento de clique no botão "Chutar". 
Ao clicar:obtém a letra da entrada e a converte para minúsculas,verifica se a letra é válida (um caractere alfabético e de tamanho 1).
Se válida, chama criarProcessadorDeEntrada() para processar a letra e atualizar o estado,limpa a entrada de texto após o chute.
Se não for válida, exibe um alerta.configura o evento de clique no botão "Reiniciar", que chama a função iniciarJogo() para reiniciar o jogo.(Luan)*/ 
const configurarEventos = (statusInicial) => {
    const botaoChutar = document.getElementById('btn-chutar');
    const entradaLetra = document.getElementById('entrada-letra');
    const botaoReiniciar = document.getElementById('botao-reiniciar');

    botaoReiniciar.style.display = 'none';
    entradaLetra.disabled = false;

    let statusAtual = statusInicial; 

    botaoChutar.onclick = () => {
        const letra = entradaLetra.value.toLowerCase();
        if (letra.match(/[a-zà-ùç-]/i) && letra.length === 1) {
            statusAtual = criarProcessadorDeEntrada(statusAtual, letra); 
            entradaLetra.value = ''; 
        } else {
            alert('Por favor, insira uma letra válida.');
        }
    };

    botaoReiniciar.onclick = iniciarJogo;
};

/*Inicializa o jogo quando a pagina é carregada(Thiago)*/
window.onload = iniciarJogo;
