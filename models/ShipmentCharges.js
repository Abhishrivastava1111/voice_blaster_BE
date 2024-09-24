const mongoose = require("mongoose");
const constants = require("../config/constant");
const ShipmentChargesSchema = mongoose.Schema({
  cod_charge: {
    type: String,
    default: 0,
  },
  prepaid_charge: {
    type: String,
    default: 0,
  },
  free_shipping_order_amount: {
    type: String,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("shipment_charges", ShipmentChargesSchema);
