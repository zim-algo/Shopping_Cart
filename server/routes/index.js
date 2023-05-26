const router = require('express').Router();
const userController = require('../controllers/user.controller');
const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');

router.route('/users/login')
.post(userController.login);

router.route('/products')
.get(authController.authenticate, productController.getAll);

router.route('/products/:productId')
.get(authController.authenticate, productController.getOne);

router.route('/products/place-order')
.post(authController.authenticate, productController.placeOrder);

module.exports = router;