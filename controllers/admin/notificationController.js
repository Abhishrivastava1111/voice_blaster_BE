const { default: mongoose, isValidObjectId } = require("mongoose");
const constant = require("../../config/constant");
const response = require("../../config/response");
const helper = require("../../helper/hlp_common");
const notification = require("../../models/notification");
module.exports.createNotification = async (
  //   sender_id,
  receiver_id,
  tittle,
  message
) => {
  try {
    let obj = {};

    // Create a new card document
    const notificationData = new notification({
      receiver_id: receiver_id,
      tittle: tittle,
      message: message,
    });

    // Save the card document to the database
    const savedNotificationData = await notificationData.save();
    if (savedNotificationData) {
      return { status: true };
    } else {
      return {
        status: false,
        message: "Something went wrong for sending notification",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

module.exports.listNotifications = async (req, res) => {
  try {
    // Extract the user's ID from the token in the request headers
    const id = helper.loginUserId(req.headers["x-access-token"]);
    // create a match object to store filter conditions
    const matchObject = {
      isDeleted: false,
      receiver_id: id,
    };

    let limit = parseInt(constant.PAGINATION_LIMIT);
    let page_no = req.body.page_no == 0 ? 1 : req.body.page_no;
    let offset = (page_no - 1) * limit;

    // find the document that matches the filter conditions
    const getList = await notification.find(matchObject, null, {
      sort: { createdAt: -1 },
      limit,
      skip: offset,
    });
    if (getList.length > 0) {
      const unread = getList.filter(
        (notification) => !notification.is_read
      ).length;
      return response.returnTrue(req, res, res.translate("record_found"), {
        getList,
        unread,
      });
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        []
      );
    }
  } catch (error) {
    return response.returnFalse(req, res, error.message);
  }
};
module.exports.NotificationRead = async (req, res) => {
  try {
    // Extract the user's ID from the token in the request headers
    const tokenId = helper.loginUserId(req.headers["x-access-token"]);
    const { id } = req.body;
    const matchObject = { receiver_id: tokenId };

    const updateObject = { is_read: true };

    const result = id
      ? id.length > 0
        ? await notification.findByIdAndUpdate(id, updateObject)
        : null
      : await notification.updateMany(matchObject, updateObject);

    if (result) {
      return response.returnTrue(req, res, res.translate("update_success"));
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("oops_please_try_again")
      );
    }
  } catch (error) {
    return response.returnFalse(req, res, error.message);
  }
};
