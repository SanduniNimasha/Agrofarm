import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../services/productService';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <div>
      <h2>Product List</h2>
      <button onClick={() => navigate('/add')}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.quantity} - ${product.price}
            <button onClick={() => navigate(`/edit/${product._id}`)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
