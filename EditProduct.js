import React, { useEffect, useState } from 'react';
import { updateProduct, getProducts } from '../services/productService';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css'; // Optional: Create a CSS file for custom styles
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ itemcode: '',name: '', quantity: '', price: ''  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const products = await getProducts();
      const selectedProduct = products.find((p) => p._id === id);
      if (selectedProduct) setProduct(selectedProduct);
    };
    fetchProduct();
  }, [id]);

  // Validate inputs
  const validate = () => {
    const errors = {};
    
    if (!product.itemcode) {
      errors.itemcode = "Item code is required";
      toast.error("Item code is required");
    }

    if (!product.name) {
      errors.name = "Product name is required";
      toast.error("Product name is required");
    }

     // Allow quantity to be 0, but ensure it's a valid number
  if (product.quantity === "") {
    errors.quantity = "Quantity is required";
    toast.error("Quantity is required");
  } else if (!/^\d+$/.test(product.quantity)) {
    errors.quantity = "Please enter a valid number for quantity";
    toast.error("Please enter a valid number for quantity");
  } else if (parseInt(product.quantity, 10) < 0) { // Allow 0 but not negative
    errors.quantity = "Quantity cannot be negative";
    toast.error("Quantity cannot be negative");
  }

    if (!product.price) {
      errors.price = "Price is required";
      toast.error("Price is required");
    } else if (!/^\d+(\.\d{1,2})?$/.test(product.price)) {
      errors.price = "Please enter a valid number for price";
      toast.error("Please enter a valid number for price");
    } else if (parseFloat(product.price) <= 0) {
      errors.price = "Price must be a positive number";
      toast.error("Price must be a positive number");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
      // Allow only numbers for quantity and price
  if ((name === "quantity" || name === "price") && !/^\d*\.?\d*$/.test(value)) {
    return;
  }

  // Prevent numbers in product name (Only allow letters and spaces)
  if (name === "name" && !/^[A-Za-z\s]+$/.test(value)) {
    toast.error("Product name should contain only letters and spaces", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return;
  }
    
    // Allow only numbers for quantity and price
    if ((name === "quantity" || name === "price") && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

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
      await updateProduct(id, product);
      toast.success("Product updated successfully!", {
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
      toast.error("Failed to update product. Please try again.", {
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
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form className="edit-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemcode">Item Code:</label>
          <input
            type="text"
            name="itemcode"
            id="itemcode"
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
            value={product.name}
            onChange={handleChange}
            // required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity (kg):</label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={product.quantity}
            onChange={handleChange}
            // required
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price(per 1kg):</label>
          <input
            type="text"
            name="price"
            id="price"
            value={product.price}
            onChange={handleChange}
            // required
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <button type="submit" className="submit-btn">Update Product</button>
      </form>

      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
    </div>
  );
};



const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const updatedProduct = { itemcode, name, quantity, price };

    await updateProduct(productId, updatedProduct);

    toast.success("Product updated successfully!");
    navigate("/products");
  } catch (error) {
    toast.error("Failed to update product. Try again.");
  }
};
export default EditProduct;