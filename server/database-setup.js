const Sequelize = require("sequelize");
const dataPopulators = require("./seed-data");

// set this flag to recreate the models and reseed the DB
const FORCE_RECREATE_MODELS = true;

const database = new Sequelize("memory_challenge", "root", "", {
  host: "localhost",
  dialect: "mysql",
  // dialect: "sqlite",
  // storage: "./server/database.sqlite",
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  operatorsAliases: false,
});

// Model definition
const Hello = database.define("hello", {
  name: Sequelize.STRING,
  foo: Sequelize.JSON,
});

const Hello2 = database.define("hello_2", {
  name: Sequelize.STRING,
  bar: Sequelize.JSON,
});

// establish a link between the two entities
Hello.hasOne(Hello2);
Hello2.belongsTo(Hello);

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
