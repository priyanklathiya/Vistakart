import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom'
function AddUpdateBrand() {
  const location = useLocation()
  const { type, bName, bId } = location.state
// new or update

    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [brandName, setBrandName] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    
    const [userId, setUserId] = useState('');
    
    
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


    const HandleSubmitEvent = (e) => {
        e.preventDefault();
        const formErrors = {
            brandName: !brandName
        };

        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });
        if (Object.values(formErrors).some((v) => v)) return;

        const formData = new FormData();
        formData.append("brandName", brandName);
        
        if (type == "new") {
            // new
            axios.post("http://localhost:8080/api/brands/addBrand", formData,{headers:{"Content-Type" : "application/json"}})
                .then((response) => { 
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg(response.data.msg);
                            setBrandName("");
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
                    setTimeout(() => {
                        setIsSuccess(null);
                        setIsFailed(null);
                        setSuccessMsg('');
                    }, 4000);
                }).catch((err) => { 
                    setIsSuccess(false);
                    setIsFailed(true);
                    setSuccessMsg(err.message);
                })
        } else if(type == "update"){
            //update
            formData.append("brandId", bId);
            axios.post("http://localhost:8080/api/brands/updateBrand", formData, { headers: { "Content-Type": "application/json" } })
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
            // get brand details here and fill the form fields

            setBrandName(bName);
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

                <h2>Add / Update Brand</h2>
                <hr/>
                <form onSubmit={HandleSubmitEvent}  method="post" encType="multipart/form-data">
                    <div className="form-group  col-sm-6">
                        <label htmlFor="brandName">Brand Name: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.brandName ? "is-invalid" : "is-valid")}`}
                            id="brandName"
                            name="brandName"
                            value={brandName}
                            onChange={(e) => {setBrandName(e.currentTarget.value);}}
                            placeholder="Enter Brand name" />
                        <div className="invalid-feedback">Please enter correct Brand name</div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Submit</button> &nbsp;
                    <Link to="/Brands">
                        <button className='btn btn-danger  mt-2'>
                            Go Back
                        </button>
                    </Link>
                    
                </form>
            </div>
        </>
    )
}

export default AddUpdateBrand