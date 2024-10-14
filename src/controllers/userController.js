const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// models
const usersModel = require("../models/usersModel");
const billsModel = require("../models/billsModel");
const Category = require("../models/categoryModel");

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

  async deleteUser(req, res) {
    try {
      const userId = req.user_id;

      const user = await usersModel.findById(userId);
      const bills = await billsModel.find({ user_id: userId });
      const category = await Category.find({ user_id: userId });

      if (user) {
        if (bills) {
          await billsModel.deleteMany({ user_id: userId });
        }

        if (category) {
          await Category.deleteMany({ user_id: userId });
        }

        await usersModel.findByIdAndDelete(userId);
      } else {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Retornar sucesso
      return res.status(200).json({
        message:
          "Usuário e todos os dados associados foram deletados com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao deletar o usuário." });
    }
  }
}

module.exports = new userController();
