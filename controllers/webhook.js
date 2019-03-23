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
          callback(result[0].options);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
