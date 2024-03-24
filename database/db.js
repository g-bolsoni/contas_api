const mongoose = require('mongoose');

async function startDb() {
    // const username = process.env.MONGO_USERNAME;
    // const password = process.env.MONGO_PASSWORD
    // const url_conect = `mongodb+srv://${username}:${password}@contas.hmapdie.mongodb.net/contas`;

    const username = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const url_conect = `mongodb+srv://${username}:${password}@cluster0.iivdejq.mongodb.net/app`;

    mongoose.set('strictQuery', false);

    await mongoose.connect(url_conect)
        .then(() => console.log('conectou com sucesso'))
        .catch((err) => console.log(err));
}

module.exports = startDb;