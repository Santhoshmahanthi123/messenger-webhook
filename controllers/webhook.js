const Question = require("../models/question");
const Option = require("../models/options");
const Type = require("../models/types");

exports.create_webhook = (questionId, choose, callback) => {
  Question.find({ _id: questionId })
    .exec()
    .then(question => {
      console.log("Matched with question Id", question);
      Option.find({ questionId: questionId })
        .exec()
        .then(result => {
          callback(result[0].options);
          res.json({ options: result[0].options });
          console.log("Choose your option!", result[0].options);
          result[0].options.map(option => {
            if (option == choose) {
              console.log("You have choosen:", option);
              Type.find({ option: option })
                .exec()
                .then(type => {
                  console.log(type[0].types[0]);
                })
                .catch(err => {
                  consolele.log(err);
                });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      consolelog(err);
    });
};
