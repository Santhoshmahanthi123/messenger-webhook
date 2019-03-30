const Question = require("../models/question");
const Option = require("../models/options");
const Type = require("../models/types");
exports.create_webhook = (questionId, callback) => {
  console.log("@@@@@@", questionId);
  Question.find({ _id: questionId })
    .exec()
    .then(question => {
      console.log("Matched with question Id", question[0]);
      let id = question[0]._id;
      console.log(id);
      Option.find({ questionId: id })
        .exec()
        .then(result => {
          callback(result);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.create_webhook_type = (option, optionId, callback) => {
  Type.find({ option: option, optionId: { $in: [optionId] } })
    .exec()
    .then(result => {
      console.log("####", result);
      callback(result);
    })
    .catch(err => {
      console.log(err);
    });
};
exports.create_webhook_subtype = (option, id, callback) => {
  Type.find({ option: option, _id: { $in: [id] } })
    .exec()
    .then(output => {
      console.log("####@@@", output);
      callback(output);
    })
    .catch(err => {
      console.log(err);
    });
};
