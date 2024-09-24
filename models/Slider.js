const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const SliderSchema = mongoose.Schema({
    sliderId : {
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
        required: true,
        unique: true,
        maxLength: 150 
    },
    image: { 
        type: String,
        //required: true,
        default : ""
        //unique: true
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

SliderSchema.plugin(AutoIncrement, {inc_field: 'sliderId'});
module.exports = mongoose.model('Slider', SliderSchema);