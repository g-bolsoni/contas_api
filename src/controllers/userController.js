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

  async updateUserInfo(req, res) {
    try {
      const userId = req.user_id;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send("Nenhuma informação para atualizar.");
      }

      // Atualiza o usuário no banco de dados
      const updatedUser = await usersModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).send("Usuário não encontrado.");
      }

      res.status(200).json({
        message: "Cadastro atualizado com sucesso",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao atualizar o cadastro.");
    }
  }
}

module.exports = new userController();
