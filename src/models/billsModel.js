const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const billsSchema = new Schema({
  id             : ObjectId,
  description    : String,
  category       : String,
  date           : Date,
  payment_methods: String,
  value          : Number,
  from_who       : String,
  situation      : String,
  date_ok        : String,
  repeat         : Boolean,
  parcel         : String,
  fixed          : Boolean
});


const  billsModel = mongoose.model('bills', billsSchema);
module.exports = billsModel;