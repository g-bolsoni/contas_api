const express = require('express');
const cors = require('cors');
const Loaders = require('../database');
const routes = require('./routes');

const app = express();

require('dotenv').config({ path: '.env.local' });

Loaders.start();
app.use(cors({
    origin: '*'
}));

app.use(express.json())
app.use(routes);

app.listen('3333', () => console.log('servidor de pé'));