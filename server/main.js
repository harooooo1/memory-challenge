const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");

const { GameModel, CardState } = require("./game-model");

console.log("HELLLO");

// REQUEST HANDLERS IMPORT
const AuthHandlers = require('./request-handlers/auth');
const HelloHandlers = require("./request-handlers/hello");
const GameHandlers = require("./request-handlers/games");
const { ServiceUnavailableError } = require("restify-errors");
// SERVER SETUP
const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["content-type", "x-auth-token"],
});

const server = restify
  .createServer({ name: "memory-challenge-api" })

  .pre(cors.preflight)
  .pre(restify.plugins.pre.dedupeSlashes())
  .pre(restify.plugins.pre.context())
  .use(cors.actual)
  .use(restify.plugins.bodyParser({ mapParams: true }))
  .use(restify.plugins.queryParser({ mapParams: true }))
  .use(restify.plugins.gzipResponse())
  .use(AuthHandlers.authFilter);
// AUTH CHECK

// LOGIN, LOGOUT AND REGISTER
server.post('/register', AuthHandlers.register);
server.post('/login', AuthHandlers.login);
server.post('/logout', AuthHandlers.logout);

// games

server.head('/games', GameHandlers.getGames);
server.get('/games/:id', GameHandlers.getGamesById);
server.get('/games', GameHandlers.getGames);
server.post('/games/:id/join', GameHandlers.joinGames);
server.post('/games', GameHandlers.createGames);

server.del('/games/:gameid', GameHandlers.deleteGames);

//server.post('asdfg', GameHandlers.joinGame);
//server.post('asdfg', GameHandlers.playTurn);

// HELLO
server.head("/api/hello", HelloHandlers.list);
server.get("/api/hello", HelloHandlers.list);

// INIT SERVER
server.listen(8080, () =>
  console.log("%s listening at %s", server.name, server.url)
);



(async function () {
  const gameConfig = {
    players: {
      15: 0, // Harun
      18: 1, // Vlado
    },
    cards: getCards(),
  };

  const gameModel = new GameModel(gameConfig);

  gameModel.startGame();

  await gameModel.revealCard(1, 15);
  await gameModel.revealCard(2, 15);

  await wait(3200);

  await gameModel.revealCard(1, 18);
  await gameModel.revealCard(0, 18);

  await gameModel.revealCard(2, 18);
  await gameModel.revealCard(3, 18);
})();

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
