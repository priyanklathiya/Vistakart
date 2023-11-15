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
  const [gender, setGender] = useState(['male', 'female']);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchData();
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
  }, [selectedBrands, selectedCategories, selectedSubCategories, sortBy]);

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

  const genderList = gender.length > 0 ? (
    gender.map((g) => (
      <label key={g} className='m-1'>
        <input
          type="checkbox"
          value={g}
          checked={selectedSubCategories.includes(g)}
          onChange={() => handleSubCategoryChange(g)}
        />
        {g}
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
      <Link
        key={cat._id}
        to={`/ProductDetails?id=${cat._id}`} 
        className="link-none-css"
        state={{ productDetails: cat }}>
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

  const handleSortByChange = (selectedSortBy) => {
    setSortBy(selectedSortBy);
  };

  const handleSortButtonClick = () => {
    // Perform sorting logic based on the selected sorting option
    // ...

    // For demonstration purposes, let's assume you sort the products array here
    // You would need to modify this logic based on your actual data structure
    const sortedProducts = [...catList]; // Assuming catList is an array of products

    switch (sortBy) {
      case 'lowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'highToLow':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      // Add more cases as needed
      default:
        // 'featured' or any other default sorting logic
        break;
    }

    // Update the state with the sorted products
    setCatList(sortedProducts);
  };

  
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'lowToHigh', label: 'Price: Low to High' },
    { value: 'highToLow', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    // Add more sorting options as needed
  ];

  const sortByDropdown = (
    <select value={sortBy} onChange={(e) => handleSortByChange(e.target.value)}>
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="shop-container">
      <div className="filter-menu">
        
        <h5>Sort By:</h5>
         <hr />
        {sortByDropdown}
        <br />
        <br />
        <button className="filter-button" > Apply Sort </button>

        <br />
        <br />
        <hr />
        <h5>Filter - </h5>
        <hr />
        <h6>By Brands:</h6>
        {brandsList}
        <h6>By Categories:</h6>
        {categoriesList}
        <h6>By Subcategories:</h6>
        {subcategoryList}
        <h6>By Gender:</h6>
        {genderList}
        <button className="filter-button" onClick={handleSortButtonClick}> Apply Filter </button>
      </div>
      <div className="product-list">{productsList}</div>
    </div>
  );
}

export default Shop;
