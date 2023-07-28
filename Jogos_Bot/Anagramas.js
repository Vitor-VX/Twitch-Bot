//definimos as variaveis globais que vao ser importantes para o codigo
let palavras = ''
let tentativas_Player = 4, indice_palavra = 0, tempo_Resposta = 100000
let perdeu_Game = false

//importamos o module "random-words" para gerar as palavras do game-chat
import('random-words').then(randomWordsModule => {
    //aqui atribuimos a variavel global "palavras" ao modulo, para não ficar no escopo do import
    palavras = randomWordsModule.generate(50000)
})

//funcao responsavel por percorrer o array de 50k -> 50000 mil palavras da variavel "palavras"
const embaralha_Palavras = () => {
    const palavra_Aleatoria = Math.floor(Math.random() * palavras.length);
    //aqui atribuimos a variavel "indice_palavra" para capturar o indice do array, para usar no decorrer do codigo
    indice_palavra = palavra_Aleatoria
    return palavras[palavra_Aleatoria];
};

//funcao responsavel por embaralhar as "LETRAS" das "PALAVRAS" da variavel "PALAVRAS" -> não fica muito confuso se ler devagar
const embaralha_Letras = () => {
    const palavraE = embaralha_Palavras()
    const p = palavraE.split('');
    for (let i = p.length - 1; i > 0; i--) {
        const p1 = Math.floor(Math.random() * (i + 1));
        const temp = p[i];
        p[i] = p[p1];
        p[p1] = temp;
    }
    return p.join('');
};

//funcao para zera as pontuaçoes, no futuro terá um sistema de pontucao com banco de dados, por enquanto fica por isso
const zerar_Pontos_Player = (nomePlayer) => {
    nomePlayer.pontos = 0
    tentativas_Player = 4
    tempo_Resposta = 100000
}

//funcao de tempo de resposta do player
const temp_Resposta_Player = () => {
    setTimeout(() => {
        perdeu_Game = true
    }, tempo_Resposta);
}

//funcao para enviar mensagens no chat da twitch -> é de suma importancia para o codigo -> evita ficar chamando sempre o "twitch.say()"
const enviarMensagemChat = (twitchClient, canal, msg) => {
    return twitchClient.say(canal, `/me ${msg}`);
};

//essa funcao é de suma importancia -> ela verifica todas as jogadas do game -> retorna numeros de 1-2 para usar no switch
const verific_Game = (nomePlayer, userTwitch, msgTwitch, palavraReal) => {
    if (userTwitch.toLowerCase() === nomePlayer.nome && msgTwitch.toLowerCase() === palavraReal && perdeu_Game !== true) {
        zerar_Pontos_Player(nomePlayer)
        return 0; // true -> jogador acertou conforme as regras
    }

    if (msgTwitch.toLowerCase() !== palavraReal && tentativas_Player === 0) {
        zerar_Pontos_Player(nomePlayer)
        return 1; // false
    } else {
        tentativas_Player -= 1
    }

    if (perdeu_Game === true) {
        return 2
    }

};

//Função principal do Game
const game_Anagramas = (nomePlayer, canalTwitch, twitchClient) => {
    //aqui como todos os codigos -> criamos a Base_Player do jogador
    const base_Player = {
        nome: nomePlayer,
        pontos: 0,
    };

    /*
        Aqui atribuimos a variavel "palavra_Embaralhada" para receber 0 retorno da funcao embaralha_Letras()
        Depois criamos a variavel palavraReal(usada na verificacao na funcao verific_Game()) para receber o array PALAVRAS no indice "INDICE_PALAVRA"
    */
    let palavra_Embaralhada = embaralha_Letras(), palavraReal = palavras[indice_palavra]

    //aqui a funcao enviarMensagemChat() sera chamada quando um jogador der o comando "!anagramas" -> no chat da twitch
    enviarMensagemChat(twitchClient, canalTwitch, `${base_Player.nome} você está jogando [Game -> Anagramas], e palavra secreta é: ${palavra_Embaralhada}`);
    
    //chamamos a funcao temp_Resposta_Player() para começar o tempo de resposta do player
    temp_Resposta_Player()

    //criamos um setInterval para verificar a cada 1s se a variavel "perdeu_Game" é igual a "TRUE"
    setInterval(() => {
        if (perdeu_Game === true) {
            //se a condicao for verdadeira -> chamamos a funcao de "zerar_Pontos_Player()" -> e enviamos a mensagem de tempo esgotado
            zerar_Pontos_Player(nomePlayer)
            enviarMensagemChat(twitchClient, canalTwitch, `${base_Player.nome} tempo esgotado! A palavra secreta era: ${palavraReal} Kappa`);
        }
    }, 1000);

    //Aqui definimos o "ouvinte" do chat -> capturamos as palavras que o player tenta acertar
    twitchClient.on('message', async function onMessage(canal, tags, mensagemChat, selfBot) {
        if (selfBot) return; //ignorar a mensagem do bot-chat
        const user = tags.username;
        const msgTwitch = mensagemChat.toLowerCase();

        //Entao enfim -> usamos um bloco switch para chamar a funcao "verific_Game()" passando os paremetros necessarios
        switch (verific_Game(base_Player, user, msgTwitch, palavraReal)) {
            case 0:
                //caso o retorno seja 0 -> chamamos esse bloco
                enviarMensagemChat(twitchClient, canal, `${base_Player.nome} você acertou! A palavra secreta era: ${palavraReal}, parabéns Kappa`);
                twitchClient.removeListener('message', onMessage);
                break;
            case 1:
                //caso o retorno seja 1 -> chamamos esse bloco
                enviarMensagemChat(twitchClient, canal, `${base_Player.nome} você perdeu, a palavra secreta era: ${palavraReal} Kappa`);
                twitchClient.removeListener('message', onMessage);
                break;
            case 2:
                //caso o retorno seja 2 -> chamamos esse bloco
                twitchClient.removeListener('message', onMessage);
            default:
                break;
        }
    });
};

module.exports = {
    game_Anagramas
} 