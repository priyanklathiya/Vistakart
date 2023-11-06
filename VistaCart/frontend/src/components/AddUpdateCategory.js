import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom'
function AddUpdateCategory() {
  const location = useLocation()
  const { type, catName, catId } = location.state
// new or update

    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const HandleSubmitEvent = (e) => {
        e.preventDefault();
        const formErrors = {
            categoryName: !categoryName
        };

        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });

        if (Object.values(formErrors).some((v) => v)) return;

        const formData = new FormData();
        formData.append("categoryName", categoryName);

        if (type == "new") {
            // new
            axios.post("http://localhost:8080/api/category/addCategory", formData,{headers:{"Content-Type" : "application/json"}})
                .then((response) => { 
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg(response.data.msg);
                            setCategoryName("");
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
        formData.append("categoryId", catId);

                    axios.post("http://localhost:8080/api/category/updateCategory", formData,{headers:{"Content-Type" : "application/json"}})
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
        if (type == "update") {
            // get category details here and fill the form fields

            setCategoryName(catName);
        }
    }, [type]);

    return (
        <>
            <div className='container mt-5'>
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

                <h2>Add / Update Category</h2>
                <hr/>
                <form onSubmit={HandleSubmitEvent}  method="post" encType="multipart/form-data">
                    <div className="form-group  col-sm-6">
                        <label htmlFor="categoryName">Category Name: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.categoryName ? "is-invalid" : "is-valid")}`}
                            id="categoryName"
                            name="categoryName"
                            value={categoryName}
                            onChange={(e) => {setCategoryName(e.currentTarget.value);}}
                            placeholder="Enter category name" />
                        <div className="invalid-feedback">Please enter correct category name</div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Submit</button> &nbsp;
                    <Link to="/Categories">
                        <button className='btn btn-danger  mt-2'>
                            Go Back
                        </button>
                    </Link>
                    
                </form>
            </div>
        </>
    )
}

export default AddUpdateCategory