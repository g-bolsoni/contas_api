const moment = require("moment");

const billsModel = require("../models/billsModel");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

class productController {
  async index(req, res) {
    //Listar todas contas

    const bills = await billsModel.find({ user_id: req.user_id });

    return res.status(200).json(bills);
  }

  async findOne(req, res) {
    //Listar uma conta

    try {
      const { id } = req.params;

      const bill = await billsModel.findById({ _id: id, user_id: req.user_id });

      if (!bill) {
        return res.status(404).json({ message: "Not Found" });
      }

      return res.status(200).json(bill);
    } catch (error) {
      return res.status(404).json({ message: "Bill not found" });
    }
  }

  async createBills(req, res) {
    //Criar conta
    try {
      const billData = req.body;
      billData.user_id = req.user_id;

      await billsModel.create(billData);

      return res.status(200).json({ message: "Bill has been created!" });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  }

  async updateBills(req, res) {
    //Atualizar conta
    const { id } = req.params;
    try {
      const bill = await billsModel.findOneAndUpdate(
        { _id: id, user_id: req.user_id },
        req.body,
        { new: true }
      );

      if (!bill) {
        return res.status(404).json({ message: "This id not exists" });
      }

      return res.status(200).json({ message: "Item updated successfully" });
    } catch (error) {
      return res.status(404).json({ message: "This id not exists" });
    }
  }

  async deleteBills(req, res) {
    //Deletar conta
    const { id } = req.params;

    try {
      const bill = await billsModel.findOneAndDelete({
        _id: id,
        user_id: req.user_id,
      });

      if (!bill) {
        return res.status(404).json({ message: "Bills not found" });
      }
      return res.status(200).json({ message: "Bills successfully deleted" });
    } catch (error) {
      return res.status(404).json({ message: "Bills not found" });
    }
  }

  async deleteAllBills(req, res) {
    //Deletar conta
    try {
      billsModel.deleteMany({ user_id: req.user_id });
      return res.status(200).json({ message: "Bills successfully deleted" });
    } catch (error) {
      return res.status(404).json({ message: "Bills not found" });
    }
  }

  async filterBills(req, res) {
    //Filtrar resultados

    if (!req.body) {
      return res.status(404).json({ message: "Not found" });
    }

    try {
      const filter = await billsModel.find({
        ...req.body,
        user_id: req.user_id,
      }); // Garantir que a consulta inclua user_id
      return res.status(200).json(filter);
    } catch (error) {
      return res.status(404).json({ message: "Fileter failed" });
    }
  }

  async createMonthlyBills(req, res) {
    const { user_id } = req;

    const startOfLastMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfLastMonth = moment()
      .subtract(1, "month")
      .endOf("month")
      .toDate();

    try {
      const billsUpdate = [];

      // get all bills are fixed or be repeated for this month
      const getAllBillsForLastMonth = await billsModel.find({
        user_id: user_id,
        buy_date: {
          $gte: startOfLastMonth,
          $lte: endOfLastMonth,
        },
        $or: [{ fixed: true }, { repeat: true }],
      });

      if (getAllBillsForLastMonth.length === 0) {
        console.error("Nenhuma conta fixa encontrada para o mês passado.");
      }

      // for each bill, create a new bill for this month
      let parcel = 0;
      let totalParcel = 0;

      for (const bill of getAllBillsForLastMonth) {
        if (bill.repeat) {
          parcel = parseInt(bill.installments.split("/")[0]);
          totalParcel = parseInt(bill.installments.split("/")[1]);
          if (parcel == totalParcel) continue;
        }

        const data = {
          user_id: user_id,
          bill_name: bill.bill_name,
          bill_category: bill.bill_category,
          bill_type: bill.bill_type,
          bill_value: bill.bill_value,
          buy_date: endOfLastMonth,
          fixed: bill.fixed,
          repeat: bill.repeat,
          installments: bill.repeat
            ? `${parcel + 1}/${totalParcel}`
            : bill.installments,
          payment_type: bill.payment_type,
        };

        const billCreated = await billsModel.create(data);
        billsUpdate.push(billCreated);
      }

      return res.status(200).json({
        message: "Monthly bills created successfullyy!",
        data: billsUpdate,
      });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  }
}

module.exports = new productController();
