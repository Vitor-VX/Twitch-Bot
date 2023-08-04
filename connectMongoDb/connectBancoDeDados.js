const mongoose = require('mongoose')

const connectDataBase = mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@bancodedadosvitor-vx.6awlvqi.mongodb.net/?retryWrites=true&w=majority`).then(() => {
}).catch((err) => {
    console.log(`Erro: ${err}`)
});

module.exports = { connectDataBase }