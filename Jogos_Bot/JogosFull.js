const Game_BlackJack = require('../Jogos_Bot/game_BlackJack.js');
const Game_Guessing = require('../Jogos_Bot/game_NumberGuessing.js');
const Game_Forca = require('../Jogos_Bot/game_JogoForca.js');
const Game_Anagramas = require('../Jogos_Bot/game_Anagramas.js');
const Game_Math = require('../Jogos_Bot/game_matematica.js');

module.exports = {
    game_BlackJack: Game_BlackJack.black_Jack_Twitch,
    game_NumberGuessing: Game_Guessing,
    game_JogoForca: Game_Forca.forca,
    game_Anagramas: Game_Anagramas.game_Anagramas,
    game_Matematica: Game_Math.game_Matematica,
};