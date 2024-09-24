const constants = require("../config/constant");
const response = require("../config/response");
const Products = require("../models/Products");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");
const mongoose = require("mongoose");
module.exports.getAllProduct = async (req, res, next) => {
  const getList = await Products.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "CategoryId SubCategoryId HomeCategoryId name mrp price image short_decription long_decription"
  );
  if (getList.length > 0) {
    // getList.forEach(async (content) => {
    //   let image_url = content.image
    //     ? process.env.IMAGE_PATH + content.image
    //     : "http://localhost:3002/images/1682359345247--WhatsApp Image 2023-04-20 at 11.32.04 AM.jpeg";
    //   content.image = image_url;
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

module.exports.getProductsByCategorySlug = async (req, res, next) => {
  const getList = await Products.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "CategoryId",
        foreignField: "_id",
        as: "category_details",
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "SubCategoryId",
        foreignField: "_id",
        as: "subCategory_details",
      },
    },
    {
      $lookup: {
        from: "homecategories",
        localField: "HomeCategoryId",
        foreignField: "_id",
        as: "homeCategory_details",
      },
    },
    {
      $match: {
        status: constants.CONST_DB_STATUS_ACTIVE,
        "category_details.slug": req.body.categorySlug,
      },
    },
     { $sort : {createdAt: -1} },
    //  { $limit:  limit },
    //  { $skip: offset }
  ]);
  if (getList.length > 0) {
    // getList.forEach(async (content) => {
    //   let image_url = content.image
    //     ? process.env.IMAGE_PATH + content.image
    //     : "http://localhost:3002/images/1682359345247--WhatsApp Image 2023-04-20 at 11.32.04 AM.jpeg";
    //   content.image = image_url;
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

module.exports.getProductsByCategorySlugAndSubCategory = async (req, res, next) => {
  const getList = await Products.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "CategoryId",
        foreignField: "_id",
        as: "category_details",
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "SubCategoryId",
        foreignField: "_id",
        as: "subCategory_details",
      },
    },
    {
      $lookup: {
        from: "homecategories",
        localField: "HomeCategoryId",
        foreignField: "_id",
        as: "homeCategory_details",
      },
    },
    {
      $match: {
        status: constants.CONST_DB_STATUS_ACTIVE,
        "category_details.slug": req.body.categorySlug,
        "subCategory_details.slug": req.body.subCategorySlug,
      },
    },
     { $sort : {createdAt: -1} },
    //  { $limit:  limit },
    //  { $skip: offset }
  ]);
  if (getList.length > 0) {
    // getList.forEach(async (content) => {
    //   let image_url = content.image
    //     ? process.env.IMAGE_PATH + content.image
    //     : "http://localhost:3002/images/1682359345247--WhatsApp Image 2023-04-20 at 11.32.04 AM.jpeg";
    //   content.image = image_url;
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

module.exports.getProductsByHomeCategorySlug = async (req, res, next) => {
  const getList = await Products.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "CategoryId",
        foreignField: "_id",
        as: "category_details",
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "SubCategoryId",
        foreignField: "_id",
        as: "subCategory_details",
      },
    },
    {
      $lookup: {
        from: "homecategories",
        localField: "HomeCategoryId",
        foreignField: "_id",
        as: "homeCategory_details",
      },
    },
    {
      $match: {
        status: constants.CONST_DB_STATUS_ACTIVE,
        "homeCategory_details.slug": req.body.homeCategorySlug,
      },
    },
     { $sort : {createdAt: -1} },
    //  { $limit:  limit },
    //  { $skip: offset }
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


module.exports.ProductDetails = async (req, res, next) => {
  const getList = await Products.findOne({ slug: req.params.slug });

  if (getList != "") {
  //  getList.image = getList.image ? process.env.IMAGE_PATH + getList.image : "";

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

module.exports.RelatedProducts = async (req, res, next) => {
  const getList = await Products.find({ CategoryId: req.params.id });

  if (getList != "") {
    getList.image = getList.image ? process.env.IMAGE_PATH + getList.image : "";

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

module.exports.productSearch = async (req, res, next) => {
  const getList = await Products.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "CategoryId",
        foreignField: "_id",
        as: "category_details",
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "SubCategoryId",
        foreignField: "_id",
        as: "subCategory_details",
      },
    },
    {
      $lookup: {
        from: "homecategories",
        localField: "HomeCategoryId",
        foreignField: "_id",
        as: "homeCategory_details",
      },
    },
    {
      $match: {
        status: constants.CONST_DB_STATUS_ACTIVE,
        name: {'$regex': req.body.search},
      },
    },
     { $sort : {createdAt: -1} },
    //  { $limit:  limit },
    //  { $skip: offset }
  ]);
  if (getList.length > 0) {
    // getList.forEach(async (content) => {
    //   let image_url = content.image
    //     ? process.env.IMAGE_PATH + content.image
    //     : "http://localhost:3002/images/1682359345247--WhatsApp Image 2023-04-20 at 11.32.04 AM.jpeg";
    //   content.image = image_url;
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

