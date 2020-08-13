const Game = require('../database-setup').Game;
const User = require('../database-setup').User;
const errs = require('./auth');
const { Player } = require('../database-setup');

async function createGames(req, res, next) {

    const userId = req.get('userId');

    const newGame = {
        title: req.body.title,
        UserId: userId,
        currentPlayers: 0,
        maxPlayers: 8,
        gameState: 0
    };

    const game = await Game.create(newGame);

    const hostplayer = await makePlayer(game);
    game.currentPlayers = hostplayer.playerNumber;
    await game.save();

    res.send({
        code: 'Success',
        data: game,
    });

    return next();
}

async function makePlayer(game) {

    const newPlayer = {
        playerNumber: game.currentPlayers + 1,
        GameId: game.id,
        UserId: game.UserId
    };
    console.log("11");
    const player = await Player.create(newPlayer); // problem for JoinGames, but not for CreateGames
    console.log("12");
    return player;
}

async function joinGames(req, res, next) {

    const gameId = req.params.id;

    const joinedGame = await Game.findOne({
        where: {
            id: gameId
        }
    });
    console.log(joinedGame);
    console.log("1");
    const joinplayer = await makePlayer(joinedGame); ////
    console.log("2");
    joinedGame.currentPlayers = JoinedGame.currentPlayers+1;
    console.log("3");
    await joinedGame.save();
    console.log("4");

    res.send({
        code: 'Success',
        data: joinplayer
    });
    console.log("7");
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

async function revealCard() {
    // do stuff
}

async function leaveGames() {

}

async function kickPlayer() {

}

async function generateCards() {

}

module.exports.createGames = createGames;
module.exports.getGames = getGames;
module.exports.getGamesById = getGamesById;
module.exports.deleteGames = deleteGames;
module.exports.joinGames = joinGames;