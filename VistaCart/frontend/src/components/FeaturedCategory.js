import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
function FeaturedCategory() {

  const [catList, setCatList] = useState([]);

    useEffect(() => {
    fetchData();
  }, [])  
  
  const fetchData = () => {
    axios.get("http://localhost:8080/api/home/getAllFeaturedCategory")
      .then((response) => {
        // console.log(response.data)
        if (response.data) {
          setCatList(response.data.allFCategory);
        }
      })
  }

    const rows =
    catList.length > 0 ? (
      catList.map((cat) => (
        
        <tr key={cat._id}>
          <td>{cat.categoryName}</td>
          <td>{cat.link}</td>
          <td>
            <img className='m-2' src={`http://localhost:8080/Images/featured_categories_home/${cat.imagePath}`} height="100" />
          </td>
          <td>{cat.status == true ? "Active" : "Inactive"}</td>

          <td>

            <Link to="/AddUpdateFeaturedCategory" className='link-none-css' state={{ type: 'update', categoriesDetails: cat}}>
              <button className='btn btn-primary'>
                Update
              </button> &nbsp;
            </Link>
            <button className='btn btn-warning ml-2' onClick={() => handleStatusChange(cat._id, cat.status === true ? false : true )}>Change Status</button>
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
  
  const handleStatusChange = (id, newstatus) => {
        const formData = new FormData();
        formData.append("featuredCId", id);
        formData.append("status", newstatus);

        axios.defaults.withCredentials = true;

        axios.post("http://localhost:8080/api/home/updateCategoryStatus", formData,  {
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
   }

  return (
    <>
      <h1 className='text-center m-5'>Featured Category</h1>

      <div className='container mt-5 mb-5 text-center'>

        <Link to="/AddUpdateFeaturedCategory" state={{ type: 'new' }} className='admin-grid-section'>
            <button className='btn btn-success'>
              Add A Featured Category
            </button>
        </Link>
      </div>
      <div className="container">
          <table className="table table-striped table-dark mt-5">          
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Link</th>
                    <th scope="col">Category Image</th>
                    <th scope="col"> Status</th>
                    <th scope="col"> Update Record </th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
      </div>  
    </>
  )
}

export default FeaturedCategory