const { request } = require("express");

const Hello = require("../database-setup").User;

async function list(req, res, next) {
  const userId = req.get('userId')
  const users = await Hello.findAll({
    attributes: ["id", "username"],
    order: [["id", "DESC"]],
  });
  res.send({ code: "Success", data: users, userId });
  return next();
}

module.exports.list = list;
