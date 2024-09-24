const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = mongoose.Schema({
    userId : {
        type: Number
    },
    
    name: {
            type: String,
            required: true,
            camelCase: true
        },
    company: {
        type: String,
    },
    // lastname: {
    //     type: String,
    //     required: true,
    //     camelCase: true
    // },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        maxLength: 150
    },
    mobile_no: {
        type: Number,
        trim: true,
        required: true,
        // unique: true,
        maxLength: 15
    },
    role: {
        type: String,
        required: true,
        enum: [constants.CONST_USER_ROLE_STUDENT, constants.CONST_USER_ROLE_EMPLOYER, constants.CONST_USER_ROLE_ADMIN, constants.CONST_USER_ROLE_SUB_ADMIN],
        default: constants.CONST_USER_ROLE_STUDENT
    },
    password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: String,
        required: true,
        enum: [ constants.CONST_USER_VERIFIED_TRUE, constants.CONST_USER_VERIFIED_FALSE ],
        default: constants.CONST_USER_VERIFIED_FALSE
    },
    profile_image: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    address2: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    zip_code: {
        type: String,
        default: ''
    },
    accountVerified: {
      type: String,
      required: true,
      enum: [ constants.CONST_USER_VERIFIED_TRUE, constants.CONST_USER_VERIFIED_FALSE ],
      default: constants.CONST_USER_VERIFIED_FALSE
    },
    otp: {
        type: String,
        default: ''
    },
    balance: {
        type: Number,
        default: 0
    },
    create_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    status: {
        type: String,
        enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE, constants.CONST_DB_STATUS_BLOCK, constants.CONST_DB_STATUS_SOFT_DELETE],
        default: constants.CONST_DB_STATUS_ACTIVE
    },
    createdAt: { type: Date, default: Date.now },
});

UserSchema.plugin(AutoIncrement, {inc_field: 'userId'});
var Degrees = module.exports = mongoose.model('Users', UserSchema);
