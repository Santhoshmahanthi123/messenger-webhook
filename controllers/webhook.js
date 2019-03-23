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
          callback(result[0]);
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
  Type.find({ option: option, optionId: optionId })
    .exec()
    .then(result => {
      console.log("####", result);
      callback(result.types);
    });
};
