import React, { useState, useEffect, useRef  } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';

function AddUpdateQuantity() {
  const [successMsg, setSuccessMsg] = useState("");
  const [formErrors, setFormErrors] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const formRef = useRef();

  useEffect(() => {
        
    axios.get('http://localhost:8080/api/products/getAllProducts')
      .then((response) => {
          if (response.data) {
              setProducts(response.data.allProducts);
          }
      })
      .catch((error) => {
          console.error('Error fetching brands: ', error);
      });
    }, []);
  
  
  
  
  const HandleSubmitEvent = (e) => { }
  return (

  
    <>
      <div className='container mt-5'>
        {isSuccess && (
          <div className="alert alert-success m-3" role="alert">
              <b>Success!</b><br /> {successMsg}
          </div>
        )}
    
        {isFailed && (
          <div className="alert alert-danger m-3" role="alert">
              <b>Failed!</b><br /> {successMsg}
          </div>
        )}
        

        <h2 className='text-center'>Add / Update Quantity</h2>
        
        <form ref={formRef} onSubmit={HandleSubmitEvent} method="post" encType="multipart/form-data">
          <div className="form-group col-sm-6 margin-center">

            <label htmlFor="productId">Product:</label><br />
            <select
              className={`form-control ${formErrors && (formErrors?.selectedProduct ? "is-invalid" : "is-valid")}`}
                id="productId"
                name="productId"
                value={selectedProduct} 
                onChange={(e) => { setSelectedProduct(e.currentTarget.value); }}                         >
                <option value="">Select a Product</option>
                {products.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.productName}
                    </option>
                ))}
            </select>
            <div className="invalid-feedback">Please select a product.</div>
          </div>
          
        
        </form>

      </div>
      
    
    </>
  )
}

export default AddUpdateQuantity