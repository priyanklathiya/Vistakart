const categorymodel = require('../models/categories.model');

const addCategory = async (req, res) => { 
    try {
        console.log(req.body);
        console.log(req.file);
        
        await categorymodel.create({
            categoryName: req.body.categoryName,
            imagePath: req.file.filename
        }).then(() => {
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }    
};

module.exports = {addCategory}