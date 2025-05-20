const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail.js");

class authController {
  async registerUser(request, reply) {
    const { name, email, password, confirmPassword } = request.body;

    if (!name) {
      return reply.status(422).send({
        field: "name",
        message: "Este campo é obrigatório.",
      });
    }
    if (!email) {
      return reply.status(422).send({
        field: "email",
        message: "Este campo é obrigatório.",
      });
    }
    if (!password) {
      return reply.status(422).send({
        field: "password",
        message: "Este campo é obrigatório.",
      });
    }

    if (!confirmPassword) {
      return reply.status(422).send({
        field: "confirmPassword",
        message: "Este campo é obrigatório.",
      });
    }

    if (password !== confirmPassword) {
      return reply.status(422).send({
        field: "confirmPassword",
        message: "As senhas são diferentes.",
      });
    }

    // Check user exists
    const userExists = await usersModel.findOne({ email });

    if (userExists) {
      return reply.status(422).send({
        field: "root",
        message: "Já existe um cadastro com esse email.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = new usersModel({
      name,
      email,
      password: hashedPassword,
    });

    try {
      await user.save();
      return reply.status(201).send({ success: true, message: "Usuário criado com sucesso." });
    } catch (error) {
      console.log(error);
      return reply.status(500).send({ success: false, message: "Erro interno ao criar o usuário." });
    }
  }

  async loginUser(request, reply) {
    const { email, password } = request.body;

    if (!email) {
      return reply.status(422).send({
        success: false,
        field: "email",
        message: "Este campo é obrigatório.",
      });
    }

    if (!password) {
      return reply.status(422).send({
        success: false,
        field: "password",
        message: "Este campo é obrigatório.",
      });
    }

    // Check user exists
    const userExists = await usersModel.findOne({ email });

    if (!userExists) {
      return reply.status(422).send({
        success: false,
        field: "root",
        message: "Credenciais incorretas, verifique e tente novamente!",
      });
    }

    //Verify Password
    const user = userExists;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.status(422).send({
        field: "root",
        success: false,
        message: "Credenciais incorretas, verifique e tente novamente!",
      });
    }

    try {
      const secret = process.env.SECRET;
      const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      return reply.status(200).send({ success: true, message: "Seja bem vindo!!", Token: token });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Erro interno ao autenticar o usuário.",
      });
    }
  }

  async resetPassword(request, reply) {
    const { email } = request.body;

    const existingUser = await usersModel.findOne({ email: email });
    if (!existingUser) {
      return reply.status(422).send({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    try {
      const emailToken = await this.generateCode(5);
      existingUser.resettoken = emailToken;
      existingUser.resettokenExpiration = Date.now() + 3600000;
      await existingUser.save();

      await sendMail(email, "Redefinir Senha", `<p font-size: 22px> Seu código para redefiner a senha é ${emailToken}</span>`);

      return reply.status(200).send({
        success: true,
        message: "Email enviado!",
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        message: "Ocorreu um erro inesperado, tente novamente!",
      });
    }
  }

  async resetPasswordConfirm(request, reply) {
    const { email, code, password } = request.body;
    const user = await usersModel.findOne({ email: email });

    if (!user) {
      return reply.status(422).send({
        success: false,
        field: "root",
        message: "Usuário não encontrado!",
      });
    }

    if (user.resettoken != code) {
      return reply.status(400).send({
        success: false,
        field: "code",
        message: "Código inválido!",
      });
    }

    if (user.resettokenExpiration < new Date()) {
      return reply.status(400).send({
        success: false,
        field: "code",
        message: "Código expirou!",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update User
    user.password = hashedPassword;
    user.resettoken = "";
    user.resettokenExpiration = null;

    await user.save();

    return reply.status(200).send({
      success: true,
      message: "Senha alterada com sucesso!",
    });
  }

  async generateCode(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    const charactersLength = characters.length;

    let count = 0;
    while (count < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      count++;
    }

    return result;
  }
}

module.exports = new authController();
