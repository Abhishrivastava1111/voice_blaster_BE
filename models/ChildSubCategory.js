const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const ChildSubCategorySchema = mongoose.Schema({
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
    SubCategoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory', 
         autopopulate: true,
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

ChildSubCategorySchema.plugin(AutoIncrement, {inc_field: 'childSubCategoryId'});
module.exports = mongoose.model('ChildSubCategory', ChildSubCategorySchema);