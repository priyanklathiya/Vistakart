import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom'
function AddUpdateSize() {
  const location = useLocation()
  const { type, sizedata } = location.state
// new or update
  const history = useNavigate();
    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [category, setCategory] = useState("");
    const [size, setSize] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [successMsg, setSuccessMsg] = useState("");

    const HandleSubmitEvent = (e) => {
      e.preventDefault();

        const formData = new FormData();
  if (type == "new") {
          
       const formErrors = {
            size: size.length === 0,
            category: !category
        };

        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });

        if (Object.values(formErrors).some((v) => v)) return;

        // formData.append("size", size);
      // formData.append("categoryId", category);
      size.forEach((sizeValue, index) => {
        formData.append(`size[${index}]`, sizeValue);
      });

      formData.append("categoryId", category);
            // new
          // console.log(formData);
          // return false;
            axios.post("http://localhost:8080/api/size/addSize", formData,{headers:{"Content-Type" : "application/json"}})
                .then((response) => { 
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                      if (response.data.status === 1) {
                        history("/Size");
                            // setIsSuccess(true);
                            // setIsFailed(false);
                            // setSuccessMsg(response.data.msg);
                            // setSize([]);
                            // setCategory("");
                        }
                        else {
                            setIsSuccess(false);
                            setIsFailed(true);
                            setSuccessMsg(response.data.msg);
                        }
                    } else {
                        setIsSuccess(false);
                        setIsFailed(true);
                        setSuccessMsg('Something went wrong. Please try again later!');
                        }
                }).catch((err) => { 
                    setIsSuccess(false);
                    setIsFailed(true);
                    setSuccessMsg(err.message);
                })
        } else if(type == "update"){
    //update
     const formErrors = {
            size: !size,
            category: !category
        };

        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });

        if (Object.values(formErrors).some((v) => v)) return;

        formData.append("size", size);

        formData.append("categoryId", category);
        formData.append("sizeId", sizedata._id);

        axios.post("http://localhost:8080/api/size/updateSize", formData,{headers:{"Content-Type" : "application/json"}})
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                        setIsSuccess(true);
                        setIsFailed(false);
                        setSuccessMsg(response.data.msg);
                    }
                    else {
                        setIsSuccess(false);
                        setIsFailed(true);
                        setSuccessMsg(response.data.msg);
                    }
                } else {
                    setIsSuccess(false);
                    setIsFailed(true);
                    setSuccessMsg('Something went wrong. Please try again later!');
                    }
            }).catch((err) => { 
                setIsSuccess(false);
                setIsFailed(true);
                setSuccessMsg(err.message);
            })
        }
    }

    useEffect(() => {

        axios.get("http://localhost:8080/api/category/getAllCategory")
        .then((response) => {
            // console.log(response.data)
            if (response.data) {
            setCategories(response.data.allCategory);
            }
        })

        if (type == "update") {
            // console.log(subcatName,subcatId)
            // get category details here and fill the form fields
            setSize(sizedata.size);
            setCategory(sizedata.categoryId);
        }
    }, [type]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSizeChange = (e, index) => {
    const newSize = [...size];
    newSize[index] = e.target.value;
    setSize(newSize);
  };

  const addSizeField = () => {
    setSize([...size, ""]); // Add a new size input field
  };

  const removeSizeField = (index) => {
    const newSize = [...size];
    newSize.splice(index, 1); // Remove the size input field at the given index
    setSize(newSize);
  };

   return (
    <>
      <div className='container mt-5'>
        <h2>Add / Update Size</h2>
        <hr />
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

        <form onSubmit={HandleSubmitEvent} method="post" encType="multipart/form-data">
          <div className="form-group col-sm-6">
            <label htmlFor="category">Category: </label><br />
            <select
              className={`form-control ${formErrors && (formErrors?.category ? "is-invalid" : "is-valid")}`}
              id="category"
              name="category"
              value={category}
              onChange={handleCategoryChange}>
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">Please select a category</div>
          </div>

          {type === 'new' && ( <div className="form-group col-sm-6">
            <label htmlFor="size">Size: </label><br />
            {size.map((sizeValue, index) => (
              <div key={index}>
                <input type="text"
                  className={`form-control ${formErrors && (formErrors?.size ? "is-invalid" : "is-valid")}`}
                  name="size"
                  value={sizeValue}
                  onChange={(e) => handleSizeChange(e, index)}
                  placeholder="Enter size name" />
                <div className="invalid-feedback">Please enter correct size</div>
                  <button
                    type="button"
                    onClick={() => removeSizeField(index)}
                    className="btn btn-danger mt-2"
                  >
                    Remove
                  </button>
              </div>
            ))}
              <button type="button" onClick={addSizeField} className="btn btn-primary mt-2">
                Add Size
              </button>
          </div>
           )}
           
           {type === 'update' && (
              <div className="form-group col-sm-6">
                  <label htmlFor="size">Size: </label><br />
                  <input type="text"
                    className={`form-control ${formErrors && (formErrors?.size ? "is-invalid" : "is-valid")}`}
                    id="size"
                    name="size"
                    value={size}
                    onChange={(e) => {setSize(e.currentTarget.value);}}
                    placeholder="Enter Size" />
                <div className="invalid-feedback">Please enter correct Size</div>
              </div>
           )}
             

          <button type="submit" className="btn btn-primary mt-2">Submit</button> &nbsp;
          <Link to="/Size">
            <button className='btn btn-danger mt-2'>
              Go Back
            </button>
          </Link>
        </form>
      </div>
    </>
  )
}


export default AddUpdateSize
