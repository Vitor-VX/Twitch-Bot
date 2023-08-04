const {
    twitchAddCommands,
    verificCommands,
    deleteCommands,
    upadateCommands
} = require('./commandDatabase');

// Função para enviar mensagem no chat
const enviarMensagemChat = (twitchClient, canal, mensagem) => {
    return twitchClient.say(canal, `/me ${mensagem}`);
};

// Função para executar os eventos do chat -> adicionar/excluir comandos
const handleCommands = (message, twitchClient, canal, userTwitch) => {
    let comandos = message.toLowerCase();

    //variaveis importantes para os comandos
    let arrayComandoAdd = '', comando = '', conteudo = '';

    //condicao para adicionar um comando no chat
    if (comandos.startsWith('!addcommand')) {
        arrayComandoAdd = message.split(' ');
        if (arrayComandoAdd.length > 1 && arrayComandoAdd.length > 2) {
            comando = arrayComandoAdd[1]
            for (let i = 2; i < arrayComandoAdd.length; i++) {
                conteudo += ' ' + arrayComandoAdd[i];
            }

            verificCommands(comando).then((result) => {
                if (result[0]) {
                    upadateCommands(result[0], conteudo)
                    enviarMensagemChat(twitchClient, canal, `Comando ${comando} atualizado com sucesso.`).catch(e => { console.log(`${e}`) });
                } else {
                    const novoComando = {
                        comando: comando.toLowerCase(),
                        conteudo: conteudo
                    };

                    twitchAddCommands(novoComando.comando, novoComando.conteudo)

                    enviarMensagemChat(twitchClient, canal, `Comando ${comando} adicionado com sucesso.`).catch(e => { console.log(`${e}`) });
                }
            })
        } else {
            enviarMensagemChat(twitchClient, canal, 'É necessário fornecer um nome e um conteúdo para o comando.').catch(e => { console.log(`${e}`) });
        }
    }

    //condicao para remover um comando do chat -> Segue na mesma logica do !addCommand
    if (comandos.startsWith('!removecommand')) {
        const arrayComandoAdd = message.split(' ');
        //aqui usamos uma condicao para vericar se o comando contem um !Comando -> se nao tiver o comando da um return
        if (arrayComandoAdd.length < 2) {
            enviarMensagemChat(twitchClient, canal, 'É necessário fornecer o nome do comando para removê-lo.').catch(e => { console.log(`${e}`) });
            return;
        }

        //Aqui definimos as variaveis necessarias para o comando !removeCommand
        const comandoRemove = arrayComandoAdd[1];

        verificCommands(comandoRemove.toLowerCase()).then(result => {
            if (result[0]) {
                deleteCommands(result[0])
                enviarMensagemChat(twitchClient, canal, `Comando ${comandoRemove} removido com sucesso.`).catch(e => { console.log(`${e}`) });
            } else {
                enviarMensagemChat(twitchClient, canal, `O comando ${comandoRemove} não foi encontrado.`).catch(e => { console.log(`${e}`) });
            }
        })
    }

    // Verificar os comandos adicionados no banco de dados
    verificCommands(message.toLowerCase()).then(result => {
        if (result[0]) {
            enviarMensagemChat(twitchClient, canal, result[1]);
        } else if (!comandos.startsWith('!addcommand') && !comandos.startsWith('!removecommand') && !comandos.startsWith('!g_')) {
            enviarMensagemChat(twitchClient, canal, `${userTwitch} o comando não existe.`);
        }
    })

};




module.exports = {
    handleCommands,
    enviarMensagemChat,
};
