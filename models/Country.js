const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const CountrySchema = mongoose.Schema({
    countryId : {
        type: Number
    },
    name: { 
        type: String,
        required: true,
        // unique: true,
        maxLength: 150 
    },
    code: { 
        type: String,
        //required: true,
        default : ""
        //unique: true
    },
    phone_code: { 
        type: String,
        //required: true,
        default:""
        //unique: true
    },
    status: {
        type: String,
        enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE],
        default: constants.CONST_DB_STATUS_ACTIVE
    },
    createdAt: { type: Date, default: Date.now },
});

CountrySchema.plugin(AutoIncrement, {inc_field: 'countryId'});
var Countries = module.exports = mongoose.model('Countries', CountrySchema);