import axios from 'axios';

// API URL - Make sure this URL matches your backend's endpoint
const API_URL = "http://localhost:5001/api/products";

// Fetch all products from the backend
export const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;  // Return the product data from the response
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;  // Rethrow the error so it can be handled in the calling component
    }
};

// Add a new product
export const addProduct = async (productData) => {
    try {
        const response = await axios.post(API_URL, productData);  // Send POST request to backend
        console.log('Product added successfully:', response.data);
        return response.data;  // Return the added product data
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;  // Rethrow the error to handle it in the calling component
    }
};

// Update an existing product
export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, productData);  // Send PUT request to backend
        return response.data;  // Return updated product data
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;  // Rethrow the error for handling in the calling component
    }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);  // Send DELETE request to backend
        console.log('Product deleted successfully');
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;  // Rethrow the error to handle it in the calling component
    }
};
