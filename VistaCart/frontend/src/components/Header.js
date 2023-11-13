import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../css/header.css';
import Logo from '../images/vistacartlogomini.png';
import axios from "axios";
import '../css/admindashboard.css';

const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [userType, setUserType] = useState(0);
  // 0 if not logged in
  // 1 if logged in && customer
  // 2 if logged in && seller
  // 3 if logged in && admin

  axios.defaults.withCredentials = true;
    
  useEffect(() => {
    
    axios.get("http://localhost:8080/auth/userSession")
      .then((response) => {
        // setUserSession(!!(response && response.data));
        // console.log(response)
        if (response.data) {
          if (response.data.valid == true) {
            if (response.data.userType == "seller") {
              setUserType(2);
            } else if (response.data.userType == "admin") {
              setUserType(3);              
            } else {
              // customer
              setUserType(1);
            }
          } else {
            setUserType(0);
          } 
        } else {
          setUserType(0);
        }
       })
  }, [])

  const toggleNavVisibility = () => {
    setIsNavVisible(prevState => !prevState);
  };

    const logout = () => {
    axios.get('http://localhost:8080/auth/logout')
      .then(response => {
        // console.log(response);
        setUserType(0);  // userType 0 means not logged in
        window.location.href = '/';  // Redirect to home page after successful logout
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  };

    return (
      <>
    <header className="header">
      <div className="header-container">
        {/* <Link to="/">
          <img className="logo" src={Logo} alt="Vista cart Logo" />
        </Link> */}
         <Link to="/" className='header-link'> VISTACART </Link>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button>Search</button>
        </div>
        <div className={`menu-icon ${isNavVisible ? 'active' : ''}`} onClick={toggleNavVisibility}>
          <i className="fa fa-bars"></i>
        </div>            
          </div>
          
          <nav className={`nav-links ${isNavVisible ? 'visible' : ''}`}>

            {userType == 3 ? (
              <Link to="/adminDashboard">AdminDashboard</Link>
            ) : ""}

            {userType === 0 || userType === 1 ? <Link to="/">Home</Link> : "" }

            {(userType === 0 || userType === 1) ? (
            
            <Link to="/Shop">Shop</Link>
              // <div className="categories-dropdown">
              //   <button className="categories-button">Categories</button>
              //   <div className="categories-content">
              //     <Link to="/" className="category-link">Men</Link>
              //     <Link to="/" className="category-link">Women</Link>
              //   </div>
              // </div>
            
            ) : ""}
            
            {/* {(userType == 3) ? (
              <div className="categories-dropdown">
              <button className="categories-button">Products</button>
              <div className="categories-content">
                <Link to="/viewProducts" className="category-link">View</Link>
                <Link to="/addProduct" className="category-link">Add</Link>
              </div>
            </div>
            ) : ""} */}

            {userType === 0 || userType === 1 ? (
              <Link to="/" className="cart-link">Cart</Link>
            ) : ""}

            {userType != 0 ? (
              <a href="#" onClick={logout} className="login-link">Logout</a>
            ) : ""}

            {userType == 0 ? (
              <Link to="/Login" className="login-link">Sign Up/Login</Link>              
            ) : ""}

            {userType != 3 ? (
              <Link to="/ContactUs" className="login-link">Contact Us</Link>
            ) : ""}

          </nav>
        </header>
        {userType === 3 ? (
          <div className='admin-panel'>
            <div className='vertical-nav'>
              <ul>
                <li>
                  <Link to="/Categories">
                      Categories
                  </Link>
                </li>
                <li>
                  <Link to="/SubCategories">
                      Sub-Categories
                  </Link>
                </li>
                <li>
                  <Link to="/Brands">
                      Brands
                  </Link>
                </li>
                <li>
                  <Link to="/Products">
                      Products
                  </Link>
                </li>
                <li>
                  <Link to="/Size">
                      Size
                  </Link>
                </li>
                <li>
                  <Link to="/Quantity">
                      Quantity
                  </Link>
                </li>
                <li>
                  <Link to="/FeaturedProducts">
                      Featured Products
                  </Link>
                </li>
                <li>
                  <Link to="/FeaturedCategory">
                      Featured Categories
                  </Link>
                </li>
              </ul>
            </div>
          </div>   
          ) : ""}
        <main className="admin-content">
    <Outlet />
  </main>
      </>
  );
};

export default Header;
