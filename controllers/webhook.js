const Question = require("../models/question");
const Option = require("../models/options");
const Type = require("../models/types");
exports.create_webhook = questionId => {
  console.log("@@@@@@", questionId);
  Question.find({ _id: questionId })
    .exec()
    .then(question => {
      console.log("Matched with question Id", question[0]);
      Option.find({ questionId: question[0]._id })
        .exec()
        .then(result => {
          //   callback(result[0]);
          console.log("options:", result[0]);
          //   console.log("Choose your option!", result[0].options);
          result[0].options.map(option => {
            if (option == choose) {
              console.log("You have choosen:", option);
              Type.find({ option: option })
                .exec()
                .then(type => {
                  console.log(type[0].types[0]);
                })
                .catch(err => {
                  console.log(err);
                });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
