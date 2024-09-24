const mongoose = require('mongoose');
const constants = require('../config/constant');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const EmployerSchema = mongoose.Schema({
    employerId : {
        type: Number
    },
    job_title: {
        type: String,
        required: true,
        maxLength: 150
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    linkedIn_url: {
        type: String,
    },
    gender: {
        type: String,
        enum: [constants.CONST_GENDER_MALE, constants.CONST_GENDER_FEMALE, constants.CONST_GENDER_OTHER],
        default: constants.CONST_GENDER_MALE
    },
    birth_date: {
        type: String,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId, ref: 'cities'
    },
    country: {
        type: mongoose.Schema.Types.ObjectId, ref: 'counters'
    },
    createdAt: { type: Date, default: Date.now },
});

EmployerSchema.plugin(AutoIncrement, {inc_field: 'employerId'});
var Employer = module.exports = mongoose.model('employers', EmployerSchema);
