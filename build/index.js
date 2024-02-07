"use strict";
const expres = require('express');
const Loaders = require('../database');
const app = expres();
const routes = require('./routes');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });
Loaders.start();
app.use(cors({
    origin: '*'
}));
app.use(expres.json());
app.use(routes);
app.listen('3333', () => console.log('servidor de pé'));
