import React from 'react';
import '../css/featuredCatagories.css'; 
import { Link } from 'react-router-dom';

function FeaturedCategories(props) {

  
  return (
    <div className="featured-categories">
      {props.categoriesList.map((category, index) => (
        <div className="category" key={index}>
          <div className="category-image">
            <img src={`http://localhost:8080/Images/featured_categories_home/${category.imagePath}`} alt={category.categoryName} />
          </div>
          <Link to={`/Shop?category=${category.link}&categoryName=${category.categoryName}&categoryId=${category.categoryId}`} className="category-button">
            {category.categoryName}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default FeaturedCategories;
