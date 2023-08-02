/*
======================Advinhação-de-Número================
==========================Vitor-VX========================
*/
const twitchBotFunctions = require('../src/twitchBotFunctions')
const enviarMensagemChat = twitchBotFunctions.enviarMensagemChat

let tentativas = 5

//funcao para gerar numero de 1-19
const numRandom = () => {
    return Math.floor(Math.random() * 18) + 2;
};

//funcao principal do jogo
const number_Guessing = (nomePlayer, canalTwitch, twitchClient) => {
    //sempre é necessario -> de suma importancia -> criar um objeto do player -> Base_Player
    const base_Player = {
        nome: nomePlayer,
        pontos: 0
    }

    enviarMensagemChat(twitchClient, canalTwitch, `${base_Player.nome} você entrou no game! Digite um numero entre 2-19`)
    let numero = numRandom()

    twitchClient.on('message', async function onMessage(canal, tags, mensagemChat, selfBot) {
        if (selfBot) { return; }
        let user = tags.username;

        const verific_Number = parseInt(mensagemChat);

        let verificNumberDigite = verific_Number === numero;

        if (!isNaN(verific_Number) && user === base_Player.nome) {
            if (verific_Number >= 2 && verific_Number <= 20 && verificNumberDigite === true) {
                enviarMensagemChat(twitchClient, canalTwitch, `${base_Player.nome} você acertou o número, parabéns!`);
                twitchClient.removeListener('message', onMessage)
                return;
            } else {
                tentativas -= 1;
                enviarMensagemChat(twitchClient, canalTwitch, `${base_Player.nome} você errou o número, você tem ${tentativas} tentativas!`);
                if (tentativas === 0) {
                    enviarMensagemChat(twitchClient, canalTwitch, `${base_Player.nome} você perdeu!`);
                    twitchClient.removeListener('message', onMessage);
                }
            }
        } else {
            enviarMensagemChat(twitchClient, canalTwitch, `${base_Player.nome}, número inválido.`);
        }
    });
};

module.exports = {
    number_Guessing
}