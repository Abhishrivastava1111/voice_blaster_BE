const mongoose = require("mongoose");
const constants = require("../config/constant");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const whiteListSchema = mongoose.Schema({
  whiteListId: {
    type: Number,
  },

  phoneNo: {
    type: String,
    //required: true,
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

whiteListSchema.plugin(AutoIncrement, { inc_field: "whiteListId" });
module.exports = mongoose.model("WhiteList", whiteListSchema);
