// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from "../asset/logo1.png";

const Header = () => {
  return (
    <header className="header-container">
        <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul>
        
         
         
          
          
        </ul>
      </nav>
    </header>
  );
};

export default Header;
