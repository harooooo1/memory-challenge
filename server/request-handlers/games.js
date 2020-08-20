const User = require('../database-setup').User;
const Game = require('../database-setup').Game;
const Player = require('../database-setup').Player;
const errs = require('./auth');
const { GameModel, CardState, GameState } = require("../game-model");

//global vars
const GAMESMAP = {}

//need to see in which functions do I need return next(); and in which ones I dont
//add endpoint for quitting Game and for update Score
//forbid users from joining multiple games 

//endpoints functions 

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
    const listedGame = await Game.findOne({
        where: {
            id: gameId
        }
    });

    res.send({
        code: 'Success',
        data: listedGame,
        cards: GAMESMAP[gameId] && GAMESMAP[gameId].readCards()
    });

    return next();
}

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


    //add functionality to not allow users to join more than 1 game
    const gameId = req.params.id;
    const userId = req.get('userId');

    const joinedGame = await Game.findOne({
        where: {
            id: gameId
        }
    });

    const joiningPlayer = await Player.findOne({
        where: {
            UserId: userId,
            GameId: joinedGame.id
        }
    });

    if (joinedGame.gameState != 0) { res.send({ status: "game is already started" }) }

    else if (joiningPlayer) {
        res.send({ status: "you already joined that game" })

    }
    else {
        joinedGame.currentPlayers++;

        const joinedPlayer = await makePlayer(joinedGame, userId);

        await joinedGame.save();

        res.send({
            code: 'Success',
            data: joinedPlayer
        });
    }
}

async function startGames(req, res, next) {

    const gameId = req.params.id;
    const hostId = req.get('userId');

    const checkGame = await Game.findOne({
        where: {
            id: gameId,
        }
    });

    if (checkGame.gameState != 0) {
        res.send({ status: "game is already started" });
    }
    else if (checkGame.gameState == 0) {
        checkGame.gameState = 1; //state changed from Lobby to Started, also need to change it to 2 when its finished
        await checkGame.save();

        if (hostId != checkGame.UserId) {
            res.send({ status: "only Host can start the game" });
        }
        else {

            //fetch all players that share the specific game id
            const players = await Player.findAll(
                {
                    where: { GameId: gameId }
                });

            const playersMap = players.reduce((acc, player) => {
                acc[player.UserId] = player.playerNumber;
                return acc;
            }, {});

            const gameConfig = {
                players: playersMap,
                cards: getCards(),
            };

            GAMESMAP[gameId] = await new GameModel(gameConfig);
            await GAMESMAP[gameId].startGame();

            res.send({ code: "success", data: GAMESMAP[gameId].readCards() });
        }

    }
}

async function revealCards(req, res, next) {

    const gameId = req.params.id;
    const userId = req.get('userId');
    const cardIndex = req.body.card;

    let revealedcard;

    try {
        revealedcard = await GAMESMAP[gameId].revealCard(cardIndex, userId);
    } catch (error) {
        res.send({ error: error.toString() })
    }

    res.send({ card: revealedcard.identifier, cardIndex: cardIndex });

    if (GAMESMAP[gameId].checkIfGameIsDone()) {

        const check = await Game.findOne({
            where: {
                id: gameId
            }
        });

        check.gameState = 2;
        await check.save();
    }
}

async function leaveGames(req, res, next) {
    //this is only for leaving lobby
    //deletes the game if you are the host, leaves the game if you are not host
    //need to also make a different endpoint for leaving the game
    const gameId = req.params.id;
    const deleteId = req.get('userId');

    const leavingGame = await Game.findOne({
        where: {
            id: gameId
        }
    });

    const leavingPlayer = await Player.findOne({
        where: {
            UserId: deleteId,
            GameId: leavingGame.id
        }
    });

    if (deleteId == leavingGame.UserId) {

        await leavingGame.destroy();

        res.send({ code: 'Success', gamedeleted: "game deleted" });

        return next();
    }
    else if (leavingPlayer) {

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
            deletedPlayer: leavingPlayer
        });

        return next();
    }
    else {
        res.send({ status: "you are not in that game" })
    }

}

