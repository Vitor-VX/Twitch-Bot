const fs = require('fs');
const path = require('path');

// Função para ler os comandos existentes
const lerComandosDoArquivo = (arquivo) => {
    const arquivoPathTwitich = path.join(__dirname, arquivo + '.json');

    if (!fs.existsSync(arquivoPathTwitich)) {
        // Se o arquivo não existir, cria um novo arquivo vazio
        fs.writeFileSync(arquivoPathTwitich, '[]');
    }

    try {
        const data = fs.readFileSync(arquivoPathTwitich);
        const comandos = JSON.parse(data);
        return comandos || [];
    } catch (error) {
        console.log(error);
    }
};

// Função para gravar os comandos no arquivo .json
const gravarCommands = (arquivo, comandos) => {
    const arquivoPath = path.join(__dirname, arquivo + '.json');
    const data = JSON.stringify(comandos);
    fs.writeFileSync(arquivoPath, data);
};

// Função para enviar mensagem no chat
const enviarMensagemChat = (twitchClient, canal, mensagem) => {
    return twitchClient.say(canal, `/me ${mensagem}`);
};

// Função para executar os eventos do chat -> adicionar/excluir comandos
const handleCommand = (message, arrayComandos, twitchClient, canal) => {
    let comandos = message.toLowerCase();

    //variaveis importantes para os comandos
    let arrayComandoAdd = '';
    let comando = '';
    let conteudo = '';

    //condicao para adicionar um comando no chat
    if (comandos.startsWith('!addcommand')) {
        arrayComandoAdd = message.split(' ');
        if (arrayComandoAdd.length > 1 && arrayComandoAdd.length > 2) {
            comando = arrayComandoAdd[1];
            for (let i = 2; i < arrayComandoAdd.length; i++) {
                conteudo += ' ' + arrayComandoAdd[i];
            }
            const comandoExistente = arrayComandos.find(c => c.comando === comando); //aqui criamos uma constante para procurar o comando existente
            if (comandoExistente) {
                comandoExistente.conteudo = conteudo;
                gravarCommands('comandosTwtich', arrayComandos); // Aqui adicionamos o nome do arquivo ao gravar os comandos
                enviarMensagemChat(twitchClient, canal, `Comando ${comando} atualizado com sucesso.`).catch(e => { console.log(`${e}`) });
            } else {
                //nesse bloco se o comando não existir criamos um, em formato de arquitetura .json
                const novoComando = {
                    comando: comando,
                    conteudo: conteudo
                };
                //adicionamos a constante "novoComando" no array principal -> arrayComandos
                arrayComandos.push(novoComando);
                gravarCommands('comandosTwtich', arrayComandos); // Aqui adicionamos o nome do arquivo ao gravar os comandos
                enviarMensagemChat(twitchClient, canal, `Comando ${comando} adicionado com sucesso.`).catch(e => { console.log(`${e}`) });
            }
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
        const comandosExistentes = lerComandosDoArquivo('comandosTwtich'); // Aqui adicionamos o nome do arquivo ao ler os comandos
        const comandoEncontrado = comandosExistentes.find(c => c.comando === comandoRemove);

        //Aqui fazemos o processo para verificar se o comando existe -> se existir se eleva o processo para exclui-lo
        if (comandoEncontrado) {
            const index = comandosExistentes.indexOf(comandoEncontrado);
            if (index !== -1) {
                comandosExistentes.splice(index, 1);
                gravarCommands('comandosTwtich', comandosExistentes); // Aqui adicionamos o nome do arquivo ao gravar os comandos
                enviarMensagemChat(twitchClient, canal, `Comando ${comandoRemove} removido com sucesso.`).catch(e => { console.log(`${e}`) });
            } else {
                enviarMensagemChat(twitchClient, canal, `Erro ao remover o comando ${comandoRemove}.`).catch(e => { console.log(`${e}`) });
            }
        } else {
            enviarMensagemChat(twitchClient, canal, `O comando ${comandoRemove} não foi encontrado.`).catch(e => { console.log(`${e}`) });
        }
    }
};

module.exports = {
    lerComandosDoArquivo,
    gravarCommands,
    handleCommand,
    enviarMensagemChat,
};
