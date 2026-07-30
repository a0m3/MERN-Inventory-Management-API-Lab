const router = require('express').Router()
const Products = require('../models/Products')
const mongoose = require('mongoose')



router.post('/', async (req, res) => {
    try {
        const { title, description, category, price, quantity } = req.body

        const createdProduct = await Products.create({
            title,
            description,
            category,
            price,
            quantity
        })

        res.status(201).json(createdProduct)
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(500).json({ message: err.message })
    }
})


router.get('/', async (req, res) => {
    try {
        const allProducts = await Products.find()
        res.status(200).json(allProducts)
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(500).json({ message: err.message })
    }
})

router.get('/:productId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
            return res.status(404).json({ message: 'Product ID is not valid' })
        }
        const foundProduct = await Products.findById(req.params.productId)
        if (!foundProduct) {
            return res.status(404).json({ message: 'Product ID is not valid' })
        }
        res.status(200).json(foundProduct)
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(500).json({ message: err.message })
    }
})

router.put('/:productId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
            return res.status(404).json({ message: 'Product ID is not valid' })
        }
        const { title, description, category, price, quantity } = req.body
        const updatedProduct = await Products.findByIdAndUpdate(req.params.productId, { title, description, category, price, quantity }, { new: true, runValidators: true })
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product ID is not valid' })
        }
        res.status(200).json(updatedProduct)
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:productId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
            return res.status(404).json({ message: 'Product ID is not valid' })
        }
        const deletedProduct = await Products.findByIdAndDelete(req.params.productId)
        if (!deletedProduct) {
            return res.status(404).json({ message: 'No Product with this ID to delete' })
        }

        res.status(200).json(deletedProduct)
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(500).json({ message: err.message })
    }
})

module.exports = router