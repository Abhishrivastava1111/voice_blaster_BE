const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);
const constants = require("../config/constant");
const MessageSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',  autopopulate: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',  autopopulate: true,
  },
  message: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

MessageSchema.plugin(AutoIncrement, { inc_field: "messageId" });
var messages = (module.exports = mongoose.model("Messages", MessageSchema));
