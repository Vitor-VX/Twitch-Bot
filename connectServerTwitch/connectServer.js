require('dotenv').config()
const tmi = require('tmi.js')

//config do bot/twitch
const twitch = tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.URSERNAME_TWITCH,
        password: process.env.TOKEN_TWITCH_BOT
    },
    channels: [process.env.CANAL_TWITCH]
})

//fazer conexao com o servidor da twitch
twitch.connect().catch(error => console.log(error))

module.exports = twitch