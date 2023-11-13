const sizemodel = require('../models/size.model');

// const addSize = async (req, res) => {
//     try {
//         console.log(req.body);
//         await sizemodel.create({
//             size: req.body.size,
//             categoryId: req.body.categoryId
//         }).then(() => {
//             res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
//         });
//     } catch (error) {
//         res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
//     }
// };

const addSize = async (req, res) => {
  try {
    // console.log(req.body);

    const insertedSizes = await Promise.all(req.body.size.map(async (sizeValue) => {
      return await sizemodel.create({
        size: sizeValue,
        categoryId: req.body.categoryId
      });
    }));

    res.status(200).json({ msg: "Data inserted successfully.", status: 1, insertedSizes });
  } catch (error) {
    res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
  }
};

const getAllSize = async (req, res) => { 
    const allSize = await sizemodel.find({});
    res.status(200).json({ allSize });
};

const getSizeByCategory = async (req, res) => { 
    const categoryId  = req.body.categoryId; 
    try {
        const size = await sizemodel.find({ categoryId });
        
        if (!size) {
            return res.status(404).json({ error: 'Sizes not found' });
        }
        res.status(200).json({ size });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteSize = async (req, res) => {
    // console.log(req.body)
    try {
        await sizemodel.findOneAndDelete({ _id: req.body.sizeId })
            
            .then((data) => {
                if (data) {
                    res.status(200).json({ msg: "Data deleted successfully.", status: 1 });                    
                } else {
                    res.status(400).json({ msg: "Error: Size cannot be deleted", status: 0 });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ msg: "Error: Size cannot be deleted", err: err, status: 0 });
            })
    } catch (error) {
        // console.log(error);
        res.status(400).json({ msg: "Error: Size cannot be deleted", err: error, status: 0 });
    } 
}

const updateSize = async (req, res) => { 
    try {
        // console.log(req.body);
        // return false;
        await sizemodel.findOneAndUpdate({ _id: req.body.sizeId }, {
            size: req.body.size,
            categoryId: req.body.categoryId
        }).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated.", err: error, status: 0 });
    }    
};
module.exports = { addSize, getAllSize, deleteSize, updateSize, getSizeByCategory };
// module.exports = { getAllSubCategory, addSubCategory, deleteSubCategory, updateSubCategory}