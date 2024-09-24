const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);
const constants = require("../config/constant");

const supportSchema = mongoose.Schema({
  subject: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    autopopulate: true,
    required: true,
  },

  priority: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: [
      constants.CONST_DB_STATUS_ACTIVE,
      constants.CONST_DB_STATUS_INACTIVE,
    ],
    default: constants.CONST_DB_STATUS_ACTIVE,
  },
  createdAt: { type: Date, default: Date.now },
});

var Support = (module.exports = mongoose.model("support", supportSchema));
