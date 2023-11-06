  <div className="App">
      <BrowserRouter>
        
        <Routes>
          
            <Route path="/" element={<HeaderFooterRoute />}>

            <Route index element={<Home />} />

            {/* <Route path="addEmployee" element={<AddEmployees />} /> */}
            
            {/* <Route path="/updateEmployee/:id" element={<UpdateEmployee/>}/> */}
            
            <Route path="/Login" element={<Login />} />
                                 
            <Route path="/Signup" element={<Signup />} />

            <Route path="/ContactUs" element={<ContactUs />} />

            <Route path="/viewProducts" element={<ViewProduct />} />

            <Route path="/adminDashboard" element={<AdminDashboard />} />
            
            <Route path="/Categories" element={<Categories />} />

            <Route path="/AddUpdateCategory" element={<AddUpdateCategory />} />

            <Route path="/Products" element={<Products />} />

            <Route path="/SubCategories" element={<SubCategories />} />
            
            <Route path="/Brands" element={<Brands />} />

            <Route path="/AddUpdateProduct" element={<AddUpdateProduct />} />

            <Route path="/AddUpdateSubCategory" element={<AddUpdateSubCategory />} />

            <Route path="/AddUpdateBrand" element={<AddUpdateBrand />} />

          </Route>
        
        </Routes>

      </BrowserRouter>
      
</div>
    
















    .vertical-nav {
    width: 250px;
    background-color: #333;
    color: #fff;
    position: fixed;
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    transition: width 0.3s;
    float: left;
    z-index: 1;
    position: absolute;
    /* Add a smooth transition for width changes */
}

.vertical-nav ul {
    list-style: none;
    padding: 0;
}

.vertical-nav li {
    margin-bottom: 10px;
}

.vertical-nav a {
    text-decoration: none;
    color: #fff;
    display: block;
    padding: 10px;
    transition: background-color 0.3s;
}

.vertical-nav a:hover {
    background-color: #555;
}

/* CSS for your main content area */
.main-area {
    margin-left: 250px;
    padding: 20px;
    transition: margin-left 0.3s;
    /* Add a smooth transition for margin-left changes */
}

/* Media query for responsiveness */
@media (max-width: 768px) {
    .vertical-nav {
        width: 0;
        /* Hide the vertical navigation bar */
    }

    .main-area {
        margin-left: 0;
        padding: 20px;
        width: 100%;
        /* Make the main content full width on small screens */
        transition: none;
        /* Remove the transition for width changes */
        position: relative;
        /* Restore normal document flow */
        z-index: 2;
        /* Place the main area above the navigation bar */
        background-color: #f5f5f5;
        /* Add background color for the main content area */
    }
}










-------------------------------------------------- Product.js -------------------------------------------------------


    
    import React, { useState, useEffect } from 'react';
import axios from "axios";

function AddUpdateProduct() {
  
    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [gender, setGender] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imagePath1, setImagePath1] = useState("");
    const [imagePath2, setImagePath2] = useState("");
    const [imagePath3, setImagePath3] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Fetch brand data from your Node.js server using Axios
        axios.get('http://localhost:8080/api/brands/getAllBrand') 
            .then((response) => {
                if (response.data) {
                    setBrands(response.data.allbrand);
                }
            })
            .catch((error) => {
                console.error('Error fetching brands: ', error);
            });
        
        axios.get('http://localhost:8080/api/category/getAllCategory') 
            .then((response) => {
                if (response.data) {
                    setCategory(response.data.allCategory);
                }
            })
            .catch((error) => {
                console.error('Error fetching brands: ', error);
            });
    }, []);

    const HandleSubmitEvent = (e) => {
        e.preventDefault();
        const formErrors = {
            sku: !sku,
            price: !price,
            productName: !productName,
            productDescription: !productDescription,
            quantity: !quantity,
            gender: !gender,
            selectedCategory: !selectedCategory,
            selectedBrand: !selectedBrand,
            imagePath1: !imagePath1
        };
            
        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });
        if (Object.values(formErrors).some((v) => v)) return;


        const formData = new FormData();
        formData.append("sku", sku);
        formData.append("productName", productName);
        formData.append("productDescription", productDescription);
        formData.append("quantity", quantity);
        formData.append("gender", gender);
        formData.append("price", price);
        formData.append("brandId", selectedBrand);
        formData.append("categoryId", selectedCategory);
        formData.append("imagePath1", imagePath1);
        formData.append("imagePath2", imagePath2);
        formData.append("imagePath3", imagePath3);
