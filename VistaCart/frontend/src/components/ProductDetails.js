import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

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
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantityListLoading, setQuantityListLoading] = useState(false);
  const [quantityFetchError, setQuantityFetchError] = useState('');
  const [addToCartError, setAddToCartError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userId, setUserId] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState('');

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const location = useLocation();
  const productId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    axios.get("http://localhost:8080/auth/userSession")
      .then((response) => {
        if (response.data) {
          if (response.data.valid === true) {
            // if session is true
            // console.log(response.data);
// {valid: true, userType: 'customer', userId: '651dc8bee4e9a51b5866b906'}
            setUserId(response.data.userId);
            setIsLoggedIn(true);
          } else {
            // if session is false
            setIsLoggedIn(false);
          } 
        } else {
          // if session is false
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user session:', error);
        setIsLoggedIn(false);
      });
  }, []);

  useEffect(() => {
    fetchProductData(productId);
  }, [productId]);

  const [productDetails, setProductDetails] = useState(null);

  const fetchProductData = async (productId) => {
    try {
      const response = await axios.post('http://localhost:8080/api/products/getProductByPId', {
        productId: productId,
      });
      // console.log(response.data.product);

      setProductDetails(response.data.product);
      getSizeByCategory(response.data.product.categoryId);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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
    if (productDetails && productDetails.categoryId) {
      getSizeByCategory(productDetails.categoryId);
    }
  }, [productDetails]);

  const handleSizeChange = (e) => {
    const newSizeId = e.target.value;
    const newSizeValue = e.target.options[e.target.selectedIndex].text;

    setSelectedSizeId(newSizeId);
    getQuantityBySizeAndProduct(newSizeId, productDetails.sku);
    setSelectedSize(newSizeValue);
  };

  const handleQuantityChange = (e) => {
    setSelectedQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = async () => {
    setAddToCartMessage('');
    if (!selectedSizeId || !selectedQuantity) {
      setAddToCartError('Please select both size and quantity.');
      return;
    }

    if (isLoggedIn === false) {
      // Show the login modal
      // setShowLoginModal(true);
       handleShow()
    } else {
      // Clear the error message if successful
      setAddToCartError('');
      
      try {
        await axios.post('http://localhost:8080/api/order/addCart', {
          userId: userId,
          cartDetails: [{
            productId: productDetails._id,
            quantity: selectedQuantity,
            size: selectedSize,
            sizeId: selectedSizeId
          }]
        }).then((response) => { 
          if (response.status && response.status === 200) {
            // data added to cart
            setAddToCartMessage('Product added to cart successfully!');
          } else {
            // could not add data to cart
            setAddToCartMessage('Error adding product to cart. Please try again later.');
          }
        });
      } catch (error) {
        console.error('Error in inserting record to Cart : ', error);
        setAddToCartMessage('Error adding product to cart. Please try again later.');
      }

        // Set a timer to clear the message after 5 seconds (adjust as needed)
        setTimeout(() => {
          setAddToCartMessage('');
        }, 4000);
    }
  };

  const handleAddToWishlist = () => {
    if (isLoggedIn === false) {
      // Show the login modal
      handleShow();
    }
  };

  return (
    <div style={containerStyle}>
      <h2>{productDetails && productDetails.productName}</h2>

      <div style={contentContainerStyle}>
        <div style={imageContainerStyle}>
          {productDetails && (productDetails.imagePath.imagePath2 !== 'default' || productDetails.imagePath.imagePath3 !== 'default') ? (
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
              src={productDetails && `http://localhost:8080/Images/products/${productDetails.imagePath.imagePath1}`}
              alt={productDetails && productDetails.productName}
              style={imageStyle}
            />
          )}
        </div>

        <div style={detailsContainerStyle}>
          <p>SKU: {productDetails && productDetails.sku}</p>
          <p>Product Description: {productDetails && productDetails.productDescription}</p>
          <p>Price: {productDetails && productDetails.price}</p>

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
          {addToCartMessage && <p style={{ color: addToCartMessage.includes('success') ? 'green' : 'red' }}>{addToCartMessage}</p>}

          

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>You need to be logged in to perform this action. Please log in or sign up.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Link to="/Login" className="login-link">
              <Button variant="primary">
                Sign Up/Login
                </Button>
                </Link>  
            </Modal.Footer>
          </Modal>

          
        </div>
      </div>


    </div>
  );
}

export default ProductDetails;
