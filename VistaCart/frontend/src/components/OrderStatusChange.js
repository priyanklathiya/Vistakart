import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
function OrderStatusChange() {

    const history = useNavigate();
    const [successMsg, setSuccessMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userId, setUserId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(''); 

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
                    window.location.href = '/Login';
                }
            } else {
                setIsLoggedIn(false);
                window.location.href = '/Login';
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
            setIsLoggedIn(false);
            window.location.href = '/Login';
        }
        }

        fetchUserSession();
        
    }, []);

    const location = useLocation();
    const orderId = new URLSearchParams(location.search).get('orderId');

    

    useEffect(() => {
    async function fetchOrderHistory() {
      try {
        await axios.post("http://localhost:8080/api/order/getOrderById", {
          orderId: orderId ,
        }).then((response) => {
            if (response.status === 200) {
                setOrderData(response.data.OrderDetails[0]);
                setOrderDetails(response.data.OrderDetails[0].orderDetails);
            } else {
                console.error('Error fetching order history');
                setOrderData(null);
            }
        });
      } catch (error) {
        console.error('Error fetching order history:', error);
        setOrderData(null);
      }
    }

      if (isLoggedIn) {
          fetchOrderHistory();
      }
      
    }, [isLoggedIn], orderId);
    
    const handleStatusChange = async (e) => {
        e.preventDefault();

        try {
        // Send the updated status to the server
        await axios.post("http://localhost:8080/api/order/updateOrderStatus", {
            orderId: orderId,
            statusCode: selectedStatus,
        }).then((response) => { 
          if (response.status && response.status === 200) {
              // redirect 
              if (orderData.statusCode == '0') {
                   history(`/PendingOrders`);
              } else if (orderData.statusCode == '2') {
                   history(`/NotApprovedOrders`);
              } else {
                   history(`/ApprovedOrders`);
              }
          } else {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg('Cannot update data. Contact Administrator.');
          }
        });
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg('Cannot update data. Contact Administrator.');
        } catch (error) {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg('Something went wrong. Please try again later!');
        }
    };
    

  return (
      <>
          <div className='container'>
              <div>
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
              </div>
              {orderData && orderDetails!='undefined' ? (
                  <div>
                      <div className='mt-3'>
                          <label><b>Order Date : </b> {orderData.orderDate}</label>
                      </div>
                      
                      <div  className='mt-3'>
                          <label><b>Total Amount : </b>{orderData.totalAmount}</label>
                      </div>
                      
                      <div  className='mt-3'>
                          <label><b>ShippingId : </b>{orderData.shippingId}</label>
                      </div>
                      
                      <div  className='mt-3'>
                          <label><b>userId : </b>{orderData.userId}</label>
                      </div>
                  </div>
                  
                ) : (
                      <p></p>
              )}
              
            {orderDetails && orderDetails.length > 0 ? (
                <table className='table mt-3'>
                    <thead>
                        <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Size</th>
                        <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.map((detail) => (
                        <tr key={detail._id}>
                            <td>{detail.productName}</td>
                            <td>{detail.quantity}</td>
                            <td>{detail.size}</td>
                            <td>{detail.price}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No order details available</p>
              )}
              
              <form className='mt-5'>
                <div className="mt-3 col-sm-4">
                    <label><b>Change Order Status:</b></label>
                    <select value={selectedStatus} className='form-control' onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        {orderData && orderData.statusCode !== '0' && <option value="0">Pending</option>}
                        {orderData && orderData.statusCode !== '1' && <option value="1">Approved</option>}
                        {orderData && orderData.statusCode !== '2' && <option value="2">Reject</option>}
                    </select>
                </div>

                <button className="btn btn-success mt-3" onClick={handleStatusChange}>
                    Submit
                </button>
              </form>
              
          </div>

          
      </>
  )
}

export default OrderStatusChange