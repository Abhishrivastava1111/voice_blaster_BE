const constants = require("../../config/constant");
const response = require("../../config/response");
const WebsiteInfo = require("../../models/WebsiteInfo");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");

module.exports.getWebsiteInfo = async (req, res, next) => {
  const getList = await WebsiteInfo.findOne({
    // status: constants.CONST_DB_STATUS_ACTIVE,
  });
  if (getList !=undefined) {
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

module.exports.addUpdateWebsiteInfo = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await WebsiteInfo.findOne({});

    if (checkUniqueName== null) {
      if (req.files.logo.length > 0) {
        req.body.logo = process.env.IMAGE_PATH+req.files.logo[0].filename;
      } else {
        delete req.body.logo;
      }

      if (req.files.favicon_icon.length > 0) {
        req.body.favicon_icon = process.env.IMAGE_PATH+req.files.favicon_icon[0].filename;
      } else {
        delete req.body.favicon_icon;
      }

      //req.body.favicon_icon = req.files.logo[0].filename;
      const websiteInfo = new WebsiteInfo(req.body);
      await websiteInfo.save();
    } else {

      if (req.files.logo?.length > 0) {
        req.body.logo = process.env.IMAGE_PATH+req.files.logo[0].filename;
      } else {
        delete req.body.logo;
      }

      if (req.files.favicon_icon?.length > 0) {
        req.body.favicon_icon = process.env.IMAGE_PATH+req.files.favicon_icon[0].filename;
      } else {
        delete req.body.favicon_icon;
      }

      await WebsiteInfo.findByIdAndUpdate(req.body.id.trim(), req.body);
    }

    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
