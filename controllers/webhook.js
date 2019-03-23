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
  Type.find({ _id: { $in: [id] }, option: option })
    .exec()
    .then(result => {
      console.log("####", result[0]);
      callback(result);
    })
    .catch(err => {
      console.log(err);
    });
};

// db.types.find({"optionId":{"$in":[ObjectId("5c94d940a753423e79ee8d97")]},"option":"Today"})
// db.types.find({"_id":{"$in":[ObjectId("5c94e1613ac847442060c301")]},"option":"Google"})
