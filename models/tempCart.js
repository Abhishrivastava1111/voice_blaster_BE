const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const tempCartSchema = mongoose.Schema({
    tempCartId : {
        type: Number
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products', 
         autopopulate: true,
    },
    quantity: { 
        type: Number,
        required: true,
    },
    tmpUserID: {
        type: String,
        default: ''
      },
    status: {
        type: String,
        enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE],
        default: constants.CONST_DB_STATUS_ACTIVE
    },
    createdAt: { type: Date, default: Date.now },
});

tempCartSchema.plugin(AutoIncrement, {inc_field: 'tempCartId'});
module.exports = mongoose.model('TempCart', tempCartSchema);