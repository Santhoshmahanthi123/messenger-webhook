const mongoose = require("mongoose");
const optionsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },

  option_1: { type: String, required: true },
  option_2: { type: String, required: true },
  option_3: { type: String, required: true },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }
});
module.exports = mongoose.model("Option", optionsSchema);
