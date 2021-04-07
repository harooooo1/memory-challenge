const Sequelize = require("sequelize");

const crime_alert = new Sequelize("crime_alert", "root", "adminadmin", {
  host: "localhost",
  dialect: "mysql",
  // dialect: "sqlite",
  // storage: "./server/database.sqlite",
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  // operatorsAliases: false,
});

// Model definition
const User = crime_alert.define("User", {

  id: {
    type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
  },
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  totalPosts: Sequelize.INTEGER,
  authToken: Sequelize.STRING,
  isBanned: Sequelize.BOOLEAN, // 0 or 1, default 0
  isAdmin: Sequelize.BOOLEAN, // 0 or 1, default 0

});

/* const Game = crime_alert.define("Game", {

  id: {
    type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
  },
  title: Sequelize.STRING,
  currentPlayers: Sequelize.INTEGER, // number of players in the game room
  maxPlayers: Sequelize.INTEGER,
  gameState: Sequelize.TINYINT, // 0 - in lobby, 1 - started, 2 - finished
  winner: Sequelize.STRING, // who won

}); */

//Hello.hasOne(Hello2);
//Hello2.belongsTo(Hello);

//User.hasMany(Game);
//User.belongsToMany(Game, { through: Player });
//Game.belongsToMany(User, { through: Player });
//Project.belongsToMany(User, { through: UserProjects });

// INIT DB ENTITY MODELS
(async function () {

  const FORCE_RECREATE_MODELS = true;
  const DO_SYNC = true;

  // Drop tables in order to avoid foreign key constraint issues
  if (FORCE_RECREATE_MODELS) {
    User.drop();
  //  Game.drop();
  //  Player.drop();
  }
  // Sync models
  if (DO_SYNC) {
    await User.sync({ force: FORCE_RECREATE_MODELS });
    //await Game.sync({ force: FORCE_RECREATE_MODELS });
    //await Player.sync({ force: FORCE_RECREATE_MODELS });
  }

})();

module.exports.User = User;
module.exports.crime_alert = crime_alert;