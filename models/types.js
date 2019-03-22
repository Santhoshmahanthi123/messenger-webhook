const mongoose = require("mongoose");
const typesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  optionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option",
    required: true
  },
  option: { type: String, required: true },
  types: [{ type: String, required: true }]
});
module.exports = mongoose.model("Type", typesSchema);
