const Answer = require("../models/answer");
const mongoose = require("mongoose");
// const Questions = require("../models/question");
const Options = require("../models/options");
// exports.post_answer = (req, res) => {
//   const answer = new Answer({
//     _id: new mongoose.Types.ObjectId(),
//     answer: req.body.answer,
//     optionId: req.body.optionId
//   });

//   answer
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(200).json({
//         message: "Answer posted!",
//         postedAnswer: answer
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// };
exports.post_answer = (req, res) => {
  Options.find()
    .exec()
    .then(options => {
      const answer = new Answer({
        _id: new mongoose.Types.ObjectId(),
        answer: req.body.answer,
        optionId: req.body.optionId
      });
      answer
        .save()
        .then(result => {
          console.log(result);
          options.map(option => {
            if (option.id == result.optionId) {
              console.log("matched!");
            } else {
              console.log("not match!");
            }
          });

          res.status(200).json({
            message: "Answer posted!",
            postedAnswer: answer
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.get_answers = (req, res) => {
  Answer.find()
    .then(result => {
      res.json({
        totalOptions: result.length,
        message: "Available answers!",
        Answers: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.delete_answer = (req, res) => {
  Answer.deleteOne({ _id: req.body.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Answer deleted!"
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
  Answer.updateOne(
    { _id: id },
    {
      $set: {
        answer: req.body.answer
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Answer updated!!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
