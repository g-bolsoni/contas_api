const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail.js");

class authController {
  async registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (!name) {
      return res.status(422).json({
        field: "name",
        message: "Este campo é obrigatório.",
      });
    }
    if (!email) {
      return res.status(422).json({
        field: "email",
        message: "Este campo é obrigatório.",
      });
    }
    if (!password) {
      return res.status(422).json({
        field: "password",
        message: "Este campo é obrigatório.",
      });
    }

    if (!confirmPassword) {
      return res.status(422).json({
        field: "confirmPassword",
        message: "Este campo é obrigatório.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        field: "confirmPassword",
        message: "As senhas são diferentes.",
      });
    }

    // Check user exists
    const userExists = await usersModel.findOne({ email });

    if (userExists) {
      return res.status(422).json({
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
      return res
        .status(201)
        .json({ success: true, message: "Usuário criado com sucesso." });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Erro interno ao criar o usuário." });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(422).json({
        success: false,
        field: "email",
        message: "Este campo é obrigatório.",
      });
    }

    if (!password) {
      return res.status(422).json({
        field: "password",
        success: false,
        message: "Este campo é obrigatório.",
      });
    }

    // Check user exists
    const userExists = await usersModel.findOne({ email });

    if (!userExists ) {
      return res.status(422).json({
        success: false,
        field: "root",
        message: "Credenciais incorretas, verifique e tente novamente!",
      });
    }

    //Verify Password
    const user = userExists;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(422).json({
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
      return res
        .status(200)
        .json({ success: true, message: "Seja bem vindo!!", Token: token });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro interno ao autenticar o usuário.",
      });
    }
  }

  async resetPassword(req, res) {
    const { email } = req.body;

    const existingUser = await usersModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(422).json({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    try {
      const emailToken = await this.generateCode(5);
      existingUser.resettoken = emailToken;
      existingUser.resettokenExpiration = Date.now() + 3600000;
      await existingUser.save();

      await sendMail(
        email,
        "Redefinir Senha",
        `<p font-size: 22px> Seu código para redefiner a senha é ${emailToken}</span>`
      );

      return res.status(200).json({
        success: true,
        message: "Email enviado!",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Ocorreu um erro inesperado, tente novamente!",
      });
    }
  }

  async resetPasswordConfirm(req, res) {
    const { email, code, password } = req.body;
    const user = await usersModel.findOne({ email: email });

    if (!user) {
      return res.status(422).json({
        success: false,
        field: "root",
        message: "Usuário não encontrado!",
      });
    }

    if (user.resettoken != code) {
      return res.status(400).json({
        success: false,
        field: "code",
        message: "Código inválido!",
      });
    }

    if (user.resettokenExpiration < new Date()) {
      return res.status(400).json({
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

    return res.status(200).json({
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
