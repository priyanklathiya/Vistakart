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
  const [gender, setGender] = useState([]);
  const [genderType, setGenderType] = useState(['male', 'female']);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);

    useEffect(() => {
    
    axios.get("http://localhost:8080/auth/userSession")
      .then((response) => {
        if (response.data) {
          if (response.data.valid == true) {
            // if session is true
            console.log(response.data);
          } else {
            // if session is false
          } 
        } else {
            // if session is false
          
        }
       })
  }, [])

  useEffect(() => {
    fetchData();
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
  }, [selectedBrands, selectedCategories, selectedSubCategories, sortBy, gender]);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/products/filterProducts', {
        brand: selectedBrands,
        categories: selectedCategories,
        gender: gender,
        sortBy: sortBy,
      });
      setProductsList(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/brands/getAllBrand');
      setBrandList(response.data.allbrand);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/category/getAllCategory');
      setCategoryList(response.data.allCategory);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/subcategory/getAllSubCategory');
      setSubCategoryList(response.data.allSubCategory);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
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

const genderList = genderType.length > 0 ? (
  <div>
    {genderType.map((g) => (
      <label key={g} className='m-1'>
        <input
          type="checkbox"
          value={g}
          checked={gender.includes(g)}
          onChange={() => handleGenderChange(g)}
        />
        {g}
      </label>
    ))}
  </div>
) : (
  <div></div>
);

const handleGenderChange = (selectedGender) => {
  setGender((prevGender) => {
    if (prevGender.includes(selectedGender)) {
      return prevGender.filter((g) => g !== selectedGender);
    } else {
      return [...prevGender, selectedGender];
    }
  });
};

  const handleViewEvent = (productDetails) => {
    return <Link to={`/products/${productDetails._id}`} state={productDetails}></Link>;
  };

  const handleSortByChange = (selectedSortBy) => {
    setSortBy(selectedSortBy);
  };

  const handleApplyFilterClick = () => {
    fetchData();
  };

  const sortOptions = [
    { value: 'lowToHigh', label: 'Price: Low to High' },
    { value: 'highToLow', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    // Add more sorting options as needed
  ];

  const sortByDropdown = (
    <select value={sortBy} onChange={(e) => handleSortByChange(e.target.value)}>
      <option value=''>Select</option>
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
        {/* <button className="filter-button" onClick={handleApplyFilterClick}>
          Apply Filter
        </button> */}
        <br />
        <br />
        <hr />
        <h5>Filter - </h5>
        <hr />
        <h6>By Brands:</h6>
        {brandsList}
        <h6>By Categories:</h6>
        {categoriesList}
        <h6>By Gender:</h6>
        {genderList}
        {/* <button className="filter-button" onClick={handleApplyFilterClick}>
          Apply Filter
        </button> */}
      </div>
      <div className="product-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          productsList.length > 0 ? (
            productsList.map((cat) => (
              <Link
                key={cat._id}
                to={`/ProductDetails?id=${cat._id}`}
                className="link-none-css"
                state={{ productDetails: cat }}
              >
                <div key={cat._id} className="product-card">
                  <div className="product-image">
                    <img
                      src={`http://localhost:8080/Images/products/${cat.imagePath.imagePath1}`}
                      alt={cat.productName}
                    />
                  </div>
                  <div className="product-details">
                    <h3 className="product-title"> {cat.productName} </h3>
                    <p className="product-info"> SKU: {cat.sku} </p>
                    <p className="product-price"> $ {cat.price} </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No products available.</p>
          )
        )}
      </div>
    </div>
  );
}

export default Shop;
