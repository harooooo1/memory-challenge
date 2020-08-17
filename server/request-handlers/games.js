const Game = require('../database-setup').Game;
const Player = require('../database-setup').Player;
const errs = require('./auth');
const { GameModel, CardState, GameState } = require("../game-model");

//global vars
const GAMESMAP = {}

//endpoints functions 

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

async function joinGames(req, res, next) {

    const gameId = req.params.id;
    const userId = req.get('userId');

    const joinedGame = await Game.findOne({
        where: {
            id: gameId
        }
    });

    joinedGame.currentPlayers++;

    const joinedPlayer = await makePlayer(joinedGame, userId);



    await joinedGame.save();

    res.send({
        code: 'Success',
        data: joinedPlayer
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

async function startGames(req, res, next) {

    const gameId = req.params.id;

    //fetch all players that share the specific game id
    const players = await Player.findAll(
        {
            where: { GameId: gameId }
        });

    const playersMap = players.reduce((acc, player) => {
        acc[player.UserId] = player.playerNumber;
        return acc;
    }, {})

    const gameConfig = {
        players: playersMap,
        cards: getCards(),
    };

    GAMESMAP[gameId] = await new GameModel(gameConfig);
    //GAMESMAP[gameId] = gameModel;
    console.log("gamesmap je", GAMESMAP[gameId]);
    await GAMESMAP[gameId].startGame();

    /*    await GAMESMAP[gameId].revealCard(0, 6);
        await GAMESMAP[gameId].revealCard(1, 6);
    
        await wait(3200);
    
        await GAMESMAP[gameId].revealCard(2, 6);
        await GAMESMAP[gameId].revealCard(3, 6); */
    /*
    await GAMESMAP[gameId].revealCard(1, 18);
    await GAMESMAP[gameId].revealCard(0, 18);
    
    await GAMESMAP[gameId].revealCard(2, 18);
    await GAMESMAP[gameId].revealCard(3, 18);
    */
    //    res.send({});
    res.send({});
}

async function revealCards(req, res, next) {
    const gameId = req.params.id;
    console.log("gameid is", gameId);
    const userId = req.get('userId');
    console.log("userid is", userId);
    const cardIndex = req.body.card;
    console.log("cardindex is", cardIndex);

    await GAMESMAP[gameId].revealCard(cardIndex, userId);
    
    res.send({});
}

async function leaveGames(req, res, next) {  //this is only for leaving lobby
    //deletes the game if you are the host, leaves the game if you are not host
    const gameId = req.params.id;
    const deleteId = req.get('userId');

    const leavingGame = await Game.findOne({
        where: {
            id: gameId
        }
    });

    if (deleteId == leavingGame.UserId || leavingGame.currentPlayers == 0) {

        await leavingGame.destroy();

        res.send({ code: 'Success', gamedeleted: "game deleted" });

        return next();
    } else {

        leavingGame.currentPlayers--;
        await leavingGame.save();

        const deletePlayer = await Player.destroy({
            where: {
                UserId: deleteId,
                GameId: gameId
            }
        });

        res.send({
            code: 'Success',
            deletedplayer: deletePlayer
        });

        return next();
    }



    return next();


}

async function kickPlayer() {

}

// helper functions 

async function makePlayer(game, userid) {

    const newPlayer = {
        playerNumber: game.currentPlayers - 1,
        GameId: game.id,
        UserId: userid
    };

    const player = await Player.create(newPlayer);

    return player;
}

function getCards() {
    const cards = [
        {
            identifier: "ace",
            state: CardState.Hidden,
        },
        {
            identifier: "ace",
            state: CardState.Hidden,
        },
        {
            identifier: "queen",
            state: CardState.Hidden,
        },
        {
            identifier: "queen",
            state: CardState.Hidden,
        },
    ];
    return cards;
}

async function wait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("done waiting");
            resolve();
        }, time);
    });
}

//exporting endpoints

module.exports.getGames = getGames;
module.exports.getGamesById = getGamesById;
module.exports.createGames = createGames;
module.exports.joinGames = joinGames;
module.exports.leaveGames = leaveGames;
module.exports.startGames = startGames;
module.exports.revealCards = revealCards;