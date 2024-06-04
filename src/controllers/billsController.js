const billsModel = require('../models/billsModel');

const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

class productController {
    async index(req, res) { //Listar todas contas

        const bills = await billsModel.find({ user_id: req.user_id });

        return res.status(200).json(bills);

    }

    async findOne(req, res) { //Listar uma conta

        try {
            const { id } = req.params;

            const bill = await billsModel.findById({ _id: id, user_id: req.user_id });

            if (!bill) {
                return res.status(404).json({ "message": 'Not Found' });
            }

            return res.status(200).json(bill);

        } catch (error) {
            return res.status(404).json({ "message": 'Bill not found' });
        }
    }

    async createBills(req, res) { //Criar conta
        try {
            const billData = req.body;
            billData.user_id = req.user_id;

            const createdbills = await billsModel.create(billData);
            return res.status(200).json(createdbills)
        } catch (error) {
            res.status(404).json({ "message": error });
        }
    }

    async updateBills(req, res) { //Atualizar conta
        const { id } = req.params;
        try {
            const bill = await billsModel.findOneAndUpdate(
                { _id: id, user_id: req.user_id },
                req.body,
                { new: true }
            );

            if (!bill) {
                return res.status(404).json({ message: 'This id not exists' });
            }

            return res.status(200).json({ message: 'Item updated successfully' });
        } catch (error) {
            return res.status(404).json({ "message": 'This id not exists' });
        }
    }

    async deleteBills(req, res) { //Deletar conta
        const { id } = req.params;

        try {
            const bill = await billsModel.findOneAndDelete({ _id: id, user_id: req.user_id }); // Garantir que a consulta inclua user_id

            if (!bill) {
                return res.status(404).json({ message: 'Bills not found' });
            }
            return res.status(200).json({ message: 'Bills successfully deleted' });
        } catch (error) {
            return res.status(404).json({ "message": "Bills not found" });
        }
    }

    async deleteAllBills(req, res) { //Deletar conta
        try {
            billsModel.deleteMany({ user_id: req.user_id }); // Garantir que a consulta inclua user_id
            return res.status(200).json({ "message": "Bills successfully deleted" });
        } catch (error) {
            return res.status(404).json({ "message": "Bills not found" });
        }
    }

    async filterBills(req, res) { //Filtrar resultados

        if (!req.body) { return res.status(404).json({ "message": "Not found" }) }

        try {
            const filter = await billsModel.find({ ...req.body, user_id: req.user_id }); // Garantir que a consulta inclua user_id
            return res.status(200).json(filter);
        } catch (error) {
            return res.status(404).json({ "message": "Fileter failed" });
        }

    }
}

module.exports = new productController();