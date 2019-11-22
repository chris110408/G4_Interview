const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const cors = require('cors')

const customerMockData = require('./MockData/customers');
const userMockData = require('./MockData/user');
const routsCustomers = require('./routes/customers')

const app = express();

// Bodyparser Middleware
app.use(express.json());

// DB Config
const db = config.get('mongoURI');

// Connect to Mongo
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }) // Adding new mongo url parser
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes

app.get("/api/users",function (req,res) {


    var data = userMockData;
    if (data) {
        res.json(data);
    } else {
        res.status(400).json({ errors: { global: 'request errors -- no users data' } });
    }
})


app.get("/api/mock_customers",function (req,res) {
    var data = customerMockData;
    if (data) {
        res.json(data);
    } else {
        res.status(400).json({ errors: { global: 'request errors -- no customers data' } });
    }
})
app.use('/api/customers', routsCustomers);





module.exports = app;
