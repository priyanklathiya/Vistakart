import React, { useState } from 'react';
import axios from "axios";

function AddUpdateCategory() {

    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const HandleSubmitEvent = (e) => {
        e.preventDefault();
        const formErrors = {
            categoryName: !categoryName,
            imagePath: !imagePath
        };
            
        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });

        if (Object.values(formErrors).some((v) => v)) return;

        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("imagePath", imagePath);

        axios.post("http://localhost:8080/api/category/addCategory", formData)
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                        setIsSuccess(true);
                        setIsFailed(false);
                        setSuccessMsg(response.data.msg);
                        setCategoryName("");
                        setImagePath("");
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
                setSuccessMsg(err);
            })
    }

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
                    <div className="form-group col-sm-6">
                        <label htmlFor="imagePath">Category Name: </label><br/>
                        <input type="file"
                            className={`form-control ${formErrors && (formErrors?.imagePath ? "is-invalid" : "is-valid")}`}
                            id="imagePath"
                            name="imagePath"
                            onChange={(e) => setImagePath(e.currentTarget.files[0])}
                            placeholder="Select an image" />
                        <div className="invalid-feedback">Please select image</div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-2">Submit</button>

                </form>
            </div>
        </>
    )
}

export default AddUpdateCategory