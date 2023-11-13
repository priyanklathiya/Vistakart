import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom'

function AddUpdateFeaturedCategory() {

    const history = useNavigate();
    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [link, setLink] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [category, setCategory] = useState("");
    const [subcategoryName, setSubCategoryName] = useState("");
    const [fcategoryId, setFcategoryId] = useState("");
    const [categories, setCategories] = useState([]); 
    const [newImagePath, setNewImagePath] = useState(false);
    const [newImagePath1, setNewImagePath1] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const formRef = useRef();
    const location = useLocation()
    const { type, categoriesDetails } = location.state

    useEffect(() => {

        axios.get("http://localhost:8080/api/category/getAllCategory")
        .then((response) => {
            // console.log(response.data)
            if (response.data) {
            setCategories(response.data.allCategory);
            }
        })

        if (type == "update") {
            console.log(categoriesDetails)
            // get category details here and fill the form fields
            // setSubCategoryName(subcatName);
            setCategoryName(categoriesDetails.categoryName);
            setCategory(categoriesDetails.categoryId);
            setLink(categoriesDetails.link);
            setImagePath(categoriesDetails.imagePath);
            setFcategoryId(categoriesDetails._id);
        }
    }, [type]);

    const HandleSubmitEvent = (e) => {
        e.preventDefault();

        let formErrors = {};
        if (type === "update") {
            
            formErrors = {
                categoryName: !categoryName,
                category: !category,
                link: !link,
                imagePath: !imagePath && !categoriesDetails.imagePath && !newImagePath,
            };
        } else {
            formErrors = {
                categoryName: !categoryName,
                category: !category,
                link: !link,
                imagePath: !imagePath,
            };
        }
        

        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });

        if (Object.values(formErrors).some((v) => v)) return;

        const formData = new FormData();
        if (type === "update") {

            
            formData.append("categoryName", categoryName);
            formData.append("categoryId", category);
            formData.append("link", link);
            formData.append("featuredPId", fcategoryId);
            
            if (newImagePath1) {
                formData.append("imagePath", imagePath);
            } else {
                // Use the original image path if a new image wasn't selected
                formData.append("imagePath", categoriesDetails.imagePath || "");
            }
      
        axios.post("http://localhost:8080/api/home/updateFeaturedCategory", formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                       
                        history("/FeaturedCategory");

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


         } else {
            formData.append("categoryName", categoryName);
            formData.append("categoryId", category);
            formData.append("link", link);
            formData.append("imagePath", imagePath);
            // formData.append("categoryId", catId);
            axios.post("http://localhost:8080/api/home/addFeaturedCategory", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((response) => {
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg(response.data.msg);
                            setCategoryName("");
                            setCategory("");
                            setLink("");
                            setImagePath("");
                            formRef.current.reset();


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
    

    
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

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
                <form  ref={formRef}  onSubmit={HandleSubmitEvent} method="post" encType="multipart/form-data" className='mt-5 mb-5'>
                    
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

                    <div className="form-group  col-sm-6">
                        <label htmlFor="link">Link: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.link ? "is-invalid" : "is-valid")}`}
                            id="link"
                            name="link"
                            value={link}
                            onChange={(e) => {setLink(e.currentTarget.value);}}
                            placeholder="Enter a link" />
                        <div className="invalid-feedback">Please enter correct link</div>
                    </div>

                    <div className="form-group col-sm-6">
                        <label htmlFor="category">Category Id: </label><br />
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

                    <div className="form-group col-sm-6">
                        <label htmlFor="imagePath">Category image: </label><br/>
                        <input type="file"
                            className={`form-control ${formErrors && (formErrors?.imagePath ? "is-invalid" : "is-valid")}`}
                            id="imagePath"
                            name="imagePath"
                            onChange={(e) => {
                                setImagePath(e.currentTarget.files[0]);
                                if (type === "update") {
                                    setNewImagePath1(true);
                                }
                            }}
                            placeholder="Select an image" />
                        <div className="invalid-feedback">Please select image</div>
                    </div>
                    {categoriesDetails && categoriesDetails.imagePath && (
                      <div className="form-group col-sm-6">
                        <img
                            src={`http://localhost:8080/Images/featured_categories_home/${categoriesDetails.imagePath}`}
                            alt="Current Product Image"
                            height="100"
                          />
                      </div>
                      
                    )}

                    <button type="submit" className="btn btn-primary mt-2"> Submit </button>

                </form>
            </div>
        </>
    )
}
export default AddUpdateFeaturedCategory;