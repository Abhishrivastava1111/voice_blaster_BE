const constants = require("../config/constant");
const response = require("../config/response");
const Message = require("../models/Message");
const { path, dirname } = require("path");
const csvtojson = require("csvtojson");
const { Validator } = require("node-input-validator");
const helper = require("./../helper/hlp_common");

module.exports.getMessage = async (req, res, next) => {
  try {
    // let getList = [];

    const getMessages = await Message.find({
      $or: [
        {
          fromUserId: req.body.fromUserId,
          toUserId: req.body.toUserId,
        },
        {
          fromUserId: req.body.toUserId,
          toUserId: req.body.fromUserId,
        },
      ],
    });

    if (getMessages.length > 0) {
      return response.returnTrue(
        req,
        res,
        res.translate("record_found"),
        getList
      );
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        []
      );
    }
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};
