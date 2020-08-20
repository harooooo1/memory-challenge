const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");

console.log("HELLLO");

// REQUEST HANDLERS IMPORT
const AuthHandlers = require('./request-handlers/auth');
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

// games endpoints

server.head('/games', GameHandlers.getGames);

server.get('/games', GameHandlers.getGames);
server.get('/games/:id', GameHandlers.getGamesById);

server.post('/games', GameHandlers.createGames);
server.post('/games/:id/join', GameHandlers.joinGames);

server.post('/games/:id/start', GameHandlers.startGames);
server.post('/games/:id/leave', GameHandlers.leaveGames);

server.post('/games/:id/reveal-card', GameHandlers.revealCards);

server.post('/games/:id/kick', GameHandlers.kickPlayer);

// INIT SERVER
server.listen(8080, () =>
  console.log("%s listening at %s", server.name, server.url)
);
