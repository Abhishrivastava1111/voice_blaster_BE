const constants = require("../../config/constant");
const response = require("../../config/response");
const ContactGroup = require("../../models/ContactGroup");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");
const mongoose = require("mongoose");
const moment = require("moment");

const http = require("http");
const axios = require("axios");
const User = require("../../models/User");
const WhiteList = require("../../models/WhiteList");

module.exports.getAllContactGroup = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE
  // const getList = await SendMessage.find();

  let status = "Pending";
  if (req.body.status) {
    status: req.body.status;
  }
  const getList = await ContactGroup.aggregate([
    {
      $match: {
        // status: status,
        create_by: mongoose.Types.ObjectId(req.user.id),
        // role: constants.CONST_USER_ROLE_STUDENT.toString(),
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "create_by",
        foreignField: "_id",
        as: "createBy_user_details",
      },
    },

    { $sort: { createdAt: -1 } },
  ]);
  if (getList.length > 0) {
  console.log("get data ==>", getList)
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
module.exports.addContactGroup = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      group_name: "required",
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

   
    req.body.create_by = req.user.id;
  
    let contact_number = req.body.contact_no;
    req.body.contact_no = contact_number.split(/\r\n/); ///\r|\r\n|\n/
   
    contact_number=contact_number.trim()
    // console.log(text)
    // alert(text)
    var lines = contact_number.split(/\r|\r\n|\n/);
      req.body.contact_number_count = lines.length;//req.body.contact_no.length;
     
      // let contact_numbers = req.body.contact_no;     

      // const contact_numbers_str = numbers.replace(/,*$/, "");

      const sendMsg = new ContactGroup(req.body);
      await sendMsg.save();
      return response.returnTrue(req, res, res.translate("added_success"), []);
 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteContactGroup = async (req, res, next) => {
  try {
    // const checkDdata = await Category.findOne({
    // _id: req.params.id.trim(),
    // });
    // console.log(checkDdata.icon);
    // let filePath = process.env.IMAGE_PATH + checkDdata.icon;
    // fs.unlinkSync(filePath);
    await ContactGroup.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateContactGroup = async (req, res, next) => {
  try {
    let obj = {};

    // else{
    //   req.body.slug = slugify(req.body.name);
    // }

    const icon = req.file?.filename;
    if (icon) {
      obj.final_report_file = process.env.IMAGE_PATH + icon;
      // delete obj.icon;
    } else {
      delete obj.final_report_file;
    }
    await ContactGroup.findByIdAndUpdate(req.params.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

