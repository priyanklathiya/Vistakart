const featuredCategoriesmodel = require('../models/featuredCategories.model');
const featuredProductsmodel = require('../models/featuredProducts.model');

// featured categories ---------------------------------------------------------------------------------------
const addFCategory = async (req, res) => { 
    try {
        // console.log(req.body);
        // console.log(req.file);
        let _imagePath = "default";
        if (req.files.imagePath) {
            _imagePath = req.files.imagePath[0].filename;
        }
        await featuredCategoriesmodel.create({
            categoryName: req.body.categoryName,
            link: req.body.link,
            categoryId: req.body.categoryId,
            imagePath: _imagePath
        }).then(() => {
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }
};

const updateFeaturedCategory = async (req, res) => { 
  // console.log(req.files);
  // console.log(req.body);
  try {
    let _imagePath = "default";
    if (req.files.imagePath) {
      _imagePath = req.files.imagePath[0].filename;
    }

    const updatedData = {
      categoryName: req.body.categoryName,
      link: req.body.link,
      categoryId: req.body.categoryId,
    };

    if (_imagePath !== 'default') {
      updatedData.imagePath = _imagePath;
    }

    console.log(updatedData);

    await featuredCategoriesmodel.findOneAndUpdate({ _id: req.body.featuredPId }, updatedData ).then(() => {
        res.status(200).json({ msg: "Data updated successfully.", status: 1 });
    });

  } catch (error) {
    res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
  }

};

const getAllFCategory = async (req, res) => { 
    const allFCategory = await featuredCategoriesmodel.find({});
    res.status(200).json({ allFCategory });
};


const deleteFCategory = async (req, res) => {
    // console.log(req.body)
    try {
        await featuredCategoriesmodel.findOneAndDelete({ _id: req.body.featuredCId })
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data deleted successfully.", status: 1 });                    
                } else {
                    res.status(400).json({ msg: "Error: data cannot be deleted", status: 0 });
                }
            })
            .catch((err) => {
                // console.log(err);
                res.status(400).json({ msg: "Error: data cannot be deleted", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: brand cannot be deleted", err: error, status: 0 });
    }

}

const updateFCategoryStatus = async (req, res) => {

    try {
        const updatedCategory = await featuredCategoriesmodel.findByIdAndUpdate(
            {
                _id: req.body.featuredCId
            },
            {
                status: req.body.status
            }
        );

    if (updatedCategory) {
      res.status(200).json({ msg: "Category status updated successfully.", status: 1 });
    } else {
      res.status(400).json({ msg: "Error: Category status could not be updated", status: 0 });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error: Category status could not be updated", err: error, status: 0 });
  }
};


// featured products ---------------------------------------------------------------------------------------

// const addFProduct = async (req, res) => {
//     try {
//         console.log(req.body.productId);
//         await featuredProductsmodel.create({
//             productId: req.body.productId
//         }).then(() => {
//             res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
//         });
//     } catch (error) {
//         res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
//     }
// };
const addFProduct = async (req, res) => {
  try {
    const existingProduct = await featuredProductsmodel.findOne({ productId: req.body.productId });

    if (existingProduct) {
      res.status(400).json({ msg: "Product already exists.", status: 0 });
    } else {
      await featuredProductsmodel.create({
        productId: req.body.productId
      }).then(() => {
        res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
  }
};

const getAllFProduct = async (req, res) => { 
    const allFProduct = await featuredProductsmodel.find({});
    res.status(200).json({ allFProduct });
};

const deleteFProduct = async (req, res) => {
    console.log(req.body)
    try {
        await featuredProductsmodel.findOneAndDelete({ _id: req.body.featuredPId })
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data deleted successfully.", status: 1 });                    
                } else {
                    res.status(400).json({ msg: "Error: data cannot be deleted", status: 0 });
                }
            })
            .catch((err) => {
                // console.log(err);
                res.status(400).json({ msg: "Error: data cannot be deleted", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: brand cannot be deleted", err: error, status: 0 });
    }

}

const updateFProductStatus = async (req, res) => {

  try {
      const updatedProduct = await featuredProductsmodel.findByIdAndUpdate(
        {
            _id: req.body.featuredPId
        },
        {
            status: req.body.status
        }
    );

    if (updatedProduct) {
      res.status(200).json({ msg: "Product status updated successfully.", status: 1 });
    } else {
      res.status(400).json({ msg: "Error: Product status could not be updated", status: 0 });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error: Product status could not be updated", err: error, status: 0 });
  }
};

module.exports = { addFCategory, addFProduct, getAllFCategory, getAllFProduct, deleteFProduct, deleteFCategory, updateFCategoryStatus, updateFProductStatus, updateFeaturedCategory } 