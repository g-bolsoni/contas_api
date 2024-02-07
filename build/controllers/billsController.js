"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const billsModel = require('../models/billsModel');
class productController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bills = yield billsModel.find();
            return res.status(200).json(bills);
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const bill = yield billsModel.findById(id);
                if (!bill) {
                    return res.status(404).json({ "message": 'Not Found' });
                }
                return res.status(200).json(bill);
            }
            catch (error) {
                return res.status(404).json({ "message": 'Bill not found' });
            }
        });
    }
    createBills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdbills = yield billsModel.create(req.body);
                return res.status(200).json(createdbills);
            }
            catch (error) {
                res.status(404).json({ "message": error });
            }
        });
    }
    updateBills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield billsModel.findByIdAndUpdate(id, req.body);
                return res.status(200).json({ "message": 'Item updated successfully' });
            }
            catch (error) {
                return res.status(404).json({ "message": 'This id not exists' });
            }
        });
    }
    deleteBills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield billsModel.findByIdAndDelete(id);
                return res.status(200).json({ "message": "Bills successfully deleted" });
            }
            catch (error) {
                return res.status(404).json({ "message": "Bills not found" });
            }
        });
    }
    deleteAllBills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield billsModel.deleteMany();
                return res.status(200).json({ "message": "Bills successfully deleted" });
            }
            catch (error) {
                return res.status(404).json({ "message": "Bills not found" });
            }
        });
    }
    filterBills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body) {
                return res.status(404).json({ "message": "Not found" });
            }
            try {
                const filter = yield billsModel.find(req.body);
                console.log(`filter -> ${filter}`);
                return res.status(200).json(filter);
            }
            catch (error) {
                return res.status(404).json({ "message": "Fileter failed" });
            }
        });
    }
}
module.exports = new productController();
