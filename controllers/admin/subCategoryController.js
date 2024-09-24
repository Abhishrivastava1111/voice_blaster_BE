const constants = require("../../config/constant");
const response = require("../../config/response");
const SubCategory = require("../../models/SubCategory");
const { path, dirname } = require("path");
const { Validator } = require('node-input-validator');
const helper = require('../../helper/hlp_common');
const slugify = require("slugify");
module.exports.getAllSubCategory= async (req, res, next) => {
 

  const getList = await SubCategory.aggregate([
    {
       $match: {status: constants.CONST_DB_STATUS_ACTIVE},
    },
    {
      $lookup: { from: 'categories', localField: "CategoryId", foreignField: "_id", as: "category_details" }
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


module.exports.addSubCategory = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await SubCategory.findOne({
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
   
    req.body.slug = slugify(req.body.name);
    const category = new SubCategory(req.body);
    await category.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteSubCategory = async (req, res, next) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateSubCategory = async (req, res, next) => {
  try {
    if(req.body.name ==''){
      delete req.body.name
    }else{
      req.body.slug = slugify(req.body.name);
    }
    if(req.body.status ==''){
      delete req.body.status
    }
    await SubCategory.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
