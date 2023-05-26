const productModel = require('../data/models/product.model');

const getAll = function (req, res) {
    res.status(200).json({ message: 'Retrived successfully', data: productModel.findAll() });
}

const getOne = function (req, res) {
    const productId = parseInt(req.params.productId);
    const product = productModel.findOne(productId);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        res.status(200).json({ message: 'Retrived successfully', data: product });
    }
}

const placeOrder = function (req, res) {
    const orderItems = req.body;
    productModel.updateStocks(orderItems);

    res.status(200).json({ message: 'Order placed successfully' });
}

module.exports = {
    getAll,
    getOne,
    placeOrder
};