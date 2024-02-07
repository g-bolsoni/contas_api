const express = require('express');
const Loaders = require('../database');
const app = express();
const routes = require('./routes');
const cors = require('cors');

require('dotenv').config({ path: '.env.local' });

Loaders.start();
app.use(cors({
    origin: '*'
}));

app.use(express.json())
app.use(routes);

app.listen('3333', () => console.log('servidor de pé'));