const constants = require("../config/constant");
const response = require("../config/response");
const WebsiteInfo = require("../models/WebsiteInfo");
const { Validator } = require("node-input-validator");
const helper = require("./../helper/hlp_common");

module.exports.getWebsiteInfo = async (req, res, next) => {
  const getList = await WebsiteInfo.findOne({
    // status: constants.CONST_DB_STATUS_ACTIVE,
  });
  if (getList != undefined) {
    return response.returnTrue(
      req,
      res,
      res.translate("record_found"),
      getList
    );
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
};

module.exports.websiteOn = async (req, res, next) => {
  const getList = await WebsiteInfo.findOne({});
  if (getList != undefined) {
    await WebsiteInfo.findByIdAndUpdate(getList._id, { status: "Active" });
    return response.returnTrue(req, res, "Website Active successfully", {});
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
};