for (const value of formData.values()) {
  console.log(value);
}
        axios.post("http://localhost:8080/api/products/addProduct", formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                        setIsSuccess(true);
                        setIsFailed(false);
                        setSuccessMsg(response.data.msg);
                        setSku("");
                        setPrice("");
                        setQuantity("");
                        setProductName("");
                        setProductDescription("");
                        setCategory("");
                        setBrands("");
                        setImagePath1("");
                        setImagePath2("");
                        setImagePath3("");
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

                <h2 className='text-center'>Add / Update Product</h2>
                <hr/>
                <form onSubmit={HandleSubmitEvent}  method="post" encType="multipart/form-data">
                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="sku">SKU: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.sku ? "is-invalid" : "is-valid")}`}
                            id="sku"
                            name="sku"
                            value={sku}
                            onChange={(e) => {setSku(e.currentTarget.value);}}
                            placeholder="Enter SKU" />
                        <div className="invalid-feedback">Please enter correct SKU</div>
                    </div>
                    
                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="productName">Product Name: </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.productName ? "is-invalid" : "is-valid")}`}
                            id="productName"
                            name="productName"
                            value={productName}
                            onChange={(e) => {setProductName(e.currentTarget.value);}}
                            placeholder="Enter product Name" />
                        <div className="invalid-feedback">Please enter correct Product Name</div>
                  </div>
                  
                  <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="productDescription">Product Description:</label><br />
                      <textarea
                      className={`form-control ${formErrors && (formErrors?.productDescription ? "is-invalid" : "is-valid")}`}
                          id="productDescription"
                          name="productDescription"
                          value={productDescription}
                          onChange={(e) => { setProductDescription(e.currentTarget.value); }}
                          placeholder="Enter Product Description"
                      ></textarea>
                        <div className="invalid-feedback">Please enter correct Product Name</div>
                    </div>
                  
                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="brandId">Brand:</label><br />
                        <select
                          className={`form-control ${formErrors && (formErrors?.selectedBrand ? "is-invalid" : "is-valid")}`}
                            id="brandId"
                            name="brandId"
                            value={selectedBrand} 
                            onChange={(e) => { setSelectedBrand(e.currentTarget.value); }}                         >
                            <option value="">Select a Brand</option>
                            {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Please select a valid Brand.</div>
                    </div>

                    
                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="categoryId">category :</label><br />
                        <select
                            className={`form-control ${formErrors && (formErrors?.selectedCategory ? "is-invalid" : "is-valid")}`}
                            id="categoryId"
                            name="categoryId"
                            value={selectedCategory}  
                            onChange={(e) => { setSelectedCategory(e.currentTarget.value); }}
                        >
                            <option value="">Select a Category</option>
                            {category.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Please select a valid Category.</div>
                    </div>

                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="price">Price : </label><br/>
                        <input type="text"
                            className={`form-control ${formErrors && (formErrors?.price ? "is-invalid" : "is-valid")}`}
                            id="price"
                            name="price"
                            value={price}
                            onChange={(e) => {setPrice(e.currentTarget.value);}}
                            placeholder="Enter Price" />
                        <div className="invalid-feedback">Please enter correct Price</div>
                    </div>

                    {/* <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="gender">Gender:</label><br />
                        <select
                            className={`form-control ${formErrors && (formErrors?.gender ? "is-invalid" : "is-valid")}`}
                            id="gender"
                            name="gender"
                            value={gender}
                            onChange={(e) => { setGender(e.currentTarget.value); }} >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unisex">Unisex</option>
                        </select>
                        <div className="invalid-feedback">Please select a valid Gender.</div>
                    </div> */}
                  
                  <div className="form-group col-sm-6 margin-center">
                    <label>Gender:</label><br />
                    <div>
                        <label className='m-1'>
                        <input type="radio" name="gender"  value="male" checked={gender === "male"}
                            onChange={(e) => setGender(e.target.value)}
                        /> Male  </label>
                    
                        <label  className='m-1'>
                        <input type="radio" name="gender" value="female" checked={gender === "female"}
                            onChange={(e) => setGender(e.target.value)}
                        /> Female </label>
                    
                        <label  className='m-1'>
                        <input type="radio" name="gender" value="unisex" checked={gender === "unisex"}
                            onChange={(e) => setGender(e.target.value)}
                        /> Unisex </label>
                    </div>
                    {formErrors && formErrors.gender && (
                        <div className="invalid-feedback">Please select a valid Gender.</div>
                    )}
                    </div>

                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="quantity">Quantity:</label><br />
                        <input
                            type="number"
                            className={`form-control ${formErrors && (formErrors?.quantity ? "is-invalid" : "is-valid")}`}
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => { setQuantity(e.currentTarget.value); }}
                            placeholder="Enter Quantity" />
                        <div className="invalid-feedback">Please enter a valid quantity.</div>
                    </div>

                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="imagePath1">Image 1 </label><br/>
                        <input type="file"
                            className={`form-control ${formErrors && (formErrors?.imagePath1 ? "is-invalid" : "is-valid")}`}
                            id="imagePath1"
                            name="imagePath1"
                            onChange={(e) => setImagePath1(e.currentTarget.files[0])}
                            placeholder="Select an image" />
                        <div className="invalid-feedback">Please select image</div>
                    </div>
                  
                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="imagePath2">Image 2 </label><br/>
                        <input type="file"
                            className={`form-control`}
                            id="imagePath2"
                            name="imagePath2"
                            onChange={(e) => setImagePath2(e.currentTarget.files[0])}
                            placeholder="Select an image" />
                        <div className="invalid-feedback">Please select image</div>
                    </div>
                  
                    <div className="form-group col-sm-6 margin-center">
                        <label htmlFor="imagePath3">Image 3 </label><br/>
                        <input type="file"
                            className={`form-control`}
                            id="imagePath3"
                            name="imagePath3"
                            onChange={(e) => setImagePath3(e.currentTarget.files[0])}
                            placeholder="Select an image" />
                        <div className="invalid-feedback">Please select image</div>
                    </div>
                  <div className='col-sm-6 margin-center'>
                    <button type="submit" className="btn btn-primary mt-2 mb-4">Submit</button>
                  </div>
                </form>
            </div>
        </>
  )
}

