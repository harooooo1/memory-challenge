const Game = require('../database-setup').Game;
const User = require('../database-setup').User;
const errs = require('./auth');
const { Player } = require('../database-setup');


async function postGames(req, res, next) {

    const userId = req.get('userId');

    const newGame = {
        title: req.body.title,
        UserId: userId,
        currentPlayers: 0,
        maxPlayers: 8,
        gameState: 0
    };

    const game = await Game.create(newGame);

    res.send({
        code: 'Success',
        data: game,
    });

    return next();
}

async function makePlayer(req, res, next) {

    const userId = req.get('userId');

    const newPlayer = {
        playerNumber: req.body.playernum,
        UserId: userId

    };

    const player = await Player.create(newPlayer);

    res.send({
        code: 'Success',
        data: player,
    });

    return next();
}

async function getGames(req, res, next) {

    const listGames = await Game.findAll();

    res.send({
        code: 'Success',
        data: listGames
    });

    return next();
}

async function getGamesById(req, res, next) {
    const gameId = req.params.id;
    const listGame = await Game.findAll({
        where: {
            id: gameId
        }
    });

    res.send({
        code: 'Success',
        data: listGame
    });

    return next();
}

async function deleteGames(req, res, next) {

    const deleteId = req.params.userid;
    const deleteGame = await Game.destroy({
        where: {
            UserId: deleteId// ?
        }
    });

    res.send({
        code: 'Success',
        deletedEntries: deleteGame
    });

    return next();
}


async function joinGame() {

}

async function playTurn() {
    // do stuff
}

module.exports.postGames = postGames;
module.exports.getGames = getGames;
module.exports.getGamesById = getGamesById;
module.exports.deleteGames = deleteGames;
module.exports.makePlayer = makePlayer;