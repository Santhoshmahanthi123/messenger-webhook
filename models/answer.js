const mongoose = require("mongoose");
const optionsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  optionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option"
  },
  answer: { type: String, required: true }
});
module.exports = mongoose.model("Answer", optionsSchema);
