const billsModel = require('../models/billsModel');

class productController {
    async index(req, res){ //Listar constas
        const bills = await billsModel.find();

        return res.status(200).json(bills);
    }

    async findOne(req, res){ //Listar constas

        try {
            const { id } = req.params;

            const bill = await billsModel.findById(id);

            if(!bill){
                return res.status(404).json({ "message": 'Not Found' });
            }

            return res.status(200).json(bill);

        } catch (error) {
            return res.status(404).json({ "message": 'Bill not found' });
        }
    }

    async createBills(req, res){ //Criar conta
        const createdbills = await billsModel.create(req.body);

        return res.status(200).json(createdbills)
    }

    async updateBills(req, res){ //atualiza conta
        const { id } = req.params;
        try {
            await billsModel.findByIdAndUpdate(id, req.body);
            return res.status(200).json({ "message": 'Item updated successfully' });
        } catch (error) {
            return res.status(404).json({ "message": 'This id not exists' });
        }
    }

    async deleteBills(req, res){ //Delete conta
        const { id } = req.params;
        try {
            await billsModel.findByIdAndDelete(id);
            return res.status(200).json({"message":"Bills successfully deleted"});
        } catch (error) {
            return res.status(404).json({"message":"Bills not found"});
        }
    }

    async deleteAllBills(req, res){ //Delete conta
        try {
            await billsModel.deleteMany();
            return res.status(200).json({"message":"Bills successfully deleted"});
        } catch (error) {
            return res.status(404).json({"message":"Bills not found"});
        }
    }

    async filterBills(req, res){ //Filtra os resultados

        if(!req.body) { return res.status(404).json({"message":"Not found"})}
        try {
            const filter = await billsModel.find(req.body);

            console.log(`filter -> ${filter}`);
            return res.status(200).json(filter);
        } catch (error) {
            return res.status(404).json({"message":"Fileter failed"});
        }

    }
}

module.exports = new productController();