const mongoose = require("mongoose");
const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  question: { type: String, required: true, ref: "Option" }
});
module.exports = mongoose.model("Question", questionSchema);
