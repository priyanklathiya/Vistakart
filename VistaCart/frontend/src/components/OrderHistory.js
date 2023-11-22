import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userId, setUserId] = useState('');
  const [orderData, setOrderData] = useState(null);

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

  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        await axios.post("http://localhost:8080/api/order/getOrderHistoryByUser", {
          userId: userId,
        }).then((response) => {
            if (response.status === 200) {
                setOrderData(response.data.OrderHistory);
                console.log(response.data.OrderHistory);
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
      
  }, [isLoggedIn, userId]);

  return (
    <>
      <h1 className='text-center'>Order History</h1>
      <div className='container'>
        {orderData && orderData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Delivery Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderData.map((order, index) => (
                <tr key={index}>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>{order.deliveryStatus}</td>
                    <td>
                    <ul>
                        {order.orderDetails.map((item, itemIndex) => (
                        <li key={itemIndex}>
                            <strong>Product Name:</strong> {item.productName}, &nbsp;
                            <strong>Quantity:</strong> {item.quantity}, &nbsp;
                            <strong>Price:</strong> ${item.price.toFixed(2)}, &nbsp;
                            <strong>Size:</strong> {item.size}
                        </li>
                        ))}
                    </ul>
                    </td>
                    <td>
                    {/* Add any actions you want here */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No order history available.</p>
        )}
      </div>
    </>
  );
}

export default OrderHistory;
