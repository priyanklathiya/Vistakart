import React from 'react';
import { useLocation } from 'react-router-dom';


function ProductDetails() {
    const location = useLocation()
  const { productDetails } = location.state
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
                
            </div>
      </>
  )
}

export default ProductDetails