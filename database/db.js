const mongoose = require('mongoose');

async function startDb(){
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb+srv://giovane:dUVxWg7kTlVNXO3E@contas.hmapdie.mongodb.net/contas')
}

module.exports = startDb;