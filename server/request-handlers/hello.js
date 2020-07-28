const Hello = require("../database-setup").Hello;

async function list(req, res, next) {
  const users = await Hello.findAll({
    attributes: ["id", "name", "foo"],
    order: [["id", "DESC"]],
  });
  res.send({ code: "Success", data: users });
  return next();
}

module.exports.list = list;
