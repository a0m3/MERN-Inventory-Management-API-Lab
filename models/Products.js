const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        mexLength: 500
    },
    category: {
        type: String,
        required: true,
        enum: ["Electronics", "Food", "Clothing", "Furniture", "Other"]
    },
    price: {
        type: Number,
        required: true,
        min: 0.1
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true })

const Products = model('Products', productSchema)

module.exports = Products