const Type = require("../models/types");
const mongoose = require("mongoose");
const alert = require("alert-node");
exports.create_type = (req, res) => {
  const type = new Type({
    _id: new mongoose.Types.ObjectId(),
    optionId: req.body.optionId,
    option: req.body.option,
    types: req.body.types
  });
  type
    .save()
    .then(result => {
      console.log(result);
      alert("Types posted successfully!");
      res.render("home");
    })
    .catch(err => {
      alert("Please enter the type...");
      console.log(err);
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
      $push: {
        types: req.body.types
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
