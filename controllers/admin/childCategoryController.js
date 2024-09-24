const constants = require("../../config/constant");
const response = require("../../config/response");
const ChildSubCategory = require("../../models/ChildSubCategory");
const { path, dirname } = require("path");
const { Validator } = require('node-input-validator');
const helper = require('../../helper/hlp_common');
const slugify = require("slugify");
module.exports.getAllChildCategory= async (req, res, next) => {
  // const getList = await ChildSubCategory.find(
  //   { status: constants.CONST_DB_STATUS_ACTIVE },
  //   "name icon status _id"
  // );

  const getList = await ChildSubCategory.aggregate([
    {
       $match: {status: constants.CONST_DB_STATUS_ACTIVE},
    },
    {
      $lookup: { from: 'categories', localField: "CategoryId", foreignField: "_id", as: "category_details" }
    },
    {
      $lookup: { from: 'subcategories', localField: "SubCategoryId", foreignField: "_id", as: "SubCategory_details" }
    },
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


module.exports.addChildCategory = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await ChildSubCategory.findOne({
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
    req.body.icon=req.file.filename;
    req.body.slug = slugify(req.body.name);
    const category = new ChildSubCategory(req.body);
    await category.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteChildCategory = async (req, res, next) => {
  try {
    await ChildSubCategory.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateChildCategory = async (req, res, next) => {
  try {
    if(req.body.name ==''){
      delete req.body.name
    }else{
      req.body.slug = slugify(req.body.name);
    }
    if(req.body.status ==''){
      delete req.body.status
    }
 
   

    await ChildSubCategory.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
