import React, { useState } from 'react';
import { addProduct } from '../services/productService';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [product, setProduct] = useState({ name: '', quantity: '', price: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(product);
    navigate('/');
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddProduct;
