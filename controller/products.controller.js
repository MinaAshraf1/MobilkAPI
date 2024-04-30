const {validationResult} = require("express-validator");

const handleError = require("../middleware/handleError");
const Products = require("../models/products.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const getAllProducts = handleError(async (req, res, next) => {
    const products = await Products.find({}, {"__v": false});
    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {products}});
})

const recommended = handleError(async (req, res, next) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const products = await Products.find({"quantity": {$gt: 10}}, {"__v": false}).limit(limit).skip(skip);
    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {products}});
})

const getProduct = handleError(async (req, res, next) => {
    const id = req.params.id;

    const product = await Products.findById(id);

    if(!product) {
        const error = appError.create("Product Not Found", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {product}});
})

const addProduct = handleError(async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty) {
        const error = appError.create(errors.array(), 404, httpStatusText.FAIL);
        return next(error);
    }

    const {name, price, category, quantity} = req.body;

    const oldProduct = await Products.findOne({"name": name});

    if(oldProduct) {
        return next(appError.create("product already exists", 400, httpStatusText.FAIL));
    }

    const product = new Products({
        name,
        price,
        quantity,
        category,
        image: req.file.filename
    });
    await product.save();

    res.status(201).json({"status": httpStatusText.SUCCESS, "data": {product}});
})

const updateProduct = handleError(async (req, res, next) => {
    const id = req.params.id;

    const product = await Products.updateOne({"_id": id}, {$set: {"price": 1}});

    if(!product) {
        const error = appError.create("Product Not Found", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {product}})
})

const deleteProduct = handleError(async (req, res, next) => {
    const id = req.params.id;

    const product = await Products.deleteOne({"_id": id});

    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {product}})
})

module.exports = {
    getAllProducts,
    recommended,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
}