async function kickPlayer(req, res, next) {
    //kick a player from a game lobby by his user id
    const hostId = req.get('userId');
    const gameId = req.params.id;
    const playerId = req.body.player;

    const leavingGame = await Game.findOne({
        where: {
            id: gameId,
        }
    });

    if (leavingGame.gameState != 0) {
        res.send({ status: "can't kick players if a game is started" })
    }
    else if (leavingGame.currentPlayers <= 1) {
        res.send({ status: "No one to kick" });
    }
    else if (hostId == playerId) {
        res.send({ status: "Can't kick yourself" });
    }
    else if (hostId == leavingGame.UserId) {

        leavingGame.currentPlayers--;

        await leavingGame.save();

        const kickedPlayer = await Player.destroy({
            where: {
                UserId: playerId,
                GameId: gameId
            }
        });
        console.log("we kicked", kickedPlayer);
        res.send({
            code: 'Success',
            KickedUserId: playerId
        });

    }
    else {
        res.send({ status: "Only the Host can kick players" });
    }
}

// helper functions 

async function makePlayer(game, userid) {

    const userName = await User.findOne({
        where: {
            id: userid,
        }
    });

    const newPlayer = {
        playerNumber: game.currentPlayers - 1,
        playerName: userName.username,
        GameId: game.id,
        UserId: userName.id
    };

    const player = await Player.create(newPlayer);

    return player;
}

function getCards() {
    var CardSetCopy = [...CardSet];
    CardSetCopy.sort((a, b) => (Math.random() - 0.5));
    CardSetCopy = CardSetCopy.slice(0, 4);
    CardSetCopy = CardSetCopy.concat(CardSetCopy)
    CardSetCopy.sort((a, b) => (Math.random() - 0.5));

    CardSetCopy = CardSetCopy.map((card) => {
        return { identifier: card, state: CardState.Hidden };
    });

    return CardSetCopy;

}

async function wait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("done waiting");
            resolve();
        }, time);
    });
}

const CardSet = ["10_of_clubs",
    "10_of_diamonds",
    "10_of_hearts",
    "10_of_spades",
    "2_of_clubs",
    "2_of_diamonds",
    "2_of_hearts",
    "2_of_spades",
    "3_of_clubs",
    "3_of_diamonds",
    "3_of_hearts",
    "3_of_spades",
    "4_of_clubs",
    "4_of_diamonds",
    "4_of_hearts",
    "4_of_spades",
    "5_of_clubs",
    "5_of_diamonds",
    "5_of_hearts",
    "5_of_spades",
    "6_of_clubs",
    "6_of_diamonds",
    "6_of_hearts",
    "6_of_spades",
    "7_of_clubs",
    "7_of_diamonds",
    "7_of_hearts",
    "7_of_spades",
    "8_of_clubs",
    "8_of_diamonds",
    "8_of_hearts",
    "8_of_spades",
    "9_of_clubs",
    "9_of_diamonds",
    "9_of_hearts",
    "9_of_spades",
    "ace_of_clubs",
    "ace_of_diamonds",
    "ace_of_hearts",
    "ace_of_spades",
    "black_joker",
    "jack_of_clubs",
    "jack_of_diamonds",
    "jack_of_hearts",
    "jack_of_spades",
    "king_of_clubs",
    "king_of_diamonds",
    "king_of_hearts",
    "king_of_spades",
    "queen_of_clubs",
    "queen_of_diamonds",
    "queen_of_hearts",
    "queen_of_spades",
    "red_joker"];

module.exports.getGames = getGames;
module.exports.getGamesById = getGamesById;
module.exports.createGames = createGames;
module.exports.joinGames = joinGames;
module.exports.startGames = startGames;
module.exports.revealCards = revealCards;
module.exports.leaveGames = leaveGames;
module.exports.kickPlayer = kickPlayer;