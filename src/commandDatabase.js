const configCommands = require('../connectMongoDb/configDados').userModel

const twitchAddCommands = async (comando, conteudo) => {
    await configCommands.create({
        comando: comando,
        conteudo: conteudo
    })
}

const verificCommands = async (comandoVerific) => {
    let comandoExiste = []
    await configCommands.find().then((comandos) => {
        let comando = ''
        comando = comandos.find(c => c.comando === comandoVerific)
        if (comando) {
            comandoExiste.push(comando.comando)
            comandoExiste.push(comando.conteudo)
        }
    })
    return comandoExiste
}

const deleteCommands = async (comandoDelete) => {
    await configCommands.deleteMany({
        comando: comandoDelete
    })
}

const upadateCommands = async (comando, conteudo) => {
    await configCommands.updateOne({
        comando: comando,
    }, {
        conteudo: conteudo
    })
}

module.exports = {
    twitchAddCommands,
    verificCommands,
    deleteCommands,
    upadateCommands
}