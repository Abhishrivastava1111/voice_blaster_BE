const mongoose = require("mongoose");
const constants = require("../config/constant");
var AutoIncrement = require("mongoose-sequence")(mongoose);
// const moment = require('moment-timezone');
// const dateIndia = moment.tz(Date.now(), "Asia/Calcutta");
const SendMessageSchema = mongoose.Schema({
  SendMessageId: {
    type: Number,
  },
  msg_count: {
    type: Number,
    required: true,
  },
  audio_file: {
    type: String,
    required: true,
  },
  contact_no: {
    type: Array,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  final_report_file: {
    type: String,
  },
  create_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  campaign_date: {
    type: Date,
    default: Date.now,
  },
  createdAt: { type: String },
  // createdAt: { type: Date, default:dateIndia},
  // createdTime: { type: String},

  // Completed_At: { type: Date },
  Completed_At: { type: String },

  // CompletedTimes: { type: String },
});

SendMessageSchema.plugin(AutoIncrement, { inc_field: "SendMessageId" });
module.exports = mongoose.model("SendMessage", SendMessageSchema);
