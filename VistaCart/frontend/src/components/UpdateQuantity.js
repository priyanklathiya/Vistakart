import React, { useState, useEffect, useRef  } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';

function UpdateQuantity() {
    const [successMsg, setSuccessMsg] = useState("");
    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [sku, setSku] = useState("");
    const [productId, setProductId] = useState("");
    const formRef = useRef();
    const [productDetails, setProductDetails] = useState(null); 
    const [size, setSize] = useState(null); 
    const [quantityData, setQuantityData] = useState({}); // State to store quantity for each size
    const [catList, setCatList] = useState([]);

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
                // productDetails = response.data.product;
            setProductDetails(response.data.product);
            getSizeByCategory(response.data.product.categoryId);
            setProductId(response.data.product._id);
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

        axios
        .post('http://localhost:8080/api/quantity/getQuantityBySku', formData, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            if (response.status === 200) {
            // const newQuantityData = {};

            //     size.forEach((sizeItem) => {
            //         const matchingQuantity = response.data.find((item) => item.sizeId === sizeItem._id);
            //         newQuantityData[sizeItem._id] = matchingQuantity ? matchingQuantity.quantity : '0';
            // });

            // setQuantityData(newQuantityData);
                setCatList(response.data.quantity);
                
            } else {
            alert('NO DATA FOUND!');
            }
        })
        .catch((err) => {
            alert('NO DATA FOUND!');
        });

    }
    
    let getSizeByCategory = (catId) => {
    
    let formData = new FormData(); 
    formData.append("categoryId", catId);

      axios.post("http://localhost:8080/api/size/getSizeByCategory", formData,{headers:{"Content-Type" : "application/json"}})
      .then((response) => { 
        window.scrollTo(0, 0);
        
        if (response.status === 200) {
          // productDetails = response.data.product;
          setSize([]);
          setSize(response.data.size);

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
        
            // Validate that at least one quantity field has a non-zero value
            const hasNonZeroQuantity = Object.values(quantityData).some((value) => parseInt(value, 10) > 0);

        if (!hasNonZeroQuantity) {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg('Please enter atleast one quantity that is greater than zero.');
            return;
        }

        // Check if any value is not negative or not an integer
        const nonIntegerValues = Object.entries(quantityData).filter(([sizeId, value]) => {
            const parsedValue = parseInt(value, 10);
            return isNaN(parsedValue) || parsedValue < 0;
        });

        if (nonIntegerValues.length > 0) {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg('Please enter positive integer values for all quantity fields.');
            return;
    }



    // Validate total quantity not greater than productDetails.quantity
    const totalQuantity = Object.values(quantityData).reduce((acc, curr) => acc + parseInt(curr, 10), 0);
    if (totalQuantity > productDetails.quantity) {
      setIsSuccess(false);
      setIsFailed(true);
      setSuccessMsg('Total quantity exceeds the available quantity.');
      return;
    } else {
      setIsFailed(false);
    }

    const formData = new FormData();
    formData.append('sku', sku);
  
    // Ensure all sizes are included in the form data, even if their value is 0
    // Create an array of size values
    const sizeData = [];
    for (const sizeItem of size) {
        const sizeId = sizeItem._id;
        const quantity = quantityData[sizeId] || '0'; // Default to '0' if no quantity is provided
        sizeData.push({ sizeId, quantity });
    }

  // Append the size data array to the form data
  formData.append('sizeData', JSON.stringify(sizeData));

    formData.append("productId", productId);
  axios.post("http://localhost:8080/api/quantity/addQuantity", formData,{headers:{"Content-Type" : "application/json"}})
    .then((response) => { 
        window.scrollTo(0, 0);
        if (response.status === 200) {
          if (response.data.status === 1) {
            setIsSuccess(true);
            setIsFailed(false);                          
            setSuccessMsg(response.data.msg);
            setProductDetails(null);
          }
          else {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg(response.data.msg);
          }
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
  
    };

// const handleQuantityChange = (sizeId, value) => {
//   // Update the quantityData state when quantity input fields change
//   const updatedQuantityData = {
//     ...quantityData,
//     [sizeId]: value,
//   };

//   // Check if the input value is empty or not provided and set it to 0
//   if (!value || value.trim() === '') {
//     updatedQuantityData[sizeId] = '0';
//   }

//   setQuantityData(updatedQuantityData);
    // }
    const handleQuantityChange = (sizeId, value) => {
        // Create a new object to represent the updated quantity data
        const updatedQuantityData = { ...quantityData };

        // Update the quantity for the specified sizeId
        updatedQuantityData[sizeId] = value;

        // Check if the input value is empty or not provided and set it to 0
        if (!value || value.trim() === '') {
            updatedQuantityData[sizeId] = '0';
        }

        // Update the quantityData state with the new data
        setQuantityData(updatedQuantityData);
    };

  
    
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
              
        
              <h2 className='text-center'>Update Quantity</h2>

              {!productDetails ? (
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

              ) : null}
              

              {productDetails && (
                  <form className='m-2' ref={formRef} onSubmit={HandleSubmitEvent} method="post">
                      <div className="form-group col-sm-6 margin-center">
                          <label>Product Name : </label> &nbsp;&nbsp;&nbsp;
                          <label htmlFor="productName"> {productDetails.productName} </label><br />
                      </div>

                      <div className="form-group col-sm-6 margin-center">
                          <label>Total Maximum Quantity : </label> &nbsp;&nbsp;&nbsp;
                          <label htmlFor="quantity"> {productDetails.quantity} </label><br />
                      </div>

                      {size && size.length > 0 && (
                          <div className='form-group col-sm-6 margin-center'>
                              <label>Add quantity :</label>
                              <br />
                              {size.map((sizeItem) => {
                                  // Find the quantity data for the current sizeItem from catList
                                  const quantityItem = catList.find((item) => item.sizeId === sizeItem._id);

                                  return (
                                      <div className='form-group row mt-2' key={sizeItem._id}>
                                          <label className='col-sm-2'>Size {sizeItem.size} :</label>
                                          <div className='col-sm-6'>
                                              <input
                                                  type='number'
                                                  className='form-control'
                                                  value={quantityItem ? quantityItem.quantity : ''}
                                                  onChange={(e) => handleQuantityChange(sizeItem._id, e.target.value)}
                                                  placeholder='add quantity'
                                              />
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                      <div className='col-sm-6 margin-center'>
                          <button type="submit" className="btn btn-primary mt-2 mb-4"> Submit </button>
                      </div>
            
                  </form>
              )}
          </div>  
      </>

  )
}

export default UpdateQuantity