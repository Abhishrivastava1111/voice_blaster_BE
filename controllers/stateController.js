const constants = require("../config/constant");
const response = require("../config/response");
const Country = require("../models/Country");
const State = require("../models/State");
const { Validator } = require("node-input-validator");
const helper = require("./../helper/hlp_common");
const { path, dirname } = require("path");
const csvtojson = require("csvtojson");

module.exports.getAllState = async (req, res, next) => {
  const body = req.body;

  const v = new Validator(req.body, {
    country: "required",
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

  try {
    const getList = await State.find(
      { status: constants.CONST_DB_STATUS_ACTIVE, country_id: body.country },
      "name status _id"
    ).sort({ name: 1 });
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

module.exports.addState = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await State.findOne({
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
    const state = new State(req.body);
    await state.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteState = async (req, res, next) => {
  try {
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

    await State.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateState = async (req, res, next) => {
  try {
    if(req.body.name ==''){
      delete req.body.name
    }
    if(req.body.status ==''){
      delete req.body.status
    }
    if(req.body.country_id ==''){
      delete req.body.country_id
    }
    //check unique name
    // const checkUniqueName = await State.findOne({
    //   name: req.body.name.trim(),
    // });
    // if (checkUniqueName !== null) {
    //   return response.returnFalse(req, res, res.translate("name_unique"), []);
    // }
    await State.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
