import React, { useState, useRef  } from 'react';
import axios from "axios";
function AddFeaturedProduct() {
  const [successMsg, setSuccessMsg] = useState("");
  const [formErrors, setFormErrors] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [sku, setSku] = useState("");
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const formRef = useRef();
    

    
  let SearchProduct = (e) => { 
    e.preventDefault();
    let formErrors = {};
    formErrors = {
        sku: !sku
    };

    setIsSuccess(false);
    setIsFailed(false);
    setFormErrors({ ...formErrors });
    if (Object.values(formErrors).some((v) => v)) return;

    let formData = new FormData(); 
    formData.append("sku", sku);

    axios.post("http://localhost:8080/api/products/getProductBySku", formData,{headers:{"Content-Type" : "application/json"}})
      .then((response) => { 
        window.scrollTo(0, 0);
        
          if (response.status === 200) {
              setProductId(response.data.product._id);
              setProductName(response.data.product.productName);
              setProductImage(response.data.product.imagePath.imagePath1);
          } else {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg('Something went wrong. Please try again later!');
          }
      }).catch((err) => { 
          setIsSuccess(false);
          setIsFailed(true);
          setSuccessMsg(err.message);
      })
    }

const HandleSubmitEvent = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("productId", productId);

  axios
    .post("http://localhost:8080/api/home/addFeaturedProduct", formData, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      window.scrollTo(0, 0);
      if (response.status === 200) {
        if (response.data.status === 1) {
          setIsSuccess(true);
          setIsFailed(false);
          setSuccessMsg(response.data.msg);
          setProductId("");
          setProductName("");
          setProductImage("");
        } else {
          setIsSuccess(false);
          setIsFailed(true);
          setSuccessMsg(response.data.msg);
        }
      } else if (response.status === 400) {
        setIsSuccess(false);
        setIsFailed(true);
        setSuccessMsg("Product already exists.");
      } else {
        setIsSuccess(false);
        setIsFailed(true);
        setSuccessMsg("Something went wrong. Please try again later!");
      }
    })
    .catch((err) => {
      setIsSuccess(false);
      setIsFailed(true);
      setSuccessMsg(err.message);
    });
};

    
  return (
      <>
          <div className='container mt-5'>
          <h2 className='text-center'> Add Featured Product </h2>
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
              
              {!productId && (
                  <form ref={formRef} onSubmit={SearchProduct} method="post">
                      <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="productId">Product SKU: </label><br />
                        <input
                            type="text"
                            className={`form-control ${formErrors && (formErrors?.sku ? "is-invalid" : "is-valid")}`}
                            id="sku"
                            name="sku"
                            value={sku}
                            onChange={(e) => { setSku(e.currentTarget.value); }}
                            placeholder="Enter SKU" />
                        <div className="invalid-feedback">Please enter a valid SKU.</div>
                      </div>
                      <div className='col-sm-6 margin-center'>
                          <button type="submit" className="btn btn-warning mt-2 mb-4"> Search </button>                          
                      </div>
                  </form>
                  
              )}
              
              {productId && (
                  <form className='m-2' ref={formRef} onSubmit={HandleSubmitEvent} method="post">
                    <div className='col-sm-6 margin-center'>
                        <label className='font-weight-bold'> Product ID : </label>&nbsp;<label htmlFor="productId">{productId} </label><br />
                        <label className='font-weight-bold'> Product Name : </label>&nbsp;<label htmlFor="productName">{productName} </label><br />
                        <label className='font-weight-bold'> Product Image : </label>
                        &nbsp;
                        <img className='m-2'
                            src={`http://localhost:8080/Images/products/${productImage}`}
                            alt={productImage}
                            height="100"
                        />
                      </div>
                      <div className='col-sm-6 margin-center'>
                          <button type="submit" className="btn btn-primary mt-2 mb-4"> Submit </button>                          
                      </div>
                  </form>
                  
              )}
          </div>
      </>
  )
}

export default AddFeaturedProduct