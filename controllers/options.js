const Option = require("../models/options");
const mongoose = require("mongoose");
const alert = require("alert-node");
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
      alert("option posted successfully!");
      res.render("home");
    })
    .catch(err => {
      alert("Please enter the question...");
      console.log(err);
    });
};

exports.get_options = (req, res) => {
  Option.find()
    .then(result => {
      res.json({
        totalOptions: result.length,
        message: "Available options!",
        options: result
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
        options: req.body.option
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      alert("option posted successfully!");
      console.log(result);
      res.render("home");
    })
    .catch(err => {
      console.log(err);
      alert("Please insert missing fields!");
    });
};
