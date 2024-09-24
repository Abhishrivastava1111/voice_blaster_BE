const mongoose = require("mongoose");
const constants = require("../config/constant");
var AutoIncrement = require("mongoose-sequence")(mongoose);
// const moment = require('moment-timezone');
// const dateIndia = moment.tz(Date.now(), "Asia/Calcutta");
const ContactGroupSchema = mongoose.Schema({
  ContactGroupId: {
    type: Number,
  },
  contact_number_count: {
    type: Number,
    required: true,
  },
  group_name: {
    type: String,
    required: true,
  },
  contact_no: {
    type: Array,
  },
  create_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

ContactGroupSchema.plugin(AutoIncrement, { inc_field: "ContactGroupId" });
module.exports = mongoose.model("ContactGroup", ContactGroupSchema);
