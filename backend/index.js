const express = require('express');
const cors =require('cors');
const userRoute = require('./Routes/user');
const connection = require('./connection');
const categoryRoute = require('./Routes/category');
const app = express();
const productRouter = require('./Routes/product');
const billRouter = require('./Routes/bill');
const dashboardRouter = require('./Routes/dashboard');
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRouter);
app.use('/bill', billRouter);
app.use('/dashboard',dashboardRouter);


module.exports = app;