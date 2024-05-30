const billsModel = require('../models/billsModel');

const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

class productController {
    async index(req, res) { //Listar constas
        await this.authenticate(req, res, () => { }); // Autenticação

        const bills = await billsModel.find({ user_id: req.user_id });

        return res.status(200).json(bills);

    }

    async authenticate(req, res, next) { // Função de autenticação para verificar o token e obter o user_id
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Autenticação necessária' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                throw new Error();
            }
            req.user_id = user._id;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }
    }

    async findOne(req, res) { //Listar constas
        await this.authenticate(req, res, () => { }); // Autenticação

        try {
            const { id } = req.params;

            const bill = await billsModel.findById(id);

            if (!bill) {
                return res.status(404).json({ "message": 'Not Found' });
            }

            return res.status(200).json(bill);

        } catch (error) {
            return res.status(404).json({ "message": 'Bill not found' });
        }
    }

    async createBills(req, res) { //Criar conta
        await this.authenticate(req, res, () => { }); // Autenticação
        try {
            const createdbills = await billsModel.create(req.body);
            return res.status(200).json(createdbills)
        } catch (error) {
            res.status(404).json({ "message": error });
        }
    }

    async updateBills(req, res) { //atualiza conta
        await this.authenticate(req, res, () => { }); // Autenticação
        const { id } = req.params;
        try {
            await billsModel.findByIdAndUpdate(id, req.body);
            return res.status(200).json({ "message": 'Item updated successfully' });
        } catch (error) {
            return res.status(404).json({ "message": 'This id not exists' });
        }
    }

    async deleteBills(req, res) { //Delete conta
        await this.authenticate(req, res, () => { }); // Autenticação
        const { id } = req.params;
        try {
            await billsModel.findByIdAndDelete(id);
            return res.status(200).json({ "message": "Bills successfully deleted" });
        } catch (error) {
            return res.status(404).json({ "message": "Bills not found" });
        }
    }

    async deleteAllBills(req, res) { //Delete conta
        await this.authenticate(req, res, () => { }); // Autenticação
        try {
            await billsModel.deleteMany();
            return res.status(200).json({ "message": "Bills successfully deleted" });
        } catch (error) {
            return res.status(404).json({ "message": "Bills not found" });
        }
    }

    async filterBills(req, res) { //Filtra os resultados
        await this.authenticate(req, res, () => { }); // Autenticação

        if (!req.body) { return res.status(404).json({ "message": "Not found" }) }
        try {
            const filter = await billsModel.find(req.body);

            console.log(`filter -> ${filter}`);
            return res.status(200).json(filter);
        } catch (error) {
            return res.status(404).json({ "message": "Fileter failed" });
        }

    }
}

module.exports = new productController();