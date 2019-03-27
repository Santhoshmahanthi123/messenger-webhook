const Question = require("../models/question");
const mongoose = require("mongoose");
const alert = require("alert-node");
exports.create_question = (req, res) => {
  const question = new Question({
    _id: new mongoose.Types.ObjectId(),
    question: req.body.question
  });
  question
    .save()
    .then(result => {
      console.log(result);
      alert("Question posted successfully!");
      res.render("home");
    })
    .catch(err => {
      alert("Please enter the question...");
      console.log(err);
    });
};
exports.get_questions = (req, res) => {
  Question.find()
    .then(result => {
      res.json({
        totalQuestions: result.length,
        message: "Available questions!",
        questions: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.delete_question = (req, res) => {
  Question.deleteOne({ _id: req.body.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Question deleted!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.update_question = (req, res) => {
  const id = req.body.id;
  Question.updateOne(
    { _id: id },
    { $set: { question: req.body.question } },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Question updated!!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
