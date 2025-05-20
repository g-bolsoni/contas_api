const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// models
const usersModel = require("../models/usersModel");
const billsModel = require("../models/billsModel");
const Category = require("../models/categoryModel");

class userController {
  async getUser(request, reply) {
    const userId = request.user_id;
    // check if user exists
    const user = await usersModel.findById(userId, "-password");

    if (!user) {
      return reply.status(422).send({
        message: "User not found",
      });
    }

    return reply.status(201).send(user);
  }

  async updateUserInfo(request, reply) {
    try {
      const userId = request.user_id;

      if (!request.body || Object.keys(request.body).length === 0) {
        return reply.status(400).send("Nenhuma informação para atualizar.");
      }

      // Atualiza o usuário no banco de dados
      const updatedUser = await usersModel.findByIdAndUpdate(userId, request.body, {
        new: true,
      });

      if (!updatedUser) {
        return reply.status(404).send("Usuário não encontrado.");
      }

      reply.status(200).send({
        message: "Cadastro atualizado com sucesso",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Erro ao atualizar o cadastro.");
    }
  }

  async deleteUser(request, reply) {
    try {
      const userId = request.user_id;

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
        return reply.status(404).send({ message: "Usuário não encontrado." });
      }

      // Retornar sucesso
      return reply.status(200).send({
        message: "Usuário e todos os dados associados foram deletados com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro ao deletar o usuário." });
    }
  }
}

module.exports = new userController();
