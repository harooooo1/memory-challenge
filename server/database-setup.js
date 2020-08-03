const Sequelize = require("sequelize");
const dataPopulators = require("./seed-data");

// set this flag to recreate the models and reseed the DB
const FORCE_RECREATE_MODELS = true;

const database = new Sequelize("memory_challenge", "root", "adminadmin", {
  host: "localhost",
  dialect: "mysql",
  // dialect: "sqlite",
  // storage: "./server/database.sqlite",
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  operatorsAliases: false,
});

// Model definition
 const User = database.define("User", {
  id: Sequelize.INTEGER,
  username: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  totalwins: Sequelize.INTEGER,
  banned: Sequelize.TINYINT,
  foo: Sequelize.JSON,
});

const Game = database.define("Game", {
  id: Sequelize.INTEGER,
  //FK
  hostname: {
    type: Sequelize.STRING,
    references: {
       model: 'User', // from which table the FK is pulled from
       key: 'username', // which column
    }
  },
  gamename: Sequelize.STRING,
  current_players: Sequelize.INTEGER, //current players
  max_players: Sequelize.INTEGER,     //max players
  state: Sequelize.STRING,
  start_time: Sequelize.STRING,
  winner: Sequelize.STRING, // data about who won the game, need to find a way to return this value to this table after a game ends

}); 

const Player = database.define("Player", {
  id: {
    type: Sequelize.INTEGER,
    references: {
       model: 'User', // from which table the FK is pulled from
       key: 'id', // which column
    }
  },


  game_id: {
    type: Sequelize.INTEGER,
    references: {
       model: 'Game', // from which table the FK is pulled from
       key: 'id', // which column
    }
  },
  username: {
    type: Sequelize.STRING,
    references: {
       model: 'User', // from which table the FK is pulled from
       key: 'username', // which column
    }
  },
  player_number: Sequelize.INTEGER, //players number inside the game (example: player1, player2 etc....)
  clicks: Sequelize.INTEGER,     // number of times you clicked on a card to reveal it
  pairs: Sequelize.INTEGER,      // number of succesfully matched pairs

}); 


// establish a link between the two entities
//Hello.hasOne(Hello2);
//Hello2.belongsTo(Hello);

User.hasMany(Game);
Game.hasMany(Player);
User.hasOne(Player);
Player.belongsTo(User);

// INIT DB ENTITY MODELS
(async function () {
  // Drop tables in order to avoid foreign key constraint issues
  if (FORCE_RECREATE_MODELS) {
    Hello2.drop(); // Hello has a foreign key referencing Hello
    Hello.drop();
  }
  // Sync models
  await Hello.sync({ force: FORCE_RECREATE_MODELS });
  await Hello2.sync({ force: FORCE_RECREATE_MODELS });

  // repopulate the db with predefined data
  if (FORCE_RECREATE_MODELS) {
    dataPopulators.mockHelloData(Hello);
    dataPopulators.mockHello2Data(Hello2);
  }
})();

module.exports.Hello = Hello;
module.exports.Hello2 = Hello2;
module.exports.database = database;
