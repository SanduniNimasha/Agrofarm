import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';

const App = () => {
  return (
    <Router>
      {/* Header is displayed on all pages */}
      <Header />

      <div className="content-container">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
        </Routes>
      </div>

      {/* Footer is displayed on all pages */}
      <Footer />
    </Router>
  );
};

export default App;
