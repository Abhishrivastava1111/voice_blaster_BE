const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
const constants = require('../config/constant');

const mailSchema = mongoose.Schema({
    mailTemplateId : {
      type: Number
    },
    name: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    uniqueId: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE],
      default: constants.CONST_DB_STATUS_ACTIVE
    },
    createdAt: { type: Date, default: Date.now },
});

mailSchema.plugin(AutoIncrement, {inc_field: 'mailTemplateId'});
var Students = module.exports = mongoose.model('MailTemplates', mailSchema);
