const constants = require("../config/constant");
const response = require("../config/response");
const Slider = require("../models/Slider");
const mongoose = require("mongoose");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");

module.exports.getAllSlider = async (req, res, next) => {
  const getList = await Slider.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "name slug image status _id"
  ).sort( {sort_order: 1 } );
  let final_array = [];
  if (getList.length > 0) {

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
