const constants = require("../config/constant");
const response = require("../config/response");
const TempCart = require("../models/tempCart");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");
const mongoose = require("mongoose");
module.exports.getAllCartItem = async (req, res, next) => {
  // const { cartId } = req.params;
  let match_condition = {
    status: constants.CONST_DB_STATUS_ACTIVE,
    tmpUserID: req.body.tmpUserID,
  };
  const getList = await TempCart.aggregate([
    {
      $match: match_condition,
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "Product_details",
      },
    },

    { $sort: { createdAt: -1 } },
  ]);
  // const getList = await TempCart.find(
  //   { status: constants.CONST_DB_STATUS_ACTIVE },
  //   "productId quantity tmpUserID createdAt"
  // );
  if (getList.length > 0) {
    // getList.forEach(async (content) => {
    //   let image_url =(content.Product_details)?"http://localhost:3002/images/" + content.Product_details[0].image:"http://localhost:3002/images/1682359345247--WhatsApp Image 2023-04-20 at 11.32.04 AM.jpeg";
    //   content.Product_details[0].image = image_url;
    // });
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

module.exports.addToCart = async (req, res, next) => {
  try {
    const checkUniqueProduct = await TempCart.findOne({
      productId: req.body.productId.trim(),
      tmpUserID:req.body.tmpUserID.trim(),
    });
    if (checkUniqueProduct !== null) {
      return response.returnFalse(req, res, res.translate("you_are_already_add_this_product"), []);
    }
    const cart = new TempCart(req.body);
    await cart.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteCart = async (req, res, next) => {
  try {
    await TempCart.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateCart = async (req, res, next) => {
  try {
    if (req.body.productId == "") {
      delete req.body.productId;
    }
    if (req.body.quantity == "") {
      delete req.body.quantity;
    }
    await TempCart.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
