const constants = require("../config/constant");
const response = require("../config/response");
const SubCategory = require("../models/SubCategory");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");

module.exports.getAllSubCategory = async (req, res, next) => {
  if(req.params.id !== 'undefined'){
 const getList = await SubCategory.find(
    { status: constants.CONST_DB_STATUS_ACTIVE, CategoryId: req.params.id },
    "name icon status _id"
  );
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
  }else{
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
 
};
