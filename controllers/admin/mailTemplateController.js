const constants = require("../../config/constant");
const response = require("../../config/response");
const path = require("path");
const Jobs = require("../../models/Jobs");
const { Validator } = require("node-input-validator");
const { isValidObjectId, model } = require("mongoose");
const slug = require('slug')
const helper = require("./../../helper/hlp_common");
const MailTemplate = require("../../models/MailTemplate");
module.exports.getAll = async (req, res, next) => {
  let v;
  v = new Validator(req.body, {
    page: "required|integer|between:1,1000",
    search: "alpha",
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
//status: constants.CONST_DB_STATUS_ACTIVE 
  try {
    const getList = await MailTemplate.find(
      { },
      "name uniqueId description _id status"
    ).sort({
      name: "ASC",
    });

    if (getList.length > 0) {
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
  } catch (e) {
    return response.returnFalse(
      req,
      res,
      res.translate("oops_please_try_again"),
      {}
    );
  }
};

module.exports.store = async (req, res, next) => {
  await MailTemplate.create(
    {
      name: "Registration",
      uniqueId: "registration",
      description: "",
    },
    {
      name: "Forgot Password",
      uniqueId: "forgot_password",
      description: "",
    }
  );
  return response.returnFalse(req, res, res.translate("no_record_found"), []);
};

module.exports.update = async (req, res, next) => {
  try {
    //check unique name
    if (req.body.name == "") {
      delete req.body.name;
    }
    if (req.body.description == "") {
      delete req.body.description;
    }
    if (req.body.status == "") {
      delete req.body.status;
    }
    const checkUniqueName = await MailTemplate.findOne({
      _id: { $ne: req.params.id },
      name: req.body.name,
    });
    if (checkUniqueName !== null) {
      return response.returnFalse(req, res, res.translate("name_unique"), []);
    }
    await MailTemplate.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.add = async (req, res, next) => {
    let v;
    v = new Validator(req.body, {
        name: "required",
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
  //check unique name
  const checkUniqueName = await MailTemplate.findOne({
    name: req.body.name.trim(),
  });
  if (checkUniqueName !== null) {
    return response.returnFalse(req, res, res.translate("name_unique"), []);
  }
  if(req.body.name){
    req.body.uniqueId= slug(req.body.name.trim(), '_')
  }
  const mailTemplate = new MailTemplate({
    name: req.body.name,
    description: req.body.description,
    uniqueId:req.body.uniqueId,
    status: req.body.status,
  });
  await mailTemplate.save();
  return response.returnTrue(req, res, res.translate("added_success"), []);
};

module.exports.delete = async (req, res, next) => {
  try {
    const check = await MailTemplate.findOne({
      _id: req.params.id.trim(),
    });
    if (check == null) {
      return response.returnFalse(
        req,
        res,
        res.translate("invalid_object"),
        []
      );
    }

    await MailTemplate.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
