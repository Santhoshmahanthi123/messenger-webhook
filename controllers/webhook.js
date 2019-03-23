const Question = require("../models/question");
const Option = require("../models/options");
const Type = require("../models/types");
exports.create_webhook = (questionId, callback) => {
  Question.find({ _id: questionId })
    .exec()
    .then(question => {
      console.log("Matched with question Id");
      Option.find({ questionId: questionId })
        .exec()
        .then(result => {
          callback(result[0]);
          res.json({ options: result[0] });
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
