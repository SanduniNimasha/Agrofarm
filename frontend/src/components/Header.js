// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/product-list">Products</Link></li>
          <li><Link to="/add">Add Product</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
