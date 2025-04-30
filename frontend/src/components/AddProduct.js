import React, { useState } from 'react';
import { addProduct } from '../services/productService';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css'; // Optional: Create a CSS file for custom styles
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const AddProduct = () => {
  const [product, setProduct] = useState({ name: '', quantity: '', price: '', itemcode: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate inputs
  const validate = () => {
    const errors = {};
    
    if (!product.itemcode) {
      errors.itemcode = "Item code is required";
      toast.error("Item code is required", {
        position: "top-right", 
        autoClose: 5000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
    }

    if (!product.name) {
      errors.name = "Product name is required";
      toast.error("Product name is required", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (!product.quantity || product.quantity <= 0) {
      errors.quantity = "Quantity must be a positive number";
      toast.error("Quantity must be a positive number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (!product.price || product.price <= 0) {
      errors.price = "Price must be a positive number";
      toast.error("Price must be a positive number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });

    // Validate on each change
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Display errors if validation fails
      return;
    }

    try {
      await addProduct(product);
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/');
    } catch (err) {
      toast.error("Failed to add product. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemcode">Item Code:</label>
          <input
            type="text"
            name="itemcode"
            id="itemcode"
            placeholder="Enter item code"
            value={product.itemcode}
            onChange={handleChange}
            // required
          />
          {errors.itemcode && <span className="error">{errors.itemcode}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleChange}
            // required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Enter quantity"
            value={product.quantity}
            onChange={handleChange}
            // required
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Enter price"
            value={product.price}
            onChange={handleChange}
            // required
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <button type="submit" className="submit-btn">Add Product</button>
      </form>

      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
