// import { Request, Response } from 'express';

const billsModel = require("../models/billsModel");

class filterController {
  async getData(request, reply) {
    try {
      const filter = request.query; // Obter os parâmetros de consulta da solicitação

      const result = await billsModel.find(filter); // Executar a consulta no MongoDB
      return reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno ao processar a solicitação." });
    }
  }
}

module.exports = new filterController();
