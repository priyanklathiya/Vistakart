import React, { useState, useEffect, useHistory  } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Checkout() {
    const history = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userId, setUserId] = useState('');
    const [shippingId, setShippingId] = useState('');
    const [cartData, setCartData] = useState(null);
    const [shippingData, setShippingData] = useState(null);
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errors, setErrors] = useState({});
    // Shipping details state
    const [shippingDetails, setShippingDetails] = useState({
        firstName: '',
        lastName: '',
        address: '',
        zipCode: '',
        phone: '',
        city: '',
        province: '',
    });

    const [paymentDetails, setPaymentDetails] = useState({
        cardholderName: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });

    // Validation errors state
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        async function fetchUserSession() {
            try {
                const response = await axios.get("http://localhost:8080/auth/userSession");
                if (response.data) {
                if (response.data.valid === true) {
                    setUserId(response.data.userId);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
                } else {
                setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setIsLoggedIn(false);
            }
        }

        fetchUserSession();

    }, []);
    
    async function fetchCartData() {
      try {
        const response = await axios.post("http://localhost:8080/api/order/getCart", {
          userId: userId,
        });

        if (response.status === 200) {
          setCartData(response.data.cartDetails);
        } else {
          console.error('Error fetching cart data:', response.data.message);
          setCartData(null);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCartData(null);
      }
    }

    async function fetchShippingData() {
         try {
             await axios.post("http://localhost:8080/api/order/getShippingDetails", {
                 userId: userId,
             }).then((response) => { 
                 if (response.status === 200) {
                     if (response.data.shippingDetails && response.data.shippingDetails.length > 0) {
                        setShippingData(response.data.shippingDetails);
                     }
                } else if (response.status === 404) {
                    console.error('No data found');
                    setShippingData(null);
                } else {
                    console.error(response.data.error);
                    setShippingData(null);
                }
             });
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setShippingData(null);
      }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchCartData();
            // fetchShippingData();
        }
    }, [isLoggedIn, userId]);


    // Function to calculate the grand total
    const calculateGrandTotal = () => {
        return cartData.reduce((total, item) => total + item.totalPrice, 0);
    };

    // Function to handle form input changes
    const handleShippingInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
        }));
    };

    // Function to handle form submission
    const handleShippingFormSubmit = (e) => {
      
        e.preventDefault();

        // Validate form fields
        const errors = {};
        if (!shippingDetails.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        if (!shippingDetails.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        if (!shippingDetails.address.trim()) {
            errors.address = 'Address is required';
        }
        if (!shippingDetails.zipCode.trim()) {
            errors.zipCode = 'ZIP code is required';
        } else if (!/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(shippingDetails.zipCode)) {
            console.log(shippingDetails.zipCode);
            errors.zipCode = 'Invalid ZIP Code (Canada postal code)';
        }
        if (!shippingDetails.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(shippingDetails.phone)) {
            errors.phone = 'Phone number must be 10 digits';
        }
        if (!shippingDetails.city.trim()) {
            errors.city = 'City is required';
        }
        if (!shippingDetails.province.trim()) {
            errors.province = 'Province is required';
        }

        if (Object.keys(errors).length === 0) {
            // Form is valid, you can proceed with further actions
            // console.log('Form is valid:', shippingDetails);
            setValidationErrors({});

             const formData = new FormData();
            formData.append("userId", userId);
            // formData.append("shippingId", shippingId);
            formData.append("firstname", shippingDetails.firstName);
            formData.append("lastname", shippingDetails.lastName);
            formData.append("address", shippingDetails.address);
            formData.append("zipcode", shippingDetails.zipCode);
            formData.append("phone", shippingDetails.phone);
            formData.append("city", shippingDetails.city);
            formData.append("province", shippingDetails.province);
            formData.append("country", "Canada");

            axios.post("http://localhost:8080/api/order/addShippingDetails", formData, { headers: { "Content-Type": "application/json" } })
                .then((response) => { 
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            console.log(response.data.shippingData);
                            setShippingData(response.data.shippingData);
                            setShippingId(response.data.shippingData._id);
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg("Shipping Details Saved Successfully.");
                        }
                        else {
                            setIsSuccess(false);
                            setIsFailed(true);
                            setSuccessMsg("Cannot Save Shipping Details!");
                        }
                    } else {
                        setIsSuccess(false);
                        setIsFailed(true);
                        setSuccessMsg('Something went wrong. Please try again later!');
                    }
                    
                    setTimeout(() => {
                        setIsSuccess(null);
                        setIsFailed(null);
                        setSuccessMsg('');
                    }, 4000);

                }).catch((err) => { 
                    setIsSuccess(false);
                    setIsFailed(true);
                    setSuccessMsg(err.message);
                })

        } else {
            // Set validation errors
            setValidationErrors(errors);
        }
    };


  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
    
  const handlePaymentFormSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    const errors = {};
    if (!paymentDetails.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
    if (!paymentDetails.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    }
    if (!paymentDetails.expirationDate.trim()) {
      errors.expirationDate = 'Expiration date is required';
    }
    if (!paymentDetails.cvv.trim()) {
      errors.cvv = 'CVV is required';
    }

    if (Object.keys(errors).length === 0) {
      // Form is valid, you can proceed with further actions
    //   console.log('Form is valid:', paymentDetails);
        setValidationErrors({});
    } else {
      // Set validation errors
        //   console.log('Form validation errors:', errors);
        setValidationErrors(errors);
    }
    };
        
    const handlePlaceOrderClick = async () => { 
        if (!shippingId) {
            alert("Please select a shipping address");
            return false;
        }
            let formData = {
                userId: userId,
                shippingId: shippingId,
                cartData: cartData,
                totalAmount: calculateGrandTotal().toFixed(2)
            }
            axios.post("http://localhost:8080/api/order/createOrder", formData, { headers: { "Content-Type": "application/json" } })
                    .then((response) => { 
                        window.scrollTo(0, 0);
                        console.log(response.data)
                        if (response.status === 200) {
                            history('/OrderHistory');
                            
                            setIsSuccess(false);
                            setIsFailed(false);
                            setSuccessMsg("");
                        } else {
                            
                            setIsSuccess(false);
                            setIsFailed(true);
                            setSuccessMsg("Something went wrong.Could not place order.");
                        }
                        

                    }).catch((err) => { 
                        setIsSuccess(false);
                        setIsFailed(true);
                        setSuccessMsg("Something went wrong.Could not place order.");
                    })
        }
        
    return (
        <>
            <h1 className='text-center'>Checkout</h1>
            <hr />
            <div className='container p-2'>
                {isLoggedIn === true && (
                    <>
                        {isSuccess && (
                            <div className={`alert alert-success`} role="alert">
                                {successMsg}
                            </div>
                        )}

                        {isFailed && (
                            <div className={`alert alert-danger`} role="alert">
                                {successMsg}
                            </div>
                        )}

                        {message && (
                            <div className={`alert alert-${message.type}`} role="alert">
                                {message.text}
                            </div>
                        )}
                  
                        {cartData && cartData.length > 0 ? (                            
                            <>                                
                                <div>                                       
                                    <h3>1. Shipping details</h3>
                                    <form className='col-md-6' onSubmit={handleShippingFormSubmit}>
                                      {/* First Name */}
                                        <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                                            id="firstName"
                                            name="firstName"
                                            value={shippingDetails.firstName}
                                            onChange={handleShippingInputChange}
                                        />
                                        {validationErrors.firstName && (
                                            <div className="invalid-feedback">{validationErrors.firstName}</div>
                                        )}
                                        </div>

                                        {/* Last Name */}
                                        <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                                            id="lastName"
                                            name="lastName"
                                            value={shippingDetails.lastName}
                                            onChange={handleShippingInputChange}
                                        />
                                        {validationErrors.lastName && (
                                            <div className="invalid-feedback">{validationErrors.lastName}</div>
                                        )}
                                        </div>

                                        {/* Address */}
                                        <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
                                            id="address"
                                            name="address"
                                            value={shippingDetails.address}
                                            onChange={handleShippingInputChange}
                                        />
                                        {validationErrors.address && (
                                            <div className="invalid-feedback">{validationErrors.address}</div>
                                        )}
                                        </div>

                                        {/* ZIP Code */}
                                        <div className="mb-3">
                                        <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.zipCode ? 'is-invalid' : ''}`}
                                            id="zipCode"
                                            name="zipCode"
                                            value={shippingDetails.zipCode}
                                            onChange={handleShippingInputChange}
                                        />
                                        {validationErrors.zipCode && (
                                            <div className="invalid-feedback">{validationErrors.zipCode}</div>
                                        )}
                                        </div>

                                        {/* Phone Number */}
                                        <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                                            id="phone"
                                            name="phone"
                                            value={shippingDetails.phone}
                                            onChange={handleShippingInputChange}
                                        />
                                        {validationErrors.phone && (
                                            <div className="invalid-feedback">{validationErrors.phone}</div>
                                        )}
                                        </div>

                                        {/* City */}
                                        <div className="mb-3">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                                            id="city"
                                            name="city"
                                            value={shippingDetails.city}
                                            onChange={handleShippingInputChange}
                                        />
                                        {validationErrors.city && (
                                            <div className="invalid-feedback">{validationErrors.city}</div>
                                        )}
                                        </div>

                                        {/* Province */}
                                        <div className="mb-3">
                                        <label htmlFor="province" className="form-label">Province</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.province ? 'is-invalid' : ''}`}
                                            id="province"
                                            name="province"
                                            value={shippingDetails.province}
                                            onChange={handleShippingInputChange}
                                        />
                                        {validationErrors.province && (
                                            <div className="invalid-feedback">{validationErrors.province}</div>
                                        )}
                                      </div>
                                        <button type="submit" className='btn btn-success'>
                                            Save Shipping Details
                                        </button> &nbsp;
                                    </form> 
                                </div>
                                <div>
                                    <hr />        
                                    <h3>2. Payment details</h3>
                                    <form className='col-md-6' onSubmit={handlePaymentFormSubmit}>
                                    {/* Cardholder Name */}
                                    <div className="mb-3">
                                        <label htmlFor="cardholderName" className="form-label">Cardholder Name</label>
                                        <input
                                        type="text"
                                        className={`form-control ${validationErrors.cardholderName ? 'is-invalid' : ''}`}
                                        id="cardholderName"
                                        name="cardholderName"
                                        value={paymentDetails.cardholderName}
                                        onChange={handlePaymentInputChange}
                                        />
                                        {validationErrors.cardholderName && (
                                        <div className="invalid-feedback">{validationErrors.cardholderName}</div>
                                        )}
                                    </div>

                                    {/* Card Number */}
                                    <div className="mb-3">
                                        <label htmlFor="cardNumber" className="form-label">Card Number</label>
                                        <input
                                        type="text"
                                        className={`form-control ${validationErrors.cardNumber ? 'is-invalid' : ''}`}
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={paymentDetails.cardNumber}
                                        onChange={handlePaymentInputChange}
                                        />
                                        {validationErrors.cardNumber && (
                                        <div className="invalid-feedback">{validationErrors.cardNumber}</div>
                                        )}
                                    </div>

                                    {/* Expiration Date */}
                                    <div className="mb-3">
                                        <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                                        <input
                                        type="text"
                                        className={`form-control ${validationErrors.expirationDate ? 'is-invalid' : ''}`}
                                        id="expirationDate"
                                        name="expirationDate"
                                        value={paymentDetails.expirationDate}
                                        onChange={handlePaymentInputChange}
                                        />
                                        {validationErrors.expirationDate && (
                                        <div className="invalid-feedback">{validationErrors.expirationDate}</div>
                                        )}
                                    </div>

                                    {/* CVV */}
                                    <div className="mb-3">
                                        <label htmlFor="cvv" className="form-label">CVV</label>
                                        <input
                                        type="text"
                                        className={`form-control ${validationErrors.cvv ? 'is-invalid' : ''}`}
                                        id="cvv"
                                        name="cvv"
                                        value={paymentDetails.cvv}
                                        onChange={handlePaymentInputChange}
                                        />
                                        {validationErrors.cvv && (
                                        <div className="invalid-feedback">{validationErrors.cvv}</div>
                                        )}
                                    </div>

                                    <button type="submit" className='btn btn-success'>
                                        Save Payment Details
                                    </button> &nbsp;
                                    </form>
                                </div>  
                                <div>
                                    <hr /> 
                                    <h3>3. Review items and place order</h3>
                                </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Product Image</th>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartData.map((item, index) => (
                            <tr key={index}>
                            <td> <img src={`http://localhost:8080/Images/products/${item.imagePath.imagePath1}`} alt={item.productName} style={{ width: 'auto', height: '100px' }} /></td>   
                                <td>{item.productName}</td>
                                <td>{item.size}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                            <td>${item.totalPrice.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="5" className="text-right"><strong>Grand Total:</strong></td>
                            <td>${calculateGrandTotal().toFixed(2)}</td>
                        </tr>
                        </tfoot>
                    </table>
                              
                    <Link to="/Cart" className='link-none-css'>
                        <button className='btn btn-danger'>
                             Go to Cart
                        </button> &nbsp;
                    </Link>
                    <Link to="/Checkout" className='link-none-css'>
                        <button className='btn btn-warning' onClick={handlePlaceOrderClick}>                                        
                            Place your order                                        
                        </button>
                    </Link>
                </> 
                          
            ) : (
              <p>Your cart is empty.</p>
            )}
        </>
      )}
              {isLoggedIn === false && (
                <div className='text-center'>
                    <p>Please login to checkout.</p>
                </div>
              )}
          </div>
      </>
  )
}

export default Checkout