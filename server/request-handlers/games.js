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

async function startGames(req, res, next) {

    const gameId = req.params.id;
    const hostId = req.get('userId');

    const checkGame = await Game.findOne({
        where: {
            id: gameId,
            gameState: 0
        }
    });

    if (checkGame.gameState != 1) {
        checkGame.gameState = 1; //state changed from Lobby to Started, also need to change it to 2 when its finished
        await checkGame.save();

        if (hostId == checkGame.UserId) {

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
            console.log("gamesmap is ", GAMESMAP[gameId]);
            await GAMESMAP[gameId].startGame();

            res.send({ code: "success", data: GAMESMAP[gameId].readCards() });
        } else {
            res.send({ status: "only Host can start the game" });
        }

    } else { res.send({ status: "game is already started" }); }
}

async function revealCards(req, res, next) {
    const gameId = req.params.id;
    console.log("gameid is", gameId);
    const userId = req.get('userId');
    console.log("userid is", userId);
    const cardIndex = req.body.card;
    console.log("cardindex is", cardIndex);

    let card;

    try {
        card = await GAMESMAP[gameId].revealCard(cardIndex, userId);
    } catch (error) {
        res.send({ error: error.toString() })
    }

    console.log("card", card);
    res.send({ card: card.identifier });
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

async function kickPlayer(req, res, next) {

    const hostId = req.get('userId');



    const gameId = req.params.id;
    const playerId = req.body.player;

    const leavingGame = await Game.findOne({
        where: {
            id: gameId
        }
    });
    if (hostId == playerId) {
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

        res.send({
            code: 'Success',
            kickedplayer: kickedPlayer
        });

        return next();
    }

    else {
        res.send({ status: "Only the Host can kick players" });
    }
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
    const CardSetCopy = [...CardSet];
    CardSetCopy.sort((a, b) => (Math.random() - 0.5));
    const Cardzzz2 = CardSet.slice(0, 8);
    const Cardzzz3 = Cardzzz2.concat(Cardzzz2)
    Cardzzz3.sort((a, b) => (Math.random() - 0.5));

    const playCards = Cardzzz3.map((card) => {
        return { identifier: card, state: CardState.Hidden };
    });

    return playCards;

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

//exporting endpoints

module.exports.getGames = getGames;
module.exports.getGamesById = getGamesById;

module.exports.createGames = createGames;
module.exports.joinGames = joinGames;

module.exports.startGames = startGames;
module.exports.leaveGames = leaveGames;

module.exports.revealCards = revealCards;

module.exports.kickPlayer = kickPlayer;

module.exports.getCards = getCards;