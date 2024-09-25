const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const AudioFileSchema = mongoose.Schema({
  audio_id : {
    type: Number,
  } ,

  audio_file_display_name : {
    type: String,
    required: true,
  },

  audio_file: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
    default: "pending",
  },

  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  upload_date: {
    type: Date,
    default: Date.now,
  },


  admin_action_date: {  
    type: Date 
    },

    
});

AudioFileSchema.index({ audio_file_display_name: 1, uploaded_by: 1 }, { unique: true });
AudioFileSchema.plugin(AutoIncrement, { inc_field: "audio_id" });
module.exports = mongoose.model("AudioFile", AudioFileSchema);
