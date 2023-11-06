import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function SubCategories() {

  const [catList, setCatList] = useState([]);

  // fetch data for table
  useEffect(() => {
    fetchData();
  }, [])  
  
  const fetchData = () => {
      axios.get("http://localhost:8080/api/subcategory/getAllSubCategory")
        .then((response) => {
          // console.log(response)
          if (response.data) {
            setCatList(response.data.allSubCategory);
          }
        })
  }

  
  const rows =
    catList.length > 0 ? (
      catList.map((cat) => (
        <tr key={cat._id}>
          <td>{cat.subcategoryName}</td>
          <td>
            {/* <Link to={`/EditCategory/${cat.id}`}>
              <button className='btn btn-primary'>Update</button>
            </Link>  */}

            <Link to="/AddUpdateSubCategory" className='link-none-css' state={{ type: 'update', subcatName: cat.subcategoryName, subcatId: cat._id, catId: cat.categoryId  }}>
              <button className='btn btn-primary'>
                Update
              </button> &nbsp;
            </Link>
            <button
              
                className='btn btn-danger ml-2'
                onClick={() => handleDeleteSubCategory(cat._id)}
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
    
  const handleDeleteSubCategory = (id) => {
    // console.log(id);
    // return false;
    let categoryData = {
      subcategoryId: id,
    }

    axios.defaults.withCredentials = true;

    axios.post("http://localhost:8080/api/subcategory/deleteSubCategory", categoryData)
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
      <h1 className='text-center m-5'>Sub-categories</h1>

      <div className='container mt-5 mb-5'>

        <Link to="/AddUpdateSubCategory" state={{ type: 'new' }} className='admin-grid-section'>
            <button className='btn btn-success'>
              Add A Sub-Category
            </button>
        </Link>
      </div>
      <div className="container">
            <table className="table table-striped table-dark mt-5">
                <thead>
                    <tr>
                        <th scope="col">Sub-Category Name</th>
                        {/* <th scope="col">Category Name</th> */}
                        <th scope="col">Update / Delete</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    </>
  )
}

export default SubCategories