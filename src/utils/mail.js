// Importe a biblioteca Nodemailer
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (to, subject, html) => {
  // Configure o objeto mailOptions
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to, //"giovane.essado@gmail.com",
    subject: subject, // "Enviando Email usando Node.js",
    // text: text, //"Isso foi fácil!",
    html: html,
  };

  const result = await dispatchMail(mailOptions);
};

const dispatchMail = async (mailOptions) => {
  // Crie um objeto transportador
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use false para STARTTLS; true para SSL na porta 465
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Envie o email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(`Erro: ${error}`);
      } else {
        resolve(`Email enviado: ${info.response}`);
      }
    });
  });
};

module.exports = sendMail;
