import React, { Component, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import '../css/home.css';
import { Carousel } from 'react-responsive-carousel';
import header1 from '../images/HomeCarousel_3.jpg';
import header2 from '../images/homecarousel2.jpg';
import header3 from '../images/homecarousel3.avif';
import axios from "axios";
import '../css/carouselComponent.css';
import FeaturedCategories from './FeaturedCategories';


function Home() {

  // check user session from server using axios
  const [userSession, setUserSession] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);


  // fetch data for table
  useEffect(() => {
    fetchProductsData();
    fetchCategoriesData();
  }, [])  
  
  const fetchProductsData = () => {
    axios.get("http://localhost:8080/api/home/getActiveProduct")
      .then((response) => {
        // console.log(response.data)
        if (response.data) {
          setProductsList(response.data.allProducts);
        }
      })
  }

    const fetchCategoriesData = () => {
    axios.get("http://localhost:8080/api/home/getActiveCategories")
      .then((response) => {
        // console.log(response.data)
        if (response.data) {
          setCategoriesList(response.data.activeCategories);
        }
      })
  }


  return (
    <>
      <div className="carousel-container" >
      <Carousel
        dynamicHeight={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={1500}
        showThumbs={false}
      >
        <div>
          <img src={header1} alt="carouselimage1" />
          {/* <p className="legend">Legend 1</p> */}
        </div>
        <div>
          <img src={header2} alt="carouselimage2" />
          {/* <p className="legend">Legend 2</p> */}
        </div>
        <div>
          <img src={header3} alt="carouselimage3" />
          {/* <p className="legend">Legend 3</p> */}
        </div>
      </Carousel>
      </div>
      <div className='container container-banner-1 mt-5'>

        <h1 className='text-center'>OWN THE FLOOR</h1>
        <h3 className='text-center mt-3'>Show the world your style with iconic sneakers and fresh looks.</h3>
        <Link className='m-auto mt-4' to="/Shop">
          <button type="button" className="btn btn-dark">Shop</button>
        </Link>
        

      </div>
      
      <h2 className='text-center mt-5 mb-0'>Top Deals</h2>
        <br/>
      <div className="scroll-container">
        
        {productsList.map((product, index) => (
          <div className='product_image_slider' key={index}>
            <img src={`http://localhost:8080/Images/products/${product.imagePath.imagePath1}`} alt={product.productName.imagePath1} />
            <p className='sellerName'>{product.sellerName}</p>
            <p className='title'>{product.productName}</p>
            <p className='price'>$ {product.price}</p>
          </div>
        ))}
      </div>


      <div className="categories-section">
        <h2 className="text-center category-title">Categories</h2><hr className='text-dark'></hr>
        <FeaturedCategories categoriesList={categoriesList} />
      </div>

      <div className='background-black'>
          <h2 className='text-center heading'>Our Service</h2><hr className='text-dark'></hr>
        <div className="grid-container">
          <div className="grid-item">
              <h2> Quick and Easy Store Pickup</h2>
              <p>Convenient and fast pickup options for your orders.</p>
          </div>
          <div className="grid-item">
              <h2>Free Shipping over $35</h2>
              <p>Enjoy free shipping on orders over $35.</p>
          </div>
          <div className="grid-item">
              <h2>Low Price Guarantee</h2>
              <p>We guarantee the lowest prices on our products.</p>
          </div>
          <div className="grid-item">
              <h2>New Deals Every day</h2>
              <p>Discover exciting new deals and discounts daily.</p>
          </div>
          
          <div className="grid-item">
              <h2>Quick and Easy Returns</h2>
              <p>Hassle-free returns for a seamless shopping experience.</p>
          </div>
          
          <div className="grid-item">
              <h2>Contact Us</h2>
            <p>
              Reach out to us if you have any concerns.
              <br/><br/>
                <Link className='m-auto' to="/ContactUs">
                  <button type="button" className="btn btn-dark">Contact Us</button>
                </Link>
              </p>
          </div>
        </div>
      </div>

    </>
  )
}

export default Home