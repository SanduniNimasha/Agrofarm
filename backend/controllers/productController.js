const Product = require('../models/product');

// Add Product
exports.addProduct = async (req, res) => {
  const { itemcode,name, quantity, price } = req.body;
  try {
    const newProduct = new Product({ itemcode,name, quantity, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

// Edit Product
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { itemcode,name, quantity, price } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { itemcode,name, quantity, price },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error editing product', error });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};
