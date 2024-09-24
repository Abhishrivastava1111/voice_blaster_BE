const constants = require("../config/constant");
const response = require("../config/response");
const Notes = require("../models/notes");
const SubCategory = require("../models/SubCategory");
const mongoose = require("mongoose");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");

module.exports.getAllNotes = async (req, res, next) => {
  const getList = await Notes.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "title status _id"
  ).sort({ name: 1 });
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
