import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

function FeaturedProducts() {
  const [catList, setCatList] = useState([]);
  const [productNames, setProductNames] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:8080/api/home/getAllFeaturedProduct")
      .then((response) => {
        if (response.data) {
          setCatList(response.data.allFProduct);
          fetchProductNames(response.data.allFProduct);
        }
      })
      .catch((error) => {
        console.error("Error fetching featured products:", error);
      });
  };

  const fetchProductNames = (products) => {
    products.forEach((product) => {
      axios.get(`http://localhost:8080/api/products/getProductById/${product.productId}`)
        .then((response) => {
          if (response.data) {
            const productName = response.data.product.productName;
            setProductNames((prevProductNames) => ({
              ...prevProductNames,
              [product.productId]: productName,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
        });
    });
  };

  const rows =
    catList.length > 0 ? (
      catList.map((cat) => (
        <tr key={cat._id}>
          <td> {cat.productId} </td>
          <td>{productNames[cat.productId] || 'Loading...'}</td>
          <td> {cat.status === true ? "Active" : "Inactive"}</td>
          <td>
            <button className='btn btn-warning ml-2' onClick={() => handleStatusChange(cat._id, cat.status === true ? false : true )}>Change Status</button>
          </td>
          <td>
            <button className='btn btn-danger ml-2' onClick={() => handleDelete(cat._id)}>Delete</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5} className="text-center">
          <b>No record found</b>
        </td>
      </tr>
    );

    const handleStatusChange = (id, newstatus) => {

        const formData = new FormData();
        formData.append("featuredPId", id);
        formData.append("status", newstatus);

        axios.defaults.withCredentials = true;

        axios.post("http://localhost:8080/api/home/updateProductStatus", formData,  {
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
            if (response.status === 200) {
                if (response.data.status === 1) { 
                    alert('Status Successfully');
                    fetchData();
                }
            } else {
                alert('Error in updating Status');
            }
        }).catch((err) => { 
            console.error(`An error occurred: ${err}`);
        })
    };
    

    const handleDelete = (id) => {

        const formData = new FormData();
        formData.append("featuredPId", id);

        axios.defaults.withCredentials = true;

        axios.post("http://localhost:8080/api/home/deleteFeaturedProduct", formData,  {
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
            if (response.status === 200) {
                if (response.data.status === 1) { 
                    alert('Data Deleted Successfully');
                    fetchData();
                }
            } else {
                alert('Error in deleting data');
            }
        }).catch((err) => { 
            console.error(`An error occurred: ${err}`);
        })
    };
    
  return (
    <>
      <h1 className='text-center m-5'>Featured Product</h1>

      <div className='container mt-5 mb-5'>
        <Link to="/AddFeaturedProduct" state={{ type: 'new' }} className='admin-grid-section'>
          <button className='btn btn-success'>Add A Product</button>
        </Link>
      </div>
      <div className="container">
        <table className="table table-striped table-dark mt-5">
          <thead>
            <tr>
              <th scope="col"> ProductId </th>
              <th scope="col"> Product Name </th>
              <th scope="col"> Status </th>
              <th scope="col"> Change Status </th>
              <th scope="col"> Delete </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </>
  );
}

export default FeaturedProducts;
