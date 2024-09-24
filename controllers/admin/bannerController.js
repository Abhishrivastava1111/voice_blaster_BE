const constants = require("../../config/constant");
const response = require("../../config/response");
const Banner = require("../../models/Banner");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");

module.exports.getBanner = async (req, res, next) => {
  const getList = await Banner.findOne({
    status: constants.CONST_DB_STATUS_ACTIVE,
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

module.exports.addBanner = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await Banner.findOne({});

    if (checkUniqueName == null) {
      if (req.files.sideBanner1?.length > 0) {
        req.body.sideBanner1 = process.env.IMAGE_PATH+req.files.sideBanner1[0].filename;
      } else {
        delete req.body.sideBanner1;
      }

      if (req.files.sideBanner2?.length > 0) {
        req.body.sideBanner2 = process.env.IMAGE_PATH+req.files.sideBanner2[0].filename;
      } else {
        delete req.body.sideBanner2;
      }

      if (req.files.footerBanner?.length > 0) {
        req.body.footerBanner = process.env.IMAGE_PATH+req.files.footerBanner[0].filename;
      } else {
        delete req.body.footerBanner;
      }
      //req.body.favicon_icon = req.files.logo[0].filename;
      const banner = new Banner(req.body);
      await banner.save();
    } else {

      if (req.files.sideBanner1?.length > 0) {
        req.body.sideBanner1 = process.env.IMAGE_PATH+req.files.sideBanner1[0].filename;
      } else {
        delete req.body.sideBanner1;
      }

      if (req.files.sideBanner2?.length > 0) {
        req.body.sideBanner2 = process.env.IMAGE_PATH+req.files.sideBanner2[0].filename;
      } else {
        delete req.body.sideBanner2;
      }

      if (req.files.footerBanner?.length > 0) {
        req.body.footerBanner = process.env.IMAGE_PATH+req.files.footerBanner[0].filename;
      } else {
        delete req.body.footerBanner;
      }


      await Banner.findByIdAndUpdate(req.body.id.trim(), req.body);
    }

    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
