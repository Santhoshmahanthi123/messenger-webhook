const Option = require("../models/options");
const mongoose = require("mongoose");
exports.create_option = (req, res) => {
  const option = new Option({
    _id: new mongoose.Types.ObjectId(),
    options: req.body.options,
    questionId: req.body.questionId
  });
  option
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Options added",
        createdOption: option
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.get_options = (req, res) => {
  Option.find()
    .then(result => {
      res.json({
        totalOptions: result.length,
        message: "Available options!",
        Options: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.delete_option = (req, res) => {
  Option.deleteOne({ _id: req.body.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Option deleted!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.update_option = (req, res) => {
  const id = req.body.id;
  Option.updateMany(
    { _id: id },
    {
      $push: {
        options: req.body.options
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Option updated!!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
