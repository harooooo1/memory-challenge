const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");

console.log("HELLLO");

// REQUEST HANDLERS IMPORT
const AuthHandlers = require('./request-handlers/auth');
const PostHandlers = require("./request-handlers/posts");
const { ServiceUnavailableError } = require("restify-errors");
// SERVER SETUP
const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["content-type", "x-auth-token"],
});

const server = restify
  .createServer({ name: "crime-alert-api" })

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

// posts endpoints


// INIT SERVER
server.listen(8080, () =>
  console.log("%s listening at %s", server.name, server.url)
);