export default AddUpdateProduct




---------------------------------------------------
    
    const express = require( "express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()  + '_' +  file.originalname);
    }
})

const upload = multer({
    storage: storage,
})


const { getAllProducts, addProduct } = require("../controllers/products");

router.route("/").get(getAllProducts);

// router.route("/addProduct").post(upload.fields([ { name: 'imagePath1', maxCount: 1 }, { name: 'imagePath2', maxCount: 1 }, { name: 'imagePath3', maxCount: 1 }, ]), addProduct);

router.route("/addProduct").post((req, res, next) => { 
    
    // Check if imagePath1 file is present
    if (!req.file || !req.file.imagePath1) {
        return res.status(400).json({ status: 0, msg: 'Please provide imagePath1.' });
    }

    // Include imagePath1 in the upload
    const uploadFields = [{ name: 'imagePath1', maxCount: 1 }];

    // Check if imagePath2 file is present and add it to the uploadFields
    if (req.file.imagePath2) {
        uploadFields.push({ name: 'imagePath2', maxCount: 1 });
    }

    // Check if imagePath3 file is present and add it to the uploadFields
    if (req.file.imagePath3) {
        uploadFields.push({ name: 'imagePath3', maxCount: 1 });
    }

    upload.fields(uploadFields)(req, res, next);
}, addProduct);

module.exports = router;



------------------------proxy ------------------------------
"proxy": {
    "":{
      "target":"http://localhost:8080"
    },
    "/imgs/products":{
      "target":"http://localhost:8080/Images/products"
    }
  },