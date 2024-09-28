const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const NotificationAlertSchema = mongoose.Schema({
  notificationId: {
    type: Number,
  },
  title: {
    type: String,
    maxLength: 100,
  },
  message: {
    type: String,
    maxLength: 500,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

NotificationAlertSchema.plugin(AutoIncrement, { inc_field: "notificationId" });
module.exports = mongoose.model("NotificationAlert", NotificationAlertSchema);
