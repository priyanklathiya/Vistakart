import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const contentContainerStyle = {
  display: 'flex',
  maxWidth: '800px',
  width: '100%',
  marginTop: '20px',
};

const imageContainerStyle = {
  flex: '0 0 50%',
};

const imageStyle = {
  width: '80%',
  maxHeight: '400px',
  objectFit: 'fill',
  borderRadius: '8px',
};

const detailsContainerStyle = {
  flex: '0 0 50%',
  textAlign: 'left',
  padding: '0 20px',
};

const selectStyle = {
  marginTop: '10px',
  padding: '8px',
  width: '100%',
};

const buttonContainerStyle = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '10px',
};

function ProductDetails() {
  const [quantityList, setQuantityList] = useState([0]);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState([]);
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [quantityListLoading, setQuantityListLoading] = useState(false);
  const [quantityFetchError, setQuantityFetchError] = useState('');
  const [addToCartError, setAddToCartError] = useState('');

  const location = useLocation();
  const { productDetails } = location.state;
  const categoryId = productDetails.categoryId;

  let getSizeByCategory = (catId) => {
    let formData = new FormData();
    formData.append('categoryId', catId);

    axios.post('http://localhost:8080/api/size/getSizeByCategory', formData, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        window.scrollTo(0, 0);

        if (response.status === 200) {
          setSize(response.data.size);
        } else {
          console.error('Something went wrong. Sizes could not be fetched!');
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  let getQuantityBySizeAndProduct = (sizeId, sku) => {
    setQuantityListLoading(true);
    setQuantityFetchError('');

    const formData = new FormData();
    formData.append('sizeId', sizeId);
    formData.append('sku', sku);

    axios.post('http://localhost:8080/api/quantity/getQuantityBySizeAndProduct', formData, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        setQuantityListLoading(false);

        if (response.status === 200) {
          if (response.data.quantity) {
            setQuantity(response.data.quantity[0].quantity);
            const quantityArray = Array.from({ length: response.data.quantity[0].quantity + 1 }, (_, index) => index);
            setQuantityList(quantityArray);
          } else {
            setQuantity(0);
            setQuantityList([0]);
          }
        } else {
          setQuantityFetchError('Error fetching quantities. Please try again later.');
        }
      })
      .catch((err) => {
        setQuantityListLoading(false);
        setQuantityFetchError('Error fetching quantities. Please try again later.');
      });
  };

  useEffect(() => {
    if (categoryId) {
      getSizeByCategory(categoryId);
    }
  }, [categoryId]);

  const handleSizeChange = (e) => {
    const newSizeId = e.target.value;
    setSelectedSizeId(newSizeId);
    getQuantityBySizeAndProduct(newSizeId, productDetails.sku);
  };

  const handleQuantityChange = (e) => {
    setSelectedQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = () => {
    if (!selectedSizeId || !selectedQuantity) {
      setAddToCartError('Please select both size and quantity.');
      return;
    }

    // Add logic for adding to cart
    // ...

    // Clear the error message if successful
    setAddToCartError('');
  };

  const handleAddToWishlist = () => {
    // Add logic for adding to wishlist
    // ...
  };

  return (
    <div style={containerStyle}>
      <h2>{productDetails.productName}</h2>

      <div style={contentContainerStyle}>
        <div style={imageContainerStyle}>
          {productDetails.imagePath.imagePath2 !== 'default' || productDetails.imagePath.imagePath3 !== 'default' ? (
            <div id="imageCarousel" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                {[productDetails.imagePath.imagePath1, productDetails.imagePath.imagePath2, productDetails.imagePath.imagePath3]
                  .filter((image) => image !== 'default')
                  .map((image, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img
                        src={`http://localhost:8080/Images/products/${image}`}
                        alt={productDetails.productName}
                        style={imageStyle}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <img
              src={`http://localhost:8080/Images/products/${productDetails.imagePath.imagePath1}`}
              alt={productDetails.productName}
              style={imageStyle}
            />
          )}
        </div>

        <div style={detailsContainerStyle}>
          <p>SKU: {productDetails.sku}</p>
          <p>Quantity: {productDetails.quantity}</p>
          <p>Product Description: {productDetails.productDescription}</p>
          <p>Price: {productDetails.price}</p>

          <label htmlFor="sizeDropdown">Select Size:</label>
          <select id="sizeDropdown" style={selectStyle} value={selectedSizeId} onChange={handleSizeChange}>
            <option value="" disabled>
              Select Size
            </option>
            {size &&
              size.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.size}
                </option>
              ))}
          </select>

          {quantityListLoading && <p>Loading quantities...</p>}
          {quantityFetchError && <p>{quantityFetchError}</p>}

          {selectedSizeId && (
            <div>
              <label htmlFor="quantityDropdown">Select Quantity:</label>
              <select
                id="quantityDropdown"
                style={selectStyle}
                value={selectedQuantity}
                onChange={handleQuantityChange}
              >
                <option value="" disabled>
                  Select Quantity
                </option>
                {quantityList &&
                  quantityList.map((quantityItem) => (
                    <option key={quantityItem} value={quantityItem}>
                      {quantityItem}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {addToCartError && <p style={{ color: 'red' }}>{addToCartError}</p>}

          <div style={buttonContainerStyle}>
            <button style={buttonStyle} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button style={buttonStyle} onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
