const constants = require("../config/constant");
const response = require("../config/response");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const mongoose = require("mongoose");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");

module.exports.getAllCategory = async (req, res, next) => {
  const getList = await Category.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "name slug description icon status _id"
  ).sort( {name: 1 } );
  let final_array = [];
  if (getList.length > 0) {
    getList.forEach(async (content) => {
      // let icon_url = content.icon
      //   ? process.env.IMAGE_PATH + content.icon
      //   : "";
     // content.icon = content.icon;

      // let subCategory = [] ;
      let sub_category = await SubCategory.find({
        CategoryId: mongoose.Types.ObjectId(content._id),
      });
      let obj = {
        _id: content._id,
        name: content.name,
        slug: content.slug,
        icon: content.icon,
        description: content.description,
        status: content.status,
        subCategory: sub_category,
      };

      final_array.push(obj);
      // console.log(obj);

      if (final_array.length == getList.length) {
        return response.returnTrue(
          req,
          res,
          res.translate("record_found"),
          final_array
        );
      }
    });
    // return response.returnTrue(
    //   req,
    //   res,
    //   res.translate("record_found"),
    //   getList
    // );
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
};
