const constants = require("../../config/constant");
const response = require("../../config/response");
const WhiteList = require("../../models/WhiteList");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports.getAllWhiteList = async (req, res, next) => {
  //   let status='Pending';
  // if(req.body.status){
  //   status:req.body.status;
  // }
  const getList = await WhiteList.aggregate([
    {
      $match: {
        // status: status,
        // role: constants.CONST_USER_ROLE_STUDENT.toString(),
      },
    },

    { $sort: { createdAt: -1 } },
  ]);
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

module.exports.addWhiteList = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      contact_no: "required",
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

    let contact_number = req.body.contact_no;
    contact_number = contact_number.split(/\r|\r\n|\n/); ///\r|\r\n|\n/
    let arrayData = [];
    contact_number.forEach((element) => {
      console.log(element);
      // var str = element.replace(/\r?\n|\r/g, " ");
      //str = str.trim();
      arrayData.push({ phoneNo: element.trim() });
    });
    //WhiteList.insertMany()
    WhiteList.insertMany(arrayData);
    //  console.log(arrayData);
    //return;
    // const category = new WhiteList(req.body);
    // await category.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteWhiteList = async (req, res, next) => {
  try {
    await WhiteList.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
