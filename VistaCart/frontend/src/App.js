import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import Header from './components/Header.js';
import Footer from './components/footer.js';
import Home from './components/Home.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import ContactUs from './components/ContactUs.js';
import Categories from './components/Categories.js';
import AddUpdateCategory from './components/AddUpdateCategory.js';
import AddUpdateSubCategory from './components/AddUpdateSubCategory.js';
import AddUpdateProduct from './components/AddUpdateProduct.js';
import ViewProduct from './components/ViewProduct.js';
import AdminDashboard from './components/AdminDashboard.js';
import Products from './components/products.js';
import SubCategories from './components/SubCategories.js';
import Brands from './components/Brands.js';
import AddUpdateBrand from './components/AddUpdateBrand.js';
import Shop from './components/Shop.js';
import Size from './components/Size.js';
import AddUpdateSize from './components/AddUpdateSize.js'; 
import ProductDetails from './components/ProductDetails.js'; 
import Quantity from './components/Quantity.js';
import AddUpdateQuantity from './components/AddUpdateQuantity.js'; 
import FeaturedProducts from './components/FeaturedProducts.js'; 
import FeaturedCategory from './components/FeaturedCategory.js'; 
import AddFeaturedProduct from './components/AddFeaturedProduct.js'; 
import AddUpdateFeaturedCategory from './components/AddUpdateFeaturedCategory.js'; 
import UpdateQuantity from './components/UpdateQuantity.js'; 

import React, { useState, useEffect } from 'react';
import axios from "axios";

function App() {

  // const [userType, setUserType] = useState(0);
  //   useEffect(() => {
    
  //   axios.get("http://localhost:8080/auth/userSession")
  //     .then((response) => {
  //       // setUserSession(!!(response && response.data));
  //       // console.log(response)
  //       if (response.data) {
  //         if (response.data.valid == true) {
  //           if (response.data.userType == "seller") {
  //             setUserType(2);
  //           } else if (response.data.userType == "admin") {
  //             setUserType(3);              
  //           } else {
  //             // customer
  //             setUserType(1);
  //           }
  //         } else {
  //           setUserType(0);
  //         } 
  //       } else {
  //         setUserType(0);
  //       }
  //      })
  //   }, [])
  
  //   const AdminDashboardRoute = () => {
  //   if (userType === 3) {
  //     return <AdminDashboard />;
  //   } else {
  //     // Redirect to another page or display a message for unauthorized access
  //     return <Navigate to="/" />;
  //   }
  // }; 

  const HeaderFooterRoute = () => (
  <>
    <Header />
      <Footer />
  </>
);
  return (
    <div className="App">
      <BrowserRouter>
        
        <Routes>
          
          <Route path="/" element={<HeaderFooterRoute />}>

            <Route index element={<Home />} />

            {/* <Route path="addEmployee" element={<AddEmployees />} /> */}
            
            {/* <Route path="/updateEmployee/:id" element={<UpdateEmployee/>}/> */}
            
            <Route path="/Login" element={<Login />} />
                                 
            <Route path="/Signup" element={<Signup />} />

            <Route path="/ContactUs" element={<ContactUs />} />

            <Route path="/viewProducts" element={<ViewProduct />} />

            <Route path="/adminDashboard" element={<AdminDashboard />} />
            
            <Route path="/Categories" element={<Categories />} />

            <Route path="/AddUpdateCategory" element={<AddUpdateCategory />} />

            <Route path="/Products" element={<Products />} />

            <Route path="/SubCategories" element={<SubCategories />} />
            
            <Route path="/Brands" element={<Brands />} />

            <Route path="/AddUpdateProduct" element={<AddUpdateProduct />} />

            <Route path="/AddUpdateSubCategory" element={<AddUpdateSubCategory />} />

            <Route path="/AddUpdateBrand" element={<AddUpdateBrand />} />

            <Route path="/Shop" element={<Shop />} />

            <Route path="/ProductDetails" element={<ProductDetails />} />

            <Route path="/Size" element={<Size />} />

            <Route path="/AddUpdateSize" element={<AddUpdateSize />} />

            <Route path="/Quantity" element={<Quantity />} />

            <Route path="/AddUpdateQuantity" element={<AddUpdateQuantity />} />

            <Route path="/FeaturedProducts" element={<FeaturedProducts />} />

            <Route path="/FeaturedCategory" element={<FeaturedCategory />} />

            <Route path="/AddFeaturedProduct" element={<AddFeaturedProduct />} />

            <Route path="/AddUpdateFeaturedCategory" element={<AddUpdateFeaturedCategory />} />
            
            <Route path="/UpdateQuantity" element={<UpdateQuantity />} />


            

          </Route>
        
        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;
