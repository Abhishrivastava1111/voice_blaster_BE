const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const SubCategorySchema = mongoose.Schema({
    subCategoryId : {
        type: Number
    },
    name: { 
        type: String,
        required: true,
        // unique: true,
        maxLength: 150 
    },
    CategoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
         autopopulate: true,
    },
    slug: { 
        type: String,
        //required: true,
        default:""
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

SubCategorySchema.plugin(AutoIncrement, {inc_field: 'subCategoryId'});
module.exports = mongoose.model('SubCategory', SubCategorySchema);