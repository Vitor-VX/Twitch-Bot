const mongoose = require('mongoose')
require('./connectBancoDeDados').connectDataBase

const userSchema = new mongoose.Schema({
    comando: {
        type: String,
        require: true
    },
    conteudo: {
        type: String,
        require: true
    }
})

const userModel = mongoose.model('comandosTwitch', userSchema)

module.exports = { userModel }