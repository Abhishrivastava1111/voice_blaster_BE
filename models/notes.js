const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
const constants = require('../config/constant');

const notesSchema = mongoose.Schema({
    title: {
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

var Notes = module.exports = mongoose.model('notes', notesSchema);
