/*
==========================Vitor-VX========================
==========================@if_Vitor=======================
*/

const tmi = require('tmi.js')
const twitchBotFunctions = require('./twitchBotFunctions.js')
const Game_blackJack = require('../Jogos_Bot/blackJack.js')
const Game_Guessing = require('../Jogos_Bot/number_Guessing.js')
const Game_Forca = require('../Jogos_Bot/jogoForca.js')

//variaveis globais essenciais
const arrayComandos = []

//config do bot/twitch
const twitch = tmi.Client({
  options: { debug: true },
  identity: {
    username: 'NOME_DO_SEU_BOT',
    password: 'SEU_TOKEN_DA_TWITCH_AQUI'
  },
  channels: ['SEU CANAL DA TWITCH AQUI DENTRO']
})

//fazer conexao com o servidor da twitch
twitch.connect().catch(error => console.log(error))

//evento principal - mensagens no chat
twitch.on('message', (canal, tags, message, self) => {
  if (self) return;
  //atribuindo a variavel user para verificacoes de usuarios
  const user = tags.username

  const enviarMensagemChat = ((mensagem) => {
    return twitch.say(canal, `/me ${mensagem}`)
  })

  twitchBotFunctions.handleCommand(message, arrayComandos, twitch);
  /*
  Aqui são os jogos para twitch -> no momento com 3 -> no futuro proximo terá mais! 
  Este bot, tem uma estrutura base -> adicionar/remover comandos
  Mas eu foquei mais na interação com o chat da transmissão  -> ficar mais interativo para os "espec"
  */
  switch (message.toLowerCase()) {
    case '!21':
      Game_blackJack.black_Jack_Twitch(user, canal, twitch)
      break;
    case '!guessing':
      Game_Guessing.number_Guessing(user, canal, twitch)
      break
    case '!forca':
      Game_Forca.forca(user, canal, twitch)
      break
    case '!anagramas':
      Game_Anagramas.game_Anagramas(user, canal, twitch)
      break
    default:
      break;
  }

  //atribuimos 2 variaveis importantes para a verficacao do conteudo que irá ser mostrado no chat...
  let verificCommand = twitchBotFunctions.lerComandosDoArquivo('comandosTwtich')
  let comandoEncontrado = false;

  for (e of verificCommand) {
    if (message.toLowerCase() === e.comando.toLowerCase()) {
      enviarMensagemChat(e.conteudo);
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
