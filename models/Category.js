const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const CategorySchema = mongoose.Schema({
    categoryId : {
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
    
    slug: { 
        type: String,
        required: true,
        unique: true,
        maxLength: 150 
    },
    icon: { 
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

CategorySchema.plugin(AutoIncrement, {inc_field: 'categoryId'});
module.exports = mongoose.model('Category', CategorySchema);