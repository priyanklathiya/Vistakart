const productmodel = require('../models/product.model');

const getAllProducts = async (req, res) => { 
    const allProducts = await productmodel.find({});
    res.status(200).json({ allProducts });
};

const getProductBySku = async (req, res) => {
    const sku  = req.body.sku; 
    try {
        const product = await productmodel.findOne({ sku });
            // console.log(product);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProductById = async (req, res) => {
    // const id = req.body.productId; // Extract productId from the request body
    const productId = req.params.productId;
    // console.log(req.params.productId);
    try {
        const product = await productmodel.findOne({ _id: productId }); // Use the id variable in your query

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getProductByPId = async (req, res) => {
    const productId = req.body.productId;
    try {
        const product = await productmodel.findOne({ _id: productId }); // Use the id variable in your query

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const addProduct = async (req, res) => { 
    try {

        let _imagePath1 = "default";
        if (req.files.imagePath1) {
            _imagePath1 = req.files.imagePath1[0].filename;
        }

        let _imagePath2 = "default";
        if (req.files.imagePath2) {
            _imagePath2 = req.files.imagePath2[0].filename;
        }
        let _imagePath3 = "default";
        if (req.files.imagePath3) {
            _imagePath3 = req.files.imagePath3[0].filename;
        }
        await productmodel.create({
            sku: req.body.sku,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            quantity: req.body.quantity,
            gender: req.body.gender,
            price: req.body.price,
            brandId: req.body.brandId,
            categoryId: req.body.categoryId,
            imagePath: {
                imagePath1: _imagePath1,
                imagePath2: _imagePath2,
                imagePath3: _imagePath3
                }
        }).then(() => {
            res.status(200).json({ msg: "Product Added Successfully", status: 1 });
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({ msg: "Error: Product could not be added", err: error, status: 0 });
    }
};


const deleteProduct = async (req, res) => {
    // console.log(req.body)
    try {
        await productmodel.findOneAndDelete({ _id: req.body.pId })
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data deleted successfully.", status: 1 });                    
                } else {
                    res.status(400).json({ msg: "Error: brand cannot be deleted", status: 0 });
                }
            })
            .catch((err) => {
                // console.log(err);
                res.status(400).json({ msg: "Error: brand cannot be deleted", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: brand cannot be deleted", err: error, status: 0 });
    }

}

const updateProduct = async (req, res) => { 
    try {
        // console.log(req.body);
        let _imagePath1 = "default";
        if (req.files.imagePath1) {
            _imagePath1 = req.files.imagePath1[0].filename;
        } else if (req.body.imagePath1) {
            _imagePath1 = req.body.imagePath1;
        }

        let _imagePath2 = "default";
        if (req.files.imagePath2) {
            _imagePath2 = req.files.imagePath2[0].filename;
        } else if (req.body.imagePath2) {
            _imagePath2 = req.body.imagePath2;
        }
        let _imagePath3 = "default";
        if (req.files.imagePath3) {
            _imagePath3 = req.files.imagePath3[0].filename;
        } else if (req.body.imagePath3) {
            _imagePath3 = req.body.imagePath3;
        }

        // Create an object to hold the updated product data
        const updatedProductData = {
            sku: req.body.sku,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            quantity: req.body.quantity,
            gender: req.body.gender,
            price: req.body.price,
            brandId: req.body.brandId,
            categoryId: req.body.categoryId
        };

        // Check if any of the image paths are not default and update them
        // Check if imagePath1 is not default and update it
        if (_imagePath1 !== 'default') {
            updatedProductData.imagePath = {
                ...updatedProductData.imagePath,
                imagePath1: _imagePath1
            };
        }

        // Check if imagePath2 is not default and update it
        if (_imagePath2 !== 'default') {
            updatedProductData.imagePath = {
                ...updatedProductData.imagePath,
                imagePath2: _imagePath2
            };
        }

        // Check if imagePath3 is not default and update it
        if (_imagePath3 !== 'default') {
            updatedProductData.imagePath = {
                ...updatedProductData.imagePath,
                imagePath3: _imagePath3
            };
        }


    await productmodel.findOneAndUpdate({ _id: req.body.productId }, updatedProductData ).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

const sortProductsBy = async (req, res) => {
    const sortBy = req.body.sortBy;

    try {
        let products;

        // Fetch all products from the database
        if (sortBy === 'lowToHigh') {
            products = await productmodel.find().sort({ price: 1 });
        } else if (sortBy === 'highToLow') {
            products = await productmodel.find().sort({ price: -1 });
        } else if (sortBy === 'newest') {
            products = await productmodel.find().sort({ createdAt: -1 });
        } else {
            return res.status(400).json({ error: 'Invalid sortBy parameter' });
        }
        // console.log(products);

        res.status(200).json({ products });

    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const filterProducts = async (req, res) => {
    const brand = req.body.brand || [];
    const categories = req.body.categories || [];
    const gender = req.body.gender || [];
    const sortBy = req.body.sortBy;


    try {
        let filterCriteria = {};

        // Handle filtering based on parameters
        if (gender.length > 0) {
            // If gender is an array, use $in operator
            filterCriteria.gender = { $in: gender };
        }
        if (brand.length > 0) {
            // If brand is an array, use $in operator
            filterCriteria.brandId = { $in: brand };
        }
        if (categories.length > 0) {
            // If categories is an array, use $in operator
            filterCriteria.categoryId = { $in: categories };
        }

        // Check if all parameters are empty, if yes, retrieve all products
        if (brand.length === 0 && categories.length === 0 && gender.length === 0 && !sortBy) {
            // console.log('Fetching all products');
            const products = await productmodel.find({});
            return res.status(200).json({ products });
        }

        let products;
        // console.log(filterCriteria);

        // Fetch and filter products from the database based on the criteria
        if (sortBy === 'lowToHigh') {
            products = await productmodel.find(filterCriteria).sort({ price: 1 });
        } else if (sortBy === 'highToLow') {
            products = await productmodel.find(filterCriteria).sort({ price: -1 });
        } else if (sortBy === 'newest') {
            products = await productmodel.find(filterCriteria).sort({ createdAt: -1 });
        } else {
            products = await productmodel.find(filterCriteria);
        }

        // console.log(products);

        res.status(200).json({ products });

    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





module.exports = {
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductBySku,
    getProductById,
    sortProductsBy,
    filterProducts,
    getProductByPId
}