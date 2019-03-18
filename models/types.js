const mongoose = require("mongoose");
const typesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer"
  },
  type_1: {
    type: String,
    required: true
  },
  type_2: {
    type: String,
    required: true
  },
  type_3: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Type", typesSchema);
