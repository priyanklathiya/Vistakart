import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";

function Brands() {

  const [catList, setCatList] = useState([]);

  // fetch data for table
  useEffect(() => {
    fetchData();
  }, [])  
  
  const fetchData = () => {
      axios.get("http://localhost:8080/api/brands/getAllBrand")
        .then((response) => {
          // console.log(response)
          if (response.data) {
            setCatList(response.data.allbrand);
          }
        })
  }

  const rows =
    catList.length > 0 ? (
      catList.map((cat) => (
        <tr key={cat._id}>
          <td>{cat.brandName}</td>
          <td>
            <Link to="/AddUpdateBrand" className='link-none-css' state={{ type: 'update', bName: cat.brandName, bId: cat._id }}>
              <button className='btn btn-primary'>
                Update
              </button> &nbsp;
            </Link>
            <button
                className='btn btn-danger ml-2'
                onClick={() => handleDeleteBrand(cat._id)}
              >
              Delete
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={2} className="text-center">
          <b>No record found</b>
        </td>
      </tr>
    );
    
  const handleDeleteBrand = (id) => {
    console.log(id);
    // return false;
    let brandData = {
      brandId: id,
    }

    axios.defaults.withCredentials = true;

    axios.post("http://localhost:8080/api/brands/deleteBrand", brandData)
      .then((response) => {
        console.log(response);
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
      <h1 className='text-center m-5'>Brands</h1>

      <div className='container mt-5 mb-5'>

        <Link to="/AddUpdateBrand" state={{ type: 'new' }} className='admin-grid-section'>
            <button className='btn btn-success'>
              Add A Brand
            </button>
        </Link>
      </div>
      <div className="container">
            <table className="table table-striped table-dark mt-5">
                <thead>
                    <tr>
                        <th scope="col">Brand Name</th>
                        <th scope="col">Update / Delete</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    </>
  )
}

export default Brands