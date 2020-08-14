const Game = require('../database-setup').Game;
const User = require('../database-setup').User;
const errs = require('./auth');
const { Player } = require('../database-setup');

async function createGames(req, res, next) {

    const userId = req.get('userId');

    const newGame = {
        title: req.body.title,
        UserId: userId,
        currentPlayers: 1,
        maxPlayers: 8,
        gameState: 0
    };

    const game = await Game.create(newGame);

    res.send({
        code: 'Success',
        data: game,
    });

    await makePlayer(game, game.UserId);

    return next();
}

async function makePlayer(game, userid) {

    const newPlayer = {
        playerNumber: game.currentPlayers,
        GameId: game.id,
        UserId: userid
    };

    const player = await Player.create(newPlayer);

    return player;
}

async function joinGames(req, res, next) {

    const gameId = req.params.id;
    const userId = req.get('userId');

    const joinedGame = await Game.findOne({
        where: {
            id: gameId
        }
    });

    const joinedPlayer = await makePlayer(joinedGame, userId);

    joinedGame.currentPlayers++;

    await joinedGame.save();

    res.send({
        code: 'Success',
        data: joinedPlayer
    });

    return next();
}

async function StartGames() {

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
    const listGame = await Game.findOne({
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

    const deleteId = req.params.gameid;
    const deleteGame = await Game.destroy({
        where: {
            id: deleteId
        }
    });

    res.send({
        code: 'Success',
        deletedEntries: deleteGame
    });

    return next();
}

/*
async function revealCard() {
    // do stuff
}

async function leaveGames() {

}

async function kickPlayer() {

}

async function generateCards() {

} */

module.exports.createGames = createGames;
module.exports.getGames = getGames;
module.exports.getGamesById = getGamesById;
module.exports.deleteGames = deleteGames;
module.exports.joinGames = joinGames;