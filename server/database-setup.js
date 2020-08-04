const Sequelize = require("sequelize");
const dataPopulators = require("./seed-data");

// set this flag to recreate the models and reseed the DB
const FORCE_RECREATE_MODELS = true;

const memory_challenge = new Sequelize("memory_challenge", "root", "adminadmin", {
  host: "localhost",
  dialect: "mysql",
  // dialect: "sqlite",
  // storage: "./server/database.sqlite",
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  operatorsAliases: false,
});

// Model definition
 const User = memory_challenge.define("User", {
  id: { 
    type: Sequelize.INTEGER, primaryKey: true },
  username: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  totalwins: Sequelize.INTEGER,
  banned: Sequelize.TINYINT, // 0 or 1
});

const Game = memory_challenge.define("Game", {
  id: { 
    type: Sequelize.INTEGER, primaryKey: true },
  //FK
  gamename: Sequelize.STRING,
  current_players: Sequelize.INTEGER, //current players
  max_players: Sequelize.INTEGER,     //max players
  state: Sequelize.TINYINT,
  start_time: Sequelize.TIME,
  winner: Sequelize.STRING, // data about who won the game, need to find a way to return this value to this table after a game ends

}); 

const Player = memory_challenge.define("Player", {

  player_number: Sequelize.INTEGER, //players number inside the game (example: player1, player2 etc....)
  clicks: Sequelize.INTEGER,     // number of times you clicked on a card to reveal it
  pairs: Sequelize.INTEGER,      // number of succesfully matched pairs

}); 


// establish a link between the two entities
//Hello.hasOne(Hello2);
//Hello2.belongsTo(Hello);

User.hasMany(Game);
User.belongsToMany(Game, { through: Player });
Game.belongsToMany(User, { through: Player });
//Project.belongsToMany(User, { through: UserProjects });

// INIT DB ENTITY MODELS
(async function () {
  // Drop tables in order to avoid foreign key constraint issues
  if (FORCE_RECREATE_MODELS) {
    User.drop(); // Hello has a foreign key referencing Hello
    Game.drop();
    Player.drop();
  }
  // Sync models
  await User.sync({ force: FORCE_RECREATE_MODELS });
  await Game.sync({ force: FORCE_RECREATE_MODELS });
  await Player.sync({ force: FORCE_RECREATE_MODELS });
  // repopulate the db with predefined data
  if (FORCE_RECREATE_MODELS) {
  //  dataPopulators.mockHelloData(Hello);
  //  dataPopulators.mockHello2Data(Hello2);
  }
})();

//module.exports.Hello = Hello;
//module.exports.Hello2 = Hello2;
module.exports.User = User;
module.exports.Game = Game;
module.exports.Player = Player;
module.exports.memory_challenge = memory_challenge;
