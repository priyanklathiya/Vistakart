const quantitymodel = require('../models/quantity.model');

const addQuantity = async (req, res) => { 
    try {
        // console.log(req.body);
        
        await quantitymodel.create({
            quantity: req.body.quantity,
            sizeId: req.body.sizeId,
            productId: req.body.productId
        }).then(() => {
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }    
};

const getAllQuantity = async (req, res) => { 
    const allQuantity = await quantitymodel.find({});
    res.status(200).json({ allQuantity });
};

const deleteQuantity = async (req, res) => {
    // console.log(req.body)
    try {
        await quantitymodel.findOneAndDelete({ _id: req.body.quantityId })
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data deleted successfully.", status: 1 });                    
                } else {
                    res.status(400).json({ msg: "Error: Quantity cannot be deleted", status: 0 });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ msg: "Error: Quantity cannot be deleted", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: Quantity cannot be deleted", err: error, status: 0 });
    } 
}

const updateQuantity = async (req, res) => { 
    try {
        // console.log(req.body);
        
        await quantitymodel.findOneAndUpdate({ _id: req.body.quantityId }, {
            quantity: req.body.quantity,
            sizeId: req.body.sizeId,
            productId: req.body.productId
        }).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated.", err: error, status: 0 });
    }    
};
module.exports = { addQuantity, getAllQuantity, deleteQuantity, updateQuantity };
// module.exports = { getAllSubCategory, addSubCategory, deleteSubCategory, updateSubCategory}