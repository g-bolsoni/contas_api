const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const billsSchema = new Schema({
  id           : ObjectId,
  bill_name    : String,
  bill_category: String,
  bill_type    : String,
  buy_date     : String,
  payment_type : String,
  bill_value   : Number,
  repeat       : Boolean,
  installments : String,
  fixed        : Boolean
});


const  billsModel = mongoose.model('bills', billsSchema);
module.exports = billsModel;