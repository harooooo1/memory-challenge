const Sequelize = require("sequelize");
const dataPopulators = require("./seed-data");

const memory_challenge = new Sequelize("memory_challenge", "root", "adminadmin", {
  host: "localhost",
  dialect: "mysql",
  // dialect: "sqlite",
  // storage: "./server/database.sqlite",
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  // operatorsAliases: false,
});

// Model definition
const User = memory_challenge.define("User", {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
  },
  username: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  totalWins: Sequelize.INTEGER,
  isBanned: Sequelize.BOOLEAN, // 0 or 1, default 0
  isAdmin: Sequelize.BOOLEAN, // 0 or 1, default 0
  authToken: Sequelize.STRING

});

const Game = memory_challenge.define("Game", {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
  },
  title: Sequelize.STRING,
  currentPlayers: Sequelize.INTEGER,
  maxPlayers: Sequelize.INTEGER,
  gameState: Sequelize.TINYINT, // 0 - in lobby, 1 - in progress, 2-  finish
  winner: Sequelize.STRING, // who won
});

const Player = memory_challenge.define("Player", {

  playerNumber: Sequelize.INTEGER, //players number inside the game (example: player1, player2 etc....)
  clicks: Sequelize.INTEGER,     // number of times you clicked on a card to reveal it
  pairs: Sequelize.INTEGER,      // number of succesfully matched pairs

});

//Hello.hasOne(Hello2);
//Hello2.belongsTo(Hello);

User.hasMany(Game);
User.belongsToMany(Game, { through: Player });
Game.belongsToMany(User, { through: Player });
//Project.belongsToMany(User, { through: UserProjects });

// INIT DB ENTITY MODELS
(async function () {

  const FORCE_RECREATE_MODELS = false;
  const DO_SYNC = true;

  // Drop tables in order to avoid foreign key constraint issues
  if (FORCE_RECREATE_MODELS) {
    User.drop();
    Game.drop();
    Player.drop();
  } 
  // Sync models
  if(DO_SYNC) {
    await User.sync({ force: FORCE_RECREATE_MODELS });
    await Game.sync({ force: FORCE_RECREATE_MODELS });
    await Player.sync({ force: FORCE_RECREATE_MODELS });
  }

  // repopulate the db with predefined data
  /*if (FORCE_RECREATE_MODELS) {
    //  dataPopulators.mockHelloData(Hello);
    //  dataPopulators.mockHello2Data(Hello2);
  } */
})();

module.exports.User = User;
module.exports.Game = Game;
module.exports.Player = Player;
module.exports.memory_challenge = memory_challenge;
