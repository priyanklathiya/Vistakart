import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ProductDetails() {
  const [quantityList, setQuantityList] = useState([]);
  const location = useLocation();
  const { productDetails } = location.state;

  // const [productDetails, setProductDetails] = useState({});

  // const urlParams = new URLSearchParams(window.location.search);
  // const productId = urlParams.get('id');
  // // console.log(urlParams.get('id'));

  // const fetchProductNames = (productId) => {
  //   axios.get(`http://localhost:8080/api/products/getProductById/${productId}`)
  //     .then((response) => {
  //       if (response.data) {
  //         const productName = response.data.product;
  //         console.log(productName);
  //         setProductDetails(response.data.product);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching product details:", error);
  //     });
  // };

  // useEffect(() => {
  //   console.log(productId);
  //   if (productId) {
  //     fetchProductNames(productId);
  //   }
  // }, [productId]);

  // console.log(productDetails);

  //   const fetchProductNames = (products) => {
  //   products.forEach((product) => {
  //     axios.get(`http://localhost:8080/api/products/getProductById/${product.productId}`)
  //       .then((response) => {
  //         if (response.data) {
  //           const productName = response.data.product.productName;
  //           setProductNames((prevProductNames) => ({
  //             ...prevProductNames,
  //             [product.productId]: productName,
  //           }));
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching product details:", error);
  //       });
  //   });
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const formData = new FormData();
  //       formData.append('sku', productDetails.sku);

  //       const response = await axios.post(
  //         'http://localhost:8080/api/quantity/getQuantityBySku',
  //         formData,
  //         {
  //           headers: { 'Content-Type': 'application/json' },
  //         }
  //       );

  //       if (response.status === 200) {
  //         setQuantityList(response.data.quantity);
  //       } else {
  //         alert('NO DATA FOUND!');
  //       }
  //     } catch (error) {
  //       alert('Error fetching data!');
  //     }
  //   };

  //   fetchData();

  // }, [productDetails.sku]);

  return (
    <>
      <div className='container'>
        <div>
          <img className='m-2' src={`http://localhost:8080/Images/products/${productDetails.imagePath.imagePath1}`} height="100" />
          {productDetails.imagePath.imagePath2 !== "default" ? (
            <img  className='m-2'
              src={`http://localhost:8080/Images/products/${productDetails.imagePath.imagePath2}`}
              alt={productDetails.productName}
              height="100"
            />
          ) : null}
          {productDetails.imagePath.imagePath3 !== "default" ? (
            <img  className='m-2'
              src={`http://localhost:8080/Images/products/${productDetails.imagePath.imagePath3}`}
              alt={productDetails.productName}
              height="100"
            />
          ) : null}
        </div>
        <div>
          <h2>{productDetails.productName}</h2>
          {productDetails ? (
            <div>
              <p>SKU: {productDetails.sku}</p>
              <p>Quantity: {productDetails.quantity}</p>
              <p>product Description: {productDetails.productDescription}</p>
              <p>price: {productDetails.price}</p>
            </div>
          ) : (
            <p>Error Displaying data. Please try again later!</p>
          )}
        </div>

        {/* <div>
          {quantityList.map((quantity, index) => (
            <div key={index}>
              <p>Size: {quantity.sizeId}</p>
              <label htmlFor={`quantity-${index}`}>Quantity:</label>
              <select
                id={`quantity-${index}`}
                value={quantity.quantity}
              >
                {[...Array(Math.min(quantity.quantity, 5)).keys()].map((q) => (
                  <option key={q + 1} value={q + 1}>
                    {q + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div> */}

      </div>
    </>
  );
}

export default ProductDetails;
