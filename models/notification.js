const mongoose = require("mongoose");

const constants = require("../config/constant");

const NotificationSchema = mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "users",
  
    // required: true,
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "users",
  
    // required: true,
  },

  tittle: {
    type: String,
    default: "",
    // required: true,
  },

  message: {
    type: String,
    default: "",
    // required: true,
  },

  response: {
    type: String,
    default: "",
    // required: true,
  },

  is_read: {
    type: Boolean,
    default: false,
    // required: true,
  },


  status: {
    type: String,

    enum: [
      constants.CONST_DB_STATUS_ACTIVE,

      constants.CONST_DB_STATUS_INACTIVE,

      constants.CONST_DB_STATUS_BLOCK,

      constants.CONST_DB_STATUS_SOFT_DELETE,

      constants.CONST_DB_STATUS_CANCEL,
    ],

    default: constants.CONST_DB_STATUS_ACTIVE,
  },

  createdAt: { type: Date, default: Date.now },

  isDeleted: { type: Boolean, default: false },
});

var Subscription = (module.exports = mongoose.model(
  "Notification",

  NotificationSchema
));
