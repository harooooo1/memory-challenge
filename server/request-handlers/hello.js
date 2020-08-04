const Hello = require("../database-setup").User;

async function list(req, res, next) {
  const users = await Hello.findAll({
    attributes: ["id", "username"],
    order: [["id", "DESC"]],
  });
  res.send({ code: "Success", data: users });
  return next();
}

module.exports.list = list;
