import React from 'react';
import '../css/featuredCatagories.css'; 

const categories = [
  {
    title: 'Men',
    image: 'http://localhost:8080/Images/featured_categories_home/men.png',
  },
  {
    title: 'Women',
    image: 'http://localhost:8080/Images/featured_categories_home/women.png',
  },
  {
    title: 'Shoes',
    image: 'http://localhost:8080/Images/featured_categories_home/shoes.png',
  },
  {
    title: 'Electronics',
    image: 'http://localhost:8080/Images/featured_categories_home/electronics.png',
  },
  {
    title: 'Clothes',
    image: 'http://localhost:8080/Images/featured_categories_home/clothes.png',
  },
  {
    title: 'Bags',
    image: 'http://localhost:8080/Images/featured_categories_home/bags.png',
  },
];

const FeaturedCategories = () => {
  return (
    <div className="featured-categories">
      {categories.map((category, index) => (
        <div className="category" key={index}>
          <div className="category-image">
            <img src={category.image} alt={category.title} />
          </div>
          <button className="category-button">{category.title}</button>
        </div>
      ))}
    </div>
  );
};

export default FeaturedCategories;
