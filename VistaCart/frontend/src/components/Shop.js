import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/shop.css'; 
function Shop() {
  const [catList, setCatList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  useEffect(() => {
    fetchData();
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:8080/api/products/getAllProducts').then((response) => {
      if (response.data) {
        setCatList(response.data.allProducts);
      }
    });
  };

  const fetchBrands = () => {
    axios.get('http://localhost:8080/api/brands/getAllBrand').then((response) => {
      if (response.data) {
        setBrandList(response.data.allbrand);
      }
    });
  };

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/category/getAllCategory').then((response) => {
      if (response.data) {
        setCategoryList(response.data.allCategory);
      }
    });
  };

  const fetchSubCategories = () => {
    axios.get('http://localhost:8080/api/subcategory/getAllSubCategory').then((response) => {
      if (response.data) {
        setSubCategoryList(response.data.allSubCategory);
      }
    });
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prevSelected) => {
      if (prevSelected.includes(brandId)) {
        return prevSelected.filter((id) => id !== brandId);
      } else {
        return [...prevSelected, brandId];
      }
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setSelectedSubCategories((prevSelected) => {
      if (prevSelected.includes(subCategoryId)) {
        return prevSelected.filter((id) => id !== subCategoryId);
      } else {
        return [...prevSelected, subCategoryId];
      }
    });
  };

  const brandsList = brandList.length > 0 ? (
    brandList.map((brand) => (
      <label key={brand._id} className='m-1'>
        <input
          type="checkbox"
          value={brand._id}
          checked={selectedBrands.includes(brand._id)}
          onChange={() => handleBrandChange(brand._id)}
        />
        {brand.brandName}
      </label>
    ))
  ) : (
    <div></div>
  );

  const categoriesList = categoryList.length > 0 ? (
    categoryList.map((category) => (
      <label key={category._id} className='m-1'>
        <input
          type="checkbox"
          value={category._id}
          checked={selectedCategories.includes(category._id)}
          onChange={() => handleCategoryChange(category._id)}
        />
        {category.categoryName}
      </label>
    ))
  ) : (
    <div></div>
  );

  const subcategoryList = subCategoryList.length > 0 ? (
    subCategoryList.map((subCategory) => (
      <label key={subCategory._id} className='m-1'>
        <input
          type="checkbox"
          value={subCategory._id}
          checked={selectedSubCategories.includes(subCategory._id)}
          onChange={() => handleSubCategoryChange(subCategory._id)}
        />
        {subCategory.subcategoryName}
      </label>
    ))
  ) : (
    <div></div>
  );

  const handleViewEvent = (productDetails) => {
    return <Link to={`/products/${productDetails._id}`} state={productDetails}></Link>;
  };

  const productsList = catList.length > 0 ? (
    catList.map((cat) => (
      <Link key={cat._id} to="/ProductDetails" className="link-none-css" state={{ productDetails: cat }}>
        <div key={cat._id} className="product-card">
          <div className="product-image">
            <img
              src={`http://localhost:8080/Images/products/${cat.imagePath.imagePath1}`}
              alt={cat.productName}
            />
          </div>
          <div className="product-details">
            <h3 className="product-title">{cat.productName}</h3>
            <p className="product-info">SKU: {cat.sku}</p>
            <p className="product-info">Quantity: {cat.quantity}</p>
          </div>
        </div>
      </Link>
    ))
  ) : (
    <div className="no-products-message">
      <p>No products available at the moment.</p>
    </div>
  );

  return (
    <div className="shop-container">
      <div className="filter-menu">
        <h5>Filter - </h5>
        <hr />
        <h6>By Brands:</h6>
        {brandsList}
        <h6>By Categories:</h6>
        {categoriesList}
        <h6>By Subcategories:</h6>
        {subcategoryList}
        <button className="filter-button">Go</button>
      </div>
      <div className="product-list">{productsList}</div>
    </div>
  );
}

export default Shop;
