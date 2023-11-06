import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom'
function AddUpdateSubCategory() {
  const location = useLocation()
  const { type, subcatName, subcatId, catId } = location.state
// new or update

    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [category, setCategory] = useState("");
    const [subcategoryName, setSubCategoryName] = useState("");
    const [categories, setCategories] = useState([]); 
    const [successMsg, setSuccessMsg] = useState("");

    const HandleSubmitEvent = (e) => {
        e.preventDefault();
        const formErrors = {
            subcategoryName: !subcategoryName,
            category: !category
        };

        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });

        if (Object.values(formErrors).some((v) => v)) return;

        const formData = new FormData();
        formData.append("subcategoryName", subcategoryName);
        formData.append("categoryId", category);
        // formData.append("categoryId", catId);

        if (type == "new") {
            // new
        // console.log(formData);

            axios.post("http://localhost:8080/api/subcategory/addSubCategory", formData,{headers:{"Content-Type" : "application/json"}})
                .then((response) => { 
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg(response.data.msg);
                            setSubCategoryName("");
                            setCategory("");
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
        formData.append("subcategoryId", subcatId);

        axios.post("http://localhost:8080/api/subcategory/updateSubCategory", formData,{headers:{"Content-Type" : "application/json"}})
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
            setSubCategoryName(subcatName);
            setCategory(catId);
        }
    }, [type]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

    return (
        <>
            <div className='container mt-5'>
                <h2>Add / Update Sub Category</h2>
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

                <form onSubmit={HandleSubmitEvent}  method="post" encType="multipart/form-data">
                    <div className="form-group  col-sm-6">
                        <label htmlFor="subcategoryName">Sub Category Name: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.subcategoryName ? "is-invalid" : "is-valid")}`}
                            id="subcategoryName"
                            name="subcategoryName"
                            value={subcategoryName}
                            onChange={(e) => {setSubCategoryName(e.currentTarget.value);}}
                            placeholder="Enter category name" />
                        <div className="invalid-feedback">Please enter correct category name</div>
                    </div>

            <div className="form-group col-sm-6">
                <label htmlFor="category">Category: </label><br />
                <select
                    className={`form-control ${formErrors && (formErrors?.category ? "is-invalid" : "is-valid")}`}
                    id="category"
                    name="category"
                    value={category}
                    onChange={handleCategoryChange} >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                        {category.categoryName}
                    </option>
                    ))}
                </select>
                <div className="invalid-feedback">Please select a category</div>
            </div> 


                    <button type="submit" className="btn btn-primary mt-2">Submit</button> &nbsp;
                    <Link to="/SubCategories">
                        <button className='btn btn-danger mt-2'>
                            Go Back
                        </button>
                    </Link>
                    
                </form>
            </div>
        </>
    )
}

export default AddUpdateSubCategory