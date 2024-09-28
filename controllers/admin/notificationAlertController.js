const NotificationAlert = require("../../models/NotificationAlertSchema");

// Add a notification
exports.addNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if ( !imageUrl) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newNotification = new NotificationAlert({
      title,
      message,
      imageUrl,
    });

    await newNotification.save();
    res.status(201).json({ message: "Notification created successfully", newNotification });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all active notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationAlert.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationAlert.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
