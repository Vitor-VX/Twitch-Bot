/*
==========================Vitor-VX========================
==========================@if_Vitor=======================
*/

const twitch = require('../connectServerTwitch/connectServer')
const twitchBotFunctions = require('./twitchBotFunctions.js')
const jogos = require('../Jogos_Bot/JogosFull.js')
const enviarMensagemChat = twitchBotFunctions.enviarMensagemChat

//variaveis globais essenciais
const arrayComandos = []

//evento principal - mensagens no chat
twitch.on('message', (canal, tags, message, self) => {
  if (self) return;
  //atribuindo a variavel user para verificacoes de usuarios
  const user = tags.username

  twitchBotFunctions.handleCommand(message, arrayComandos, twitch, canal)

  switch (message.toLowerCase()) {
    case '!21':
      jogos.game_BlackJack(user, canal, twitch)
      break;
    case '!guessing':
      jogos.game_NumberGuessing(user, canal, twitch)
      break
    case '!forca':
      jogos.game_JogoForca(user, canal, twitch)
      break
    case '!anagramas':
      jogos.game_Anagramas(user, canal, twitch)
      break
    case '!gamemath':
      jogos.game_Matematica(user, canal, twitch)
      break
    default:
      break;
  }

  //atribuimos 2 variaveis importantes para a verficacao do conteudo que irá ser mostrado no chat...
  let verificCommand = twitchBotFunctions.lerComandosDoArquivo('comandosTwtich'), comandoEncontrado = false

  for (e of verificCommand) {
    if (message.toLowerCase() === e.comando.toLowerCase()) {
      enviarMensagemChat(twitch, canal, `${e.conteudo}`);
      comandoEncontrado = true;
      break;
    }
  }

  if (message.toLowerCase().startsWith('!addcommand') || message.toLowerCase().startsWith('!removecommand')) {
    // Se a mensagem começa com !addCommand ou !removeCommand,o bloco de instrucao não faz nada
    //se eu quiser fazer algo com isso, eu faço, mas no momento não tenho nada em mente
  } else if (message.toLowerCase().startsWith('!')) {
    if (!comandoEncontrado) {
      //enviarMensagemChat(`${user} comando indisponível.`);
    }
  }
});