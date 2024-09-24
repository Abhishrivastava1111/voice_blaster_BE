const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const CompanySchema = mongoose.Schema({
    companyId : {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    company_profile: {
        type: String,
        default: ''
    },
    company: { 
        type: String,
        required: true,
        maxLength: 150 
    },
    url: {
        type: String,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId, ref: 'locations'
    },
    founded: {
        type: String,
        required: true,
    },
linkedIn_url: {
    type: String,
   // required: true,
},
    
    staff: {
        type: String,
       // required: true,
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId, ref: 'industries'
    },
    about_us: {
        type: String,
        required: true,
    },
    company_logo: {
        type: String,
        default: ''
    },
    company_video: {
        type: String,
        default: ''
    },
    company_pictures: {
        type: mongoose.Schema.Types.Array,
    },
    isVerified: {
        type: String,
        enum: [true, false],
        default: false
    },
    status: {
        type: String,
        enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE],
        default: constants.CONST_DB_STATUS_ACTIVE
    },
    number_of_hr: {
        type: Number,
        default: 1
    },
    interview_Schedulel_Left: {
        type: Number,
        default: 0
    },
    purchased_plan_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Subscription_plan'
      },
    createdAt: { type: Date, default: Date.now },
});

CompanySchema.plugin(AutoIncrement, {inc_field: 'companyId'});
var Degrees = module.exports = mongoose.model('Companies', CompanySchema);
