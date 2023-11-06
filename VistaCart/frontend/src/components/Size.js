import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";

function Size() {
const [catList, setCatList] = useState([]);
const [categories, setCategories] = useState([]); 

  // fetch data for table
  useEffect(() => {
    fetchData();
    fetchAllCategories();
  }, [])  
  
  const fetchData = () => {
      axios.get("http://localhost:8080/api/size/getAllSize")
        .then((response) => {
          // console.log(response)
          if (response.data) {
            setCatList(response.data.allSize);
          }
        })
  }

    const fetchAllCategories = () => {
      axios.get("http://localhost:8080/api/category/getAllCategory")
        .then((response) => {
          // console.log(response)
          if (response.data) {
            setCategories(response.data.allCategory);
          }
        })
  }



const getCategoryById = (id) => {
  const category = categories.find((cat) => cat._id === id);

  if (category) {
    const categoryName = category.categoryName;
    return <div>{categoryName}</div>;
  } else {
    return <div>Category not found</div>;
  }
}
  

  const rows =
    catList.length > 0 ? (
      catList.map((cat) => (
        <tr key={cat._id}>
          <td>{getCategoryById(cat.categoryId)}</td>
          <td>{cat.size}</td>
          <td>
            <Link to="/AddUpdateSize" className='link-none-css' state={{ type: 'update', sizedata: cat }}>
              <button className='btn btn-primary'>
                Update
              </button> &nbsp;
            </Link>
            <button
                className='btn btn-danger ml-2'
                onClick={() => handleDeleteSize(cat._id)}
              >
              Delete
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={3} className="text-center">
          <b>No record found</b>
        </td>
      </tr>
    );
    
  const handleDeleteSize = (id) => {
    console.log(id);
    // return false;
    let sizeData = {
      sizeId: id,
    }

    axios.defaults.withCredentials = true;

    axios.post("http://localhost:8080/api/size/deleteSize", sizeData)
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
      <h1 className='text-center m-5'>Size</h1>

      <div className='container mt-5 mb-5'>

        <Link to="/AddUpdateSize" state={{ type: 'new' }} className='admin-grid-section'>
            <button className='btn btn-success'>
              Add A Size
            </button>
        </Link>
      </div>
      <div className="container">
            <table className="table table-striped table-dark mt-5">
                <thead>
                    <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Size</th>
                        <th scope="col">Update / Delete</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    </>
  )
}

export default Size