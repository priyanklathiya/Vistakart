import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userId, setUserId] = useState('');
  const [cartData, setCartData] = useState(null);
  const [message, setMessage] = useState(null);

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
    useEffect(() => {
        if (isLoggedIn) {
        fetchCartData();
        }
    }, [isLoggedIn, userId]);

  // Function to calculate the grand total
  const calculateGrandTotal = () => {
    return cartData.reduce((total, item) => total + item.totalPrice, 0);
    };
    
    const removeFromCart = async (productId, size) => {
        setMessage(null);
        try {
            await axios.post("http://localhost:8080/api/order/removeFromCart", {
                userId: userId,
                productId: productId,
                size:size
            }).then((response) => {
                if (response.status === 200 && response.data.status === 1) {
                    // Refresh the cart data after successful removal
                    fetchCartData();
                        setMessage({ text: response.data.message, type: 'success' });
                    
                    setTimeout(() => {
                        setMessage(null);
                    }, 4000);
                } else {
                    console.error('Error removing item from cart:', response.data.message);
                    setMessage({ text: response.data.message, type: 'error' });
                }
            });
        } catch (error) {
            console.error('Error removing item from cart:', error);
            setMessage({ text: 'Internal Server Error', type: 'error' });
        }
    };

    // Inside the Cart component
    const handleRemoveFromCart = (productId,size) => {
        if (window.confirm('Are you sure you want to remove this item from the cart?')) {
            removeFromCart(productId,size);
        }
    };

  return (
    <>
      {isLoggedIn === null && <p>Loading...</p>}
      {isLoggedIn === true && (
        <>
        
            <h1 className='text-center'> Cart </h1>

                  {message && (
                    <div className={`alert alert-${message.type}`} role="alert">
                        {message.text}
                    </div>
                  )}
                  
          <div className='container'>
            {cartData && cartData.length > 0 ? (
                <>
                    <Link to="/Checkout" className='link-none-css'>
                        <button className='btn btn-warning'>
                            Proceed to checkout
                        </button> &nbsp;
                    </Link>         
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Product Image</th>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Remove from cart</th>
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
                                <td><button className='btn btn-danger' onClick={() => handleRemoveFromCart(item.productId,item.size )}>Remove</button></td>
                            <td>${item.totalPrice.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="6" className="text-right"><strong>Grand Total:</strong></td>
                            <td>${calculateGrandTotal().toFixed(2)}</td>
                        </tr>
                        </tfoot>
                    </table>
                    <Link to="/Checkout" className='link-none-css'>
                        <button className='btn btn-warning'>
                            Proceed to checkout
                        </button> &nbsp;
                    </Link>
                </> 
                          
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
        </>
      )}
      {isLoggedIn === false && (
        <div className='text-center'>
          <h1 className='text-center'> Cart </h1>
          <p>Please log in to view your cart.</p>
        </div>
      )}
    </>
  );
}

export default Cart;
