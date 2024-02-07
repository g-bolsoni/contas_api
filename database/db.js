const mongoose = require('mongoose');

async function startDb(){
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD

    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb+srv://${username}:${password}@contas.hmapdie.mongodb.net/contas`)
}

module.exports = startDb;