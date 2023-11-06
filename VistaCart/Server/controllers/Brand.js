const brandmodel = require('../models/brands.model');

const addBrand = async (req, res) => { 
    try {
        // console.log(req.body);
        
        await brandmodel.create({
            brandName: req.body.brandName
        }).then(() => {
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }    
};

const getAllBrand = async (req, res) => { 
    const allbrand = await brandmodel.find({});
    res.status(200).json({ allbrand });
};

const deleteBrand = async (req, res) => {
    // console.log(req.body)
    try {
        await brandmodel.findOneAndDelete({ _id: req.body.brandId })
            
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

const updateBrand = async (req, res) => { 
    try {
        console.log(req.body);
        
        await brandmodel.findOneAndUpdate({ _id: req.body.brandId }, {
            brandName: req.body.brandName
        }).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

module.exports = { getAllBrand, addBrand, deleteBrand, updateBrand} 