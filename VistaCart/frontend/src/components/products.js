import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function Products() {

  const [catList, setCatList] = useState([]);


  // fetch data for table
  useEffect(() => {
    fetchData();
  }, [])  
  
  const fetchData = () => {
      axios.get("http://localhost:8080/api/products/getAllProducts")
        .then((response) => {
          // console.log(response.data)
          if (response.data) {
            setCatList(response.data.allProducts);
          }
        })
  }

  const handleView = (cat) => {
    
  }



  const baseUrl = 'http://localhost:8080/Images/products/';

  const rows =
    catList.length > 0 ? (
      catList.map((cat) => (
        
        <tr key={cat._id}>
          <td>{cat.productName}</td>
          <td>{cat.sku}</td>
          <td>{cat.quantity}</td>
          <td>
            <img className='m-2' src={`http://localhost:8080/Images/products/${cat.imagePath.imagePath1}`} height="100" />
          {cat.imagePath.imagePath2 !== "default" ? (
            <img  className='m-2'
              src={`http://localhost:8080/Images/products/${cat.imagePath.imagePath2}`}
              alt={cat.productName}
              height="100"
            />
            ) : null}
            

            {cat.imagePath.imagePath3 !== "default" ? (
            <img  className='m-2'
              src={`http://localhost:8080/Images/products/${cat.imagePath.imagePath3}`}
              alt={cat.productName}
              height="100"
            />
          ) : null}
          </td>
          <td>

            <Link to="/AddUpdateProduct" className='link-none-css' state={{ type: 'update', productDetails: cat}}>
              <button className='btn btn-primary'>
                Update
              </button> &nbsp;
            </Link>
            <button
                className='btn btn-danger ml-2'
                onClick={() => handleDeleteProduct(cat._id)}
              >
              Delete
            </button>
          </td>
          <td>

          </td>

        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={6} className="text-center">
          <b>No record found</b>
        </td>
      </tr>
    );
    
  const handleDeleteProduct = (id) => {
    // console.log(id);
    // return false;
    let productData = {
      pId: id,
    }

    axios.defaults.withCredentials = true;

    axios.post("http://localhost:8080/api/products/deleteProduct", productData)
      .then((response) => {
        // console.log(response);
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
  }
  
  return (
    <>
    <h1 className='text-center m-5'>Products</h1>

      <div className='container mt-5 mb-5 text-center'>

        <Link to="/AddUpdateProduct" state={{ type: 'new' }} className='admin-grid-section'>
            <button className='btn btn-success'>
              Add A Product
            </button>
        </Link>
      </div>
      <div className="container">
          <table className="table table-striped table-dark mt-5">          
            <thead>
                <tr>
                    <th scope="col">Product Name</th>
                    <th scope="col">SKU</th>
                    <th scope="col">quantity</th>
                    <th scope="col">Image</th>
                    <th scope="col"> Update / Delete</th>
                    <th scope="col"> Status </th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
      </div>      
    </>
  )
}

export default Products