const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const TestimonialSchema = mongoose.Schema({
    testimonialId : {
        type: Number
    },
    name: { 
        type: String,
        required: true,
        // unique: true,
        maxLength: 150 
    },

    description: { 
        type: String,
        maxLength: 250 
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

TestimonialSchema.plugin(AutoIncrement, {inc_field: 'testimonialId'});
module.exports = mongoose.model('Testimonial', TestimonialSchema);