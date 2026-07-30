// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const cors = require('cors')
const productController = require('./controllers/product.controller')



// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
    })
);

app.use(express.json())
app.use(morgan('dev'))



// Routes

app.get('/test',(req,res)=>{
  res.json({message: 'App Works'})
})

app.use('/products', productController)



module.exports = app