const mongoose = require("mongoose");
const constants = require("../config/constant");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderSchema = mongoose.Schema({
  orderId: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    autopopulate: true,
    required: true,
  },
  user_Order_ID: {
    type: String,
    required: true,
    unique: true,
    maxLength: 150,
  },

  customer_name: {
    type: String,
    required: true,
    // unique: true,
    maxLength: 150,
  },
  customer_mobile_no: {
    type: String,
    required: true,
    // unique: true,
    maxLength: 150,
  },
  customer_email_id: {
    type: String,
    //required: true,
    default: "",
    //unique: true
  },
  customer_address1: {
    type: String,
    required: true,
    maxLength: 250,
  },
  customer_address2: {
    type: String,
    // required: true,
    maxLength: 250,
  },
  country: {
    type: String,
    // required: true,
    autopopulate: true,
  },
  state: {
    type: String,
    required: true,
    autopopulate: true,
  },
  city: {
    type: String,
    required: true,
    // unique: true,
    maxLength: 150,
  },
  zip_code: {
    type: String,
    // required: true,
    // unique: true,
    maxLength: 150,
  },
  amount: {
    type: Number,
    required: true,
  },
  discount_amount: {
    type: Number,
    // required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    maxLength: 250,
  },
  razorpay_payment_id: {
    type: String,
    default: "",
  },

  shipping_charge: {
    type: Number, 
    default:0
  },

  delivery_type: {
    type: String,
    enum: ["COD", "Prepaid"],
    default: "COD",
  },

  
  payment_status: {
    type: String,
    enum: ["Pending", "Process", "Success", "Failed"],
    default: "Pending",
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Process",
      "Shipped",
      "Cancelled",
      "Delivered",
      "Return",
      "Replace",
    ],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

OrderSchema.plugin(AutoIncrement, { inc_field: "orderId" });
module.exports = mongoose.model("Orders", OrderSchema);
