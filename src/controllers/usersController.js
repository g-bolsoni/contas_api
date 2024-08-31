const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class usersController {
  async registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (!name) {
      return res.status(422).json({
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(422).json({
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(422).json({
        message: "Password is required",
      });
    }

    if (!confirmPassword) {
      return res.status(422).json({
        message: "Password is required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        message: "Passwords do not match",
      });
    }

    // Check user exists
    const userExists = await usersModel.findOne({ email });

    if (userExists) {
      return res.status(422).json({
        message: "User already exists",
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
      return res.status(201).json({ message: "Usuário criado com sucesso." });
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
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(422).json({
        message: "Password is required",
      });
    }

    // Check user exists
    const userExists = await usersModel.findOne({ email });

    if (!userExists) {
      return res.status(422).json({
        message: "User not found",
      });
    }

    //Verify Password
    const user = userExists;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(422).json({
        message: "Password is invalid",
      });
    }

    try {
      const secret = process.env.SECRET;
      const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      return res
        .status(200)
        .json({ message: "Auth token is valid", Token: token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Erro interno ao autenticar o usuário." });
    }
  }

  async getUserLogged(req, res) {
    const id = req.params.id;
    // check if user exists
    const user = await usersModel.findById(id, "-password");

    if (!user) {
      return res.status(422).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  }
}

module.exports = new usersController();
