import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";
import { jsPDF } from "jspdf"; // Correct import for jsPDF
import "jspdf-autotable"; // Correct import for the autoTable plugin
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import ConfirmationModal from './ConfirmationModal'; // Import the modal


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [productToDelete, setProductToDelete] = useState(null);  // Add this line to manage product deletion state

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = (id) => {
    setIsModalOpen(true);
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(productToDelete);
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsModalOpen(false); // Close the modal after the action is done
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Close the modal without doing anything
  };

  // 🔍 Filter products based on search query with null/undefined check
  const filteredProducts = products.filter(
    (product) =>
      (product.itemcode && product.itemcode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const logoURL = 'data:image/jpeg;base64,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'; 

  
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Define the logo as a base64 string (replace with your own base64 logo string)
    // const logo = 'data:assets/png;base64,./assets/1.png';
  
    // Add the logo (optional positioning and size)
    // doc.addImage(logo, 'PNG', 10, 10, 30, 30); // Add image (logo) at position x: 10, y: 10 with width: 30, height: 30
    

   
    
    // Add Company Name and Contact Info
    // Removed invalid JSX code
    doc.addImage(logoURL, 'PNG', 10, 10, 50, 50); // Resize the image to a smaller size if it's too large

    doc.setFontSize(18);
    doc.text("Your Company Name", 100, 40); // Add company name next to the logo

    doc.setFontSize(12);
    doc.text("Contact: +1 (123) 456-7890", 100, 45); // Add contact details below the company name

    doc.text("Email: contact@yourcompany.com", 100, 50); // Add email
    // Add padding by creating a blank space
    // doc.text(" ", 10, 35);
    

  // Add a break line
  doc.setDrawColor(0, 0, 0); // Set line color to black
  doc.setLineWidth(0.5); // Set line width
  doc.line(10, 60, 200, 60); // Draw a horizontal line from x: 10 to x: 200 at y: 35
    // Add title for the table
    doc.setFontSize(14);
    doc.text("Product List", 14, 70); // Title below header
  
    // Use autoTable to generate a table of products
    doc.autoTable({
      startY: 80, // Start the table after the title and logo
      head: [['Item Code', 'Name', 'Quantity', 'Price']],
      body: filteredProducts.map((product) => [
        product.itemcode,
        product.name,
        product.quantity,
        `$${product.price}`,
      ]),
    });
  
    // Save the PDF
    doc.save('product_list.pdf');
  
    // Show toast notification
    toast.success("PDF downloaded successfully!");
  };
  

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      
      {/* Search Input Field */}
      <input
        type="text"
        placeholder="Search by Item Code or Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <button onClick={() => navigate("/add")} className="add-product-btn">
        + Add Product
      </button>

      {/* Button to download PDF */}
      <button onClick={downloadPDF} className="download-pdf-btn">
        Download PDF
      </button>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p>No matching products found.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.itemcode}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>${product.price}</td>
                <td>
                  <button
                    onClick={() => {
                      navigate(`/edit/${product._id}`);
                      toast.info("Editing product..."); // Toast for editing
                    }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       {/* Confirmation Modal */}
       <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProductList;
