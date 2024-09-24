const constants = require("../../config/constant");
const response = require("../../config/response");
const Banner = require("../../models/Banner");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");

module.exports.getAllBanner = async (req, res, next) => {
  const getList = await Banner.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "name icon status _id"
  );
  if (getList.length > 0) {
    getList.forEach(async (content) => {
      // let icon_url = content.icon ? process.env.IMAGE_PATH + content.icon : "";
      content.icon = content.icon;
    });
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
    const checkUniqueName = await Banner.findOne({
      name: req.body.name.trim(),
    });
    if (checkUniqueName !== null) {
      return response.returnFalse(req, res, res.translate("name_unique"), []);
    }
    let v = new Validator(req.body, {
      name: "required|string",
      
    });
    let matched = await v.check();
    if (!matched) {
      return response.returnFalse(
        req,
        res,
        helper.validationErrorConvertor(v),
        {}
      );
    }
    req.body.image = process.env.IMAGE_PATH +req.file.filename;
   
    const banner = new Banner(req.body);
    await banner.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteBanner = async (req, res, next) => {
  try {
     await Banner.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateBanner = async (req, res, next) => {
  try {
    if (req.body.name == "") {
      delete req.body.name;
    }

    if (req.body.status == "") {
      delete req.body.status;
    }
    if (req.body.url == "") {
      delete req.body.url;
    }
    if (req.body.image == "") {
      delete req.body.image;
    }

    const image = req.file === undefined ? "" : `${req.file.location}`;
    if (image) {
      req.body.image = process.env.IMAGE_PATH +image;
    }
    await Banner.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
