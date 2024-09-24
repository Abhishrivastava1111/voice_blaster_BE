const constants = require("../config/constant");
const response = require("../config/response");
const ShipmentCharges = require("../models/ShipmentCharges");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");

module.exports.getShipmentcharges = async (req, res, next) => {
  const getList = await ShipmentCharges.findOne({});
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