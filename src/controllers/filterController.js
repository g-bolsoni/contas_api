// import { Request, Response } from 'express';

const billsModel = require('../models/billsModel');

class filterController {
    async getData(req, res) {

      try {
        const filter = req.query; // Obter os parâmetros de consulta da solicitação

        const result = await billsModel.find(filter); // Executar a consulta no MongoDB
        res.status(200).json(result);

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno ao processar a solicitação.' });
      }
    }
}

module.exports = new filterController();