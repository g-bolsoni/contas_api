const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class userController {
  async getUser(req, res) {
    const userId = req.user_id;
    // check if user exists
    const user = await usersModel.findById(userId, "-password");

    if (!user) {
      return res.status(422).json({
        message: "User not found",
      });
    }

    return res.status(201).json(user);
  }

  async getUserLogged(req, res) {
    return res.status(422).json({
      message: "User not found",
    });

    const id = req.params.id;

    // check if user exists
    const user = await usersModel.findById(id, "-password");

    if (!user) {
      return res.status(422).json({
        message: "User not found",
      });
    }

    return res.status(201).json(user);
  }
}

module.exports = new userController();
