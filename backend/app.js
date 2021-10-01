require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');

require('./config/database').connect();
const devices = require('./routes/devices');

const express = require('express');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/devices', devices);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));