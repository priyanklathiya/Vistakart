import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom'
function NotApprovedOrders() {
    
    const history = useNavigate();
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
    
    
    const columns = [
        {
            name: 'Order Date',
            selector: (row) => row.orderDate,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: (row) => row.totalAmount,
        },
        {
            name: 'Shipping Id',
            selector: (row) => row.shippingId,
        },
        {
            name: 'Status Code',
            selector: (row) => row.statusCode,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <button onClick={() => redirectToOrderStatusChange(row._id)}>Change Status</button>
            ),
        },
    ];
    

    useEffect(() => {
    async function fetchOrderHistory() {
      try {
        await axios.post("http://localhost:8080/api/order/getOrderHistoryByStatus", {
          statusCode: '2', // 2 - Rejected
        }).then((response) => {
            if (response.status === 200) {
                setOrderData(response.data.OrderHistory);
                // console.log(response.data.OrderHistory);
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

  
    function handleFilter(event) {
        const newData = orderData.filter((row) => {
        return row.date.toLowerCase().includes(event.target.value.toLowerCase());
        });
        setOrderData(newData);
    }
    
      // Function to redirect to orderStatusChange.js with _id
    const redirectToOrderStatusChange = (orderId) => {
        history(`/OrderStatusChange?orderId=${orderId}`);
    };

  return (
      <>
        <div className="container">
            {/* <div className="text-end">
            <input type="text" onChange={handleFilter} />
            </div> */}

            {orderData && orderData.length > 0 ? (
                <DataTable columns={columns} data={orderData} pagination fixedHeader />
            ) : (
                <p>No data available</p>
            )}
        </div>
    </>
  )
}

export default NotApprovedOrders