/*
======================Famoso jogo da forca -> não podia faltar(rsrs)================
====================================Vitor-VX========================
*/

const twitchBotFunctions = require('../src/twitchBotFunctions')
const enviarMensagemChat = twitchBotFunctions.enviarMensagemChat

//Palavras para o jogo de forca
const palavras = ['gato', 'cachorro', 'elefante', 'girafa', 'leao', 'tigre', 'cobra', 'macaco'];

//função para escolher uma palavra aleatória
const escolherPalavra = () => {
    const indiceAleatorio = Math.floor(Math.random() * palavras.length);
    return palavras[indiceAleatorio];
};

//função para inicializar o jogo
const forca = (nomePlayer, canalTwitch, twitchClient) => {
    const palavraEscolhida = escolherPalavra().toLowerCase();
    const letrasAdivinhadas = new Set();
    let tentativas = 6;

    //função para verificar se a letra foi adivinhada
    const letraAdivinhada = (letra) => {
        return letrasAdivinhadas.has(letra.toLowerCase());
    };

    //função para mostrar o estado da palavra (com traços para letras não adivinhadas)
    const mostrarPalavra = () => {
        let palavraMostrada = '';
        for (const letra of palavraEscolhida) {
            if (letrasAdivinhadas.has(letra)) {
                palavraMostrada += letra + ' ';
            } else {
                palavraMostrada += '_ ';
            }
        }
        return palavraMostrada.trim();
    };

    //função para processar a adivinhação do jogador
    const processarAdivinhacao = (letra) => {
        if (letraAdivinhada(letra)) {
            enviarMensagemChat(twitchClient, canalTwitch, `${nomePlayer}, você já adivinhou a letra "${letra}".`);
            return;
        }

        letrasAdivinhadas.add(letra.toLowerCase());

        if (palavraEscolhida.includes(letra.toLowerCase())) {
            if (mostrarPalavra() === palavraEscolhida) {
                enviarMensagemChat(twitchClient, canalTwitch, `Parabéns, ${nomePlayer}! Você adivinhou a palavra "${palavraEscolhida}"!`);
                return;
            }
            enviarMensagemChat(twitchClient, canalTwitch, `${nomePlayer}, a letra "${letra}" está na palavra: ${mostrarPalavra()}`);
        } else {
            tentativas--;
            if (tentativas === 0) {
                enviarMensagemChat(twitchClient, canalTwitch, `${nomePlayer}, você perdeu! A palavra era "${palavraEscolhida}".`);
                return;
            }
            enviarMensagemChat(twitchClient, canalTwitch, `${nomePlayer}, a letra "${letra}" não está na palavra. Tentativas restantes: ${tentativas}`);
        }
    };

    enviarMensagemChat(twitchClient, canalTwitch, `${nomePlayer}, bem-vindo ao jogo da forca! Adivinhe a palavra: ${mostrarPalavra()}`);

    twitchClient.on('message', (canal, tags, mensagemChat, selfBot) => {
        if (selfBot) { return; }
        if (tags.username === nomePlayer && mensagemChat.length === 1 && mensagemChat.match(/[a-z]/i)) {
            processarAdivinhacao(mensagemChat.toLowerCase());
        }
    });
};

module.exports = {
    forca
}