const mongoose = require("mongoose");
const optionsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  options: [
    {
      type: String,
      required: true
    }
  ]
});
module.exports = mongoose.model("Option", optionsSchema);
