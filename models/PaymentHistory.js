const mongoose = require("mongoose");
const constants = require("../config/constant");
const paymentHistoryShema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      constants.CONST_USER_ROLE_EMPLOYER,
      constants.CONST_USER_ROLE_STUDENT,
    ],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription_plan",
    // required: true,
  },
  amount: {
    type: Number,
    // required: true,
  },
  paymentIntentId: {
    type: String,
    // required: true,
  },
  paymentStatus: {
    type: String,
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

var PaymentHistory = (module.exports = mongoose.model(
  "Payment_history",
  paymentHistoryShema
));
