const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const HomeCategorySchema = mongoose.Schema({
    HomeCategoryId : {
        type: Number
    },
    name: { 
        type: String,
        required: true,
        // unique: true,
        maxLength: 150 
    },
    slug: { 
        type: String,
        default:""
    },
    sort_order: { 
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

HomeCategorySchema.plugin(AutoIncrement, {inc_field: 'homeCategoryId'});
module.exports = mongoose.model('HomeCategory', HomeCategorySchema);