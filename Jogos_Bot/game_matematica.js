/*
=====================GAME-ACERTE-A-SOMA============================
========================Vitor-VX===================================
*/

// Adicionando a função de enviar mensagem -> chat twithc
const twitchBotFunctions = require('../src/twitchBotFunctions');
const enviarMensagemChat = twitchBotFunctions.enviarMensagemChat;

// Variaveis globais importantes para o game
let resposta = 0, contaEscolhida = '', tempoEsgotado = false, tentativasPlayer = 4;
let jogoTerminou = false;

// "Engines" do Game
const arrayContas = ['+', '-', '*'];

// Array com Fuções do Game
const utils = [
    () => Math.floor(Math.random() * 19) + 2,
    () => Math.floor(Math.random() * 9) + 2,
    () => {
        const indice = Math.floor(Math.random() * arrayContas.length);
        contaEscolhida = indice;
        return arrayContas[indice];
    },
    () => {
        setTimeout(() => {
            tempoEsgotado = true;
        }, 10000);
    },
];

// Constantes para dos numeros para fazer a soma -> (TalNumero (+ OR * OR -) TalNumero)
const numeroAleatorio = utils[0](), numeroSoma = utils[1]()

// Engine das respostas
const game_Engine = () => {
    const contaAleatoria = utils[2]();

    switch (contaAleatoria) {
        case '+':
            resposta = numeroAleatorio + numeroSoma;
            break;
        case '-':
            resposta = numeroAleatorio - numeroSoma;
            break;
        case '*':
            resposta = numeroAleatorio * numeroSoma;
            break;
        default:
            break;
    }

    return resposta;
};

// Função usada para zerar as variaveis do Codigo
const zerar_Engine_Game = () => {
    tempoEsgotado = false;
    tentativasPlayer = 4;
    jogoTerminou = false;
};

// Objeto "VERIFICAR_RESPOSTA" para ser usado no switch-case
const VERIFICAR_RESPOSTA = {
    RESPOSTA_CORRETA: 0,
    TENTATIVAS_ACABARAM: 1,
    TEMPO_ESGOTADO: 2,
};

// Função para verificar as respostas do player
const verificarResposta = (nomePlayer, msgTwitch, userTwitch) => {
    if (jogoTerminou) return;

    const numeroParseInt = parseInt(msgTwitch);
    if (numeroParseInt === resposta && userTwitch === nomePlayer.nome && tentativasPlayer >= 0 && !tempoEsgotado) {
        zerar_Engine_Game();
        return VERIFICAR_RESPOSTA.RESPOSTA_CORRETA;
    }

    if (tentativasPlayer === 0 && !tempoEsgotado) {
        zerar_Engine_Game();
        return VERIFICAR_RESPOSTA.TENTATIVAS_ACABARAM;
    } else {
        tentativasPlayer--;
    }

    if (tempoEsgotado) {
        return VERIFICAR_RESPOSTA.TEMPO_ESGOTADO;
    }
};

// Função principal do codigo -> game
const game_Matematica = (nomePlayer, canal, twitchClient) => {
    const base_Player = {
        nome: nomePlayer,
        pontos: 0,
    };

    // Aqui chamamos 2 funções para começar o game_Engine e o tempo que o player tem para responder.
    game_Engine();
    utils[3]();

    const intervaloTempoEsgotado = setInterval(() => {
        if (tempoEsgotado && !jogoTerminou) {
            enviarMensagemChat(
                twitchClient,
                canal,
                `${base_Player.nome} tempo esgotado! O número correto era: ${resposta}`
            );
            zerar_Engine_Game();
            clearInterval(intervaloTempoEsgotado);
        }
    }, 1000);

    enviarMensagemChat(
        twitchClient,
        canal,
        `${base_Player.nome}, você iniciou o game, quanto é: ${numeroAleatorio}${arrayContas[contaEscolhida]
        }${numeroSoma}?`
    );

    twitchClient.once('message', function onMessage(canal, tags, mensagemChat, self) {
        if (self) return;
        let userTwitch = tags.username;

        // Switch case chamando a função de verificResposta
        switch (verificarResposta(base_Player, mensagemChat, userTwitch)) {
            case VERIFICAR_RESPOSTA.RESPOSTA_CORRETA:
                enviarMensagemChat(
                    twitchClient,
                    canal,
                    `${base_Player.nome} parabéns você acertou o número: ${resposta}`
                );
                jogoTerminou = true;
                clearInterval(intervaloTempoEsgotado);
                break;
            case VERIFICAR_RESPOSTA.TENTATIVAS_ACABARAM:
                enviarMensagemChat(twitchClient, canal, `${base_Player.nome} suas tentativas acabaram! O número correto era: ${resposta}`);
                jogoTerminou = true;
                clearInterval(intervaloTempoEsgotado);
                break;
            case VERIFICAR_RESPOSTA.TEMPO_ESGOTADO:
                jogoTerminou = true;
                clearInterval(intervaloTempoEsgotado);
                break;
            default:
                break;
        }
    });
};

module.exports = { game_Matematica };
