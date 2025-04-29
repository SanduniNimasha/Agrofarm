const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes with correct paths
router.post('/', productController.addProduct); // POST /api/products
router.put('/:id', productController.editProduct); // PUT /api/products/:id
router.delete('/:id', productController.deleteProduct); // DELETE /api/products/:id
router.get('/', productController.getAllProducts); // GET /api/products

module.exports = router;
