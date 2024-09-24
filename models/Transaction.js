const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const TransactionSchema = mongoose.Schema({
    TransactionId : {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    credit_type: {
        type: String,
        enum: ["Add", "Remove"],
        default: "Add"
    },
    NoOfSms: { 
        type: Number,
        required: true,
    },
    PerSmsPrice: { 
        type: String,
        required: true,
    },
    Description: {
        type: String,
    },

    create_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },    
createdAt: { type: Date, default: Date.now },
});

TransactionSchema.plugin(AutoIncrement, {inc_field: 'TransactionId'});
var Degrees = module.exports = mongoose.model('Transaction', TransactionSchema);
