const constants = require("../config/constant");
const response = require("../config/response");
const HomeCategory = require("../models/HomeCategory");
const mongoose = require("mongoose");
const Products = require("../models/Products");
const { path, dirname } = require("path");
const { Validator } = require('node-input-validator');
const helper = require('../helper/hlp_common');

module.exports.getAllHomeCategory= async (req, res, next) => {
  const getList = await HomeCategory.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "name slug _id"
  );
  if (getList.length > 0) {
    let final_array = [];
    getList.forEach(async (content) => {
    
      let products = await Products.find({
        HomeCategoryId: mongoose.Types.ObjectId(content._id),
      });

     
      let obj = {
        _id: content._id,
        name: content.name,
        slug: content.slug,
        products: products,
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
