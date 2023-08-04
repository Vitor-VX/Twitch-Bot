/*
==========================Vitor-VX========================
==========================@if_Vitor=======================
*/

const twitch = require('../connectServerTwitch/connectServer')
const twitchBotFunctions = require('./twitchBotFunctions.js')
const jogos = require('../Jogos_Bot/JogosFull.js')

//evento principal - mensagens no chat
twitch.on('message', (canal, tags, message, self) => {
  if (self) return;
  //atribuindo a variavel user para verificacoes de usuarios
  const user = tags.username

  twitchBotFunctions.handleCommands(message, twitch, canal, user)

  if (message.toLowerCase().startsWith('!g_')) {
    switch (message.toLowerCase()) {
      case '!g_21':
        jogos.game_BlackJack(user, canal, twitch);
        return;
      case '!g_guessing':
        jogos.game_NumberGuessing(user, canal, twitch);
        return;
      case '!g_forca':
        jogos.game_JogoForca(user, canal, twitch);
        return;
      case '!g_anagramas':
        jogos.game_Anagramas(user, canal, twitch);
        return;
      case '!g_gamemath':
        jogos.game_Matematica(user, canal, twitch);
        return;
      default:
        twitchBotFunctions.enviarMensagemChat(twitch, canal, `${user} o jogo não existe.`)
        break;
    }
  }

});