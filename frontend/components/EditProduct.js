import React, { useEffect, useState } from 'react';
import { editProduct, getProducts } from '../services/productService';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', quantity: '', price: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      const products = await getProducts();
      const selectedProduct = products.find((p) => p._id === id);
      if (selectedProduct) setProduct(selectedProduct);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editProduct(id, product);
    navigate('/');
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={product.name} onChange={handleChange} required />
        <input type="number" name="quantity" value={product.quantity} onChange={handleChange} required />
        <input type="number" name="price" value={product.price} onChange={handleChange} required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditProduct;
