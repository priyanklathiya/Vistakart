const subcategorymodel = require('../models/subcategories.model');

const addSubCategory = async (req, res) => { 
    try {
        // console.log(req.body);
        
        await subcategorymodel.create({
            subcategoryName: req.body.subcategoryName,
            categoryId: req.body.categoryId
        }).then(() => {
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }    
};

const getAllSubCategory = async (req, res) => { 
    const allSubCategory = await subcategorymodel.find({});
    res.status(200).json({ allSubCategory });
};

const deleteSubCategory = async (req, res) => {
    // console.log(req.body)
    try {
        await subcategorymodel.findOneAndDelete({ _id: req.body.subcategoryId })
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data deleted successfully.", status: 1 });                    
                } else {
                    res.status(400).json({ msg: "Error: Category cannot be deleted", status: 0 });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ msg: "Error: Category cannot be deleted", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: Category cannot be deleted", err: error, status: 0 });
    } 
}

const updateSubCategory = async (req, res) => { 
    try {
        // console.log(req.body);
        
        await subcategorymodel.findOneAndUpdate({ _id: req.body.subcategoryId }, {
            subcategoryName: req.body.subcategoryName,
            categoryId: req.body.categoryId
        }).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};
module.exports = { addSubCategory, getAllSubCategory, deleteSubCategory, updateSubCategory };
// module.exports = { getAllSubCategory, addSubCategory, deleteSubCategory, updateSubCategory}