const mongoose = require("mongoose");
const constants = require("../config/constant");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const StateSchema = mongoose.Schema({
  stateId: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
    //unique: true,
    maxLength: 150,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Countries",
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

StateSchema.plugin(AutoIncrement, { inc_field: "stateId" });
var States = (module.exports = mongoose.model("State", StateSchema));
