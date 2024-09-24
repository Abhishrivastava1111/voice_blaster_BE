const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const LanguageSchema = mongoose.Schema({
    languageId : {
        type: Number
    },
    name: { 
        type: String,
        required: true,
        // unique: true,
        maxLength: 150 
    },
    status: {
        type: String,
        enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE],
        default: constants.CONST_DB_STATUS_ACTIVE
    },
    country: { 
        type: String,
        default:""
    },
    createdAt: { type: Date, default: Date.now },
});

LanguageSchema.plugin(AutoIncrement, {inc_field: 'languageId'});
var Languages = module.exports = mongoose.model('Languages', LanguageSchema);