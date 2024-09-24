const mongoose = require("mongoose");
const constants = require("../config/constant");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderDetailSchema = mongoose.Schema({
  orderDetailId: {
    type: Number,
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders",
    autopopulate: true,
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    autopopulate: true,
  },
  size: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
  texts: {
    type: Array,
    required: false,
  },
  images: {
    type: Array,
    required: false,
  },

  createdAt: { type: Date, default: Date.now },
});

OrderDetailSchema.plugin(AutoIncrement, { inc_field: "orderDetailId" });
module.exports = mongoose.model("OrderDetails", OrderDetailSchema);
