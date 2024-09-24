const constants = require("../../config/constant");
const response = require("../../config/response");
const Products = require("../../models/Products");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const mongoose = require('mongoose');
module.exports.getAllProduct = async (req, res, next) => {
  // const getList = await Products.find(
  //   { status: constants.CONST_DB_STATUS_ACTIVE },
  //   "CategoryId SubCategoryId HomeCategoryId name mrp price image short_decription long_decription"
  // );
  //status: constants.CONST_DB_STATUS_ACTIVE
  const getList = await Products.aggregate([
    {
      $match: {},
    },
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
  ]);
  if (getList.length > 0) {
    // getList.forEach(async (content) => {
    //   let image_url = content.image≠
    //     ? process.env.IMAGE_PATH + content.image
    //     : "";
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

module.exports.addProduct = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await Products.findOne({
      name: req.body.name.trim(),
    });
    if (checkUniqueName !== null) {
      return response.returnFalse(req, res, res.translate("name_unique"), []);
    }
    let v = new Validator(req.body, {
      name: "required|string",
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
    // req.body.image = process.env.IMAGE_PATH + req.file?.filename;
    // console.log(req.file?.filename);
    let images = Array();
    let product_images = Array();

    product_images = req.files;
    for (const val of product_images) {
      images.push(process.env.IMAGE_PATH + val.filename);
    }
    req.body.image = images;
    // console.log(images);

    if (req.body.SubCategoryId == "" || req.body.SubCategoryId == undefined) {
      delete req.body.SubCategoryId;
    }

    if (req.body.HomeCategoryId == "" || req.body.HomeCategoryId == undefined) {
      delete req.body.HomeCategoryId;
    }

    // req.body.icon=req.file.filename;
    req.body.slug = slugify(req.body.name);
    const product = new Products(req.body);
    await product.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateProduct = async (req, res, next) => {
  try {
    const checkData = await Products.findOne({
      _id: req.params.id.trim(),
    });
    if (req.body.name == "") {
      delete req.body.name;
    } else {
      req.body.slug = slugify(req.body.name);
    }
    if (req.body.status == "") {
      delete req.body.status;
    }

    if (req.body.SubCategoryId == "--select--") {
      delete req.body.SubCategoryId;
    } else {
      req.body.SubCategoryId = null;
    }
    if (req.body.SubCategoryId == "") {
      delete req.body.SubCategoryId;
    } else {
      req.body.SubCategoryId = null;
    }

    //const icon = req.file?.filename;

    let images = Array();
    let product_images = Array();

    product_images = req.files;
    for (const val of product_images) {
      images.push(process.env.IMAGE_PATH + val.filename);
    }
    if (images.length > 0) {
      // req.body.images = images;
      images = images.concat(checkData.image);
      req.body.image = images;
    } else {
      delete req.body.image;
    }

    // if (icon) {
    //   console.log(icon);
    //   req.body.image = process.env.IMAGE_PATH + icon;
    // } else {
    //   delete req.body.image;
    // }
    await Products.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getProduct = async (req, res, next) => {
  // const getList = await Products.find(
  //   { status: constants.CONST_DB_STATUS_ACTIVE },
  //   "CategoryId SubCategoryId HomeCategoryId name mrp price image short_decription long_decription"
  // );
  //status: constants.CONST_DB_STATUS_ACTIVE
  const getList = await Products.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.body.id),
        status: constants.CONST_DB_STATUS_ACTIVE
      },
    },
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
  ]);
  if (getList.length > 0) {
    return response.returnTrue(
      req,
      res,
      res.translate("record_found"),
      getList[0]
    );
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
};

module.exports.deleteProductImage = async (req, res, next) => {
  try {
    const checkData = await Products.findOne({
      _id: req.body.id.trim(),
    });

    let images = Array();
    images = checkData.image;

    var filteredImageArray = images.filter((e) => e !== req.body.image);

    const obj = {
      image: filteredImageArray,
    };
    await Products.findByIdAndUpdate(req.body.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
