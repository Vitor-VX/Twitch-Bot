/*
========================BLACK-JACK-TWITCH=======================
==========================Vitor-VX==============================
*/
const enviarMensagemChat = (twitchClient, canal, mensagem) => {
    canal = twitchClient.channels[0]
    return twitchClient.say(canal, `/me ${mensagem}`);
};

let array_Jogador = [];
let tentativas_Player_1 = 0;
let tentativas_Player_2 = 0;

const numRandom = () => {
    return Math.floor(Math.random() * 98) + 2;
};

const randomLetter = () => {
    const alphabet = "AQKJ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const getRandomCardValue = () => {
    const randomNumber = Math.random();
    if (randomNumber < 0.31) {
        const cardValue = randomLetter();
        return ['A', 'Q', 'K', 'J'].includes(cardValue) ? 10 : cardValue;
    } else {
        return numRandom();
    }
};

const distribuirCarta = (jogador, twitchClient, canal) => {
    const carta = getRandomCardValue();
    jogador.pontos += carta;
    enviarMensagemChat(twitchClient, canal, `${jogador.nome} puxou um ${carta}. Pontuação total: ${jogador.pontos}`);
};

const verificarVencedor = (jogador1, jogador2, twitchClient, canal) => {
    let vencedor;
    let mensagem;

    if (jogador1.pontos > 21 && jogador2.pontos > 21) {
        vencedor = null;
        mensagem = 'Empate! Ambos os jogadores estouraram.';
    } else if (jogador1.pontos <= 21 && jogador2.pontos <= 21) {
        vencedor = jogador1.pontos > jogador2.pontos ? jogador1 : jogador2;
        mensagem = vencedor ? `Player ${vencedor.nome} Ganhou!` : 'Empate!';
    } else {
        vencedor = jogador1.pontos <= 21 ? jogador1 : jogador2;
        mensagem = `Player ${vencedor.nome} Ganhou! ${jogador1.pontos <= 21 ? jogador2.nome : jogador1.nome} estourou!`;
    }

    enviarMensagemChat(twitchClient, canal, `Total de pontos do jogador ${jogador1.nome}: ${jogador1.pontos} -> Total de pontos do jogador ${jogador2.nome}: ${jogador2.pontos} -> Fim do jogo! -> ${mensagem}`);
};

const zerar_Pontos = (jogador_1, jogador2) => {
    jogador_1.pontos = 0
    jogador2.pontos = 0
    tentativas_Player_1 = 0
    tentativas_Player_2 = 0
}

const black_Jack_Twitch = async (nomePlayer, canal, twitchClient) => {
    const base_Player_1 = {
        nome: nomePlayer,
        pontos: 0,
    };

    const base_Player_2 = {
        nome: '',
        pontos: 0,
    };

    enviarMensagemChat(twitchClient, canal, `${nomePlayer} está chamando alguém para jogar, digite !aceito`);

    const resposta = await new Promise((resolve) => {
        twitchClient.on('message', (channel, tags, message, self) => {
            if (message.toLowerCase() === '!aceito' && tags['display-name'] !== 'joxsbot') {
                base_Player_2.nome = tags.username;
                array_Jogador.push(base_Player_1, base_Player_2);
                const nomeJogador_1 = array_Jogador.find(n => n.nome === base_Player_1.nome);
                const nomeJogador_2 = array_Jogador.find(n => n.nome === base_Player_2.nome);
                if (nomeJogador_1 && nomeJogador_2) {
                    enviarMensagemChat(twitchClient, canal, `${base_Player_2.nome} aceitou jogar com o ${base_Player_1.nome}. Os jogadores já podem digitar !card`);
                    resolve('!aceito');
                }
            } else {
                setTimeout(() => { resolve(false); }, 100000);
            }
        });
    });

    if (resposta === '!aceito') {
        twitchClient.on('message', async (channel, tags, message, self) => {
            if (self) return;

            if (message.toLowerCase() === '!card') {
                if (tags.username === base_Player_1.nome) {
                    tentativas_Player_1 += 1;
                    distribuirCarta(base_Player_1, twitchClient, canal);
                    if (base_Player_1.pontos === 21 && base_Player_2.pontos > 0) {
                        verificarVencedor(base_Player_1, base_Player_2, twitchClient, canal);
                        zerar_Pontos();
                    } else if (base_Player_1.pontos > 21 && base_Player_2.pontos > 0 && tentativas_Player_1 >= 2 && tentativas_Player_2 >= 2) {
                        verificarVencedor(base_Player_1, base_Player_2, twitchClient, canal);
                        zerar_Pontos();
                    } else if (base_Player_1.pontos > 21 && tentativas_Player_1 >= 2 && tentativas_Player_2 >= 2) {
                        verificarVencedor(base_Player_2, base_Player_1, twitchClient, canal);
                        zerar_Pontos();
                    }
                } else if (tags.username === base_Player_2.nome) {
                    tentativas_Player_2 += 1;
                    distribuirCarta(base_Player_2, twitchClient, canal);
                    if (base_Player_2.pontos === 21 && base_Player_1.pontos > 0) {
                        verificarVencedor(base_Player_1, base_Player_2, twitchClient, canal);
                        zerar_Pontos();
                    } else if (base_Player_2.pontos > 21 && base_Player_1.pontos > 0 && tentativas_Player_1 >= 2 && tentativas_Player_2 >= 2) {
                        verificarVencedor(base_Player_1, base_Player_2, twitchClient, canal);
                        zerar_Pontos();
                    } else if (base_Player_2.pontos > 21 && tentativas_Player_1 >= 2 && tentativas_Player_2 >= 2) {
                        verificarVencedor(base_Player_1, base_Player_2, twitchClient, canal);
                        zerar_Pontos();
                    }
                }
            }

            if (message.toLowerCase() === '!para' && (tags.username === base_Player_1.nome || tags.username === base_Player_2.nome)) {
                const verficacao_Ponto = base_Player_1.pontos > 0 && base_Player_2.pontos > 0 ? base_Player_1.nome : base_Player_2.nome;
                if (base_Player_1.pontos > 0 && base_Player_2.pontos > 0 && tentativas_Player_1 >= 2 && tentativas_Player_2 >= 2) {
                    verificarVencedor(base_Player_1, base_Player_2, twitchClient, canal);
                    zerar_Pontos(base_Player_1, base_Player_2)
                } else if (tentativas_Player_1 < 2 || tentativas_Player_2 < 2) {
                    enviarMensagemChat(twitchClient, canal, `Ambos players (${base_Player_1.nome} e ${base_Player_2.nome}) precisam jogar pelo menos 2 vezes antes de parar!`);
                } else {
                    enviarMensagemChat(twitchClient, canal, `${verficacao_Ponto}, você precisa utilizar o comando !card`);
                }
            }
        });
    } else {
        enviarMensagemChat(twitchClient, canal, 'Ninguém aceitou o desafio.');
    }
};

module.exports = {
    black_Jack_Twitch
};