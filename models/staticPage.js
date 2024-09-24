const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
const constants = require('../config/constant');

const pageSchema = mongoose.Schema({
    staticId : {
      type: Number
    },
    slug: {
      type: String,
      default: ''
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

pageSchema.plugin(AutoIncrement, {inc_field: 'staticId'});
var StaticPages = module.exports = mongoose.model('Pages', pageSchema);
