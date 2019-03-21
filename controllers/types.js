const Type = require("../models/types");
const mongoose = require("mongoose");
exports.create_type = (req, res) => {
  const type = new Type({
    _id: new mongoose.Types.ObjectId(),
    type_1: req.body.type_1,
    type_2: req.body.type_2,
    type_3: req.body.type_3,
    optionId: req.body.optionId
  });

  type
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Types added",
        createdType: type
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.get_types = (req, res) => {
  Type.find()
    .then(result => {
      res.json({
        totalTypes: result.length,
        message: "Available types!",
        Types: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.delete_type = (req, res) => {
  Type.deleteOne({ _id: req.body.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Type deleted!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.update_type = (req, res) => {
  const id = req.body.id;
  Type.updateMany(
    { _id: id },
    {
      $set: {
        type_1: req.body.type_1,
        type_2: req.body.type_2,
        type_3: req.body.type_3
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Types updated!!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
