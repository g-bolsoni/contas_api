const startDb = require('./db.js');

class Loaders {
    start(){
        startDb();
    }
}

module.exports = new Loaders();