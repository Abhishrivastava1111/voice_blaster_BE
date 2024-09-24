const constants = require("../../config/constant");
const response = require("../../config/response");
const Category = require("../../models/Category");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");

module.exports.getAllCategory = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE 
  const getList = await Category.find(
    { },
    "name description icon status _id"
  );
  if (getList.length > 0) {
    // getList.forEach(async (content) => {
    //   let icon_url = content.icon ? process.env.IMAGE_PATH + content.icon : "";
    //   content.icon = icon_url;
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

module.exports.addCategory = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await Category.findOne({
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
    req.body.icon = process.env.IMAGE_PATH + req.file.filename;
    req.body.slug = slugify(req.body.name);

    // req.body.icon=req.file.filename;
    const category = new Category(req.body);
    await category.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteCategory = async (req, res, next) => {
  try {
    // const checkDdata = await Category.findOne({
    // _id: req.params.id.trim(),
    // });
    // console.log(checkDdata.icon);
    // let filePath = process.env.IMAGE_PATH + checkDdata.icon;
    // fs.unlinkSync(filePath);
    await Category.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateCategory = async (req, res, next) => {
  try {
    let obj = {
      name: req.body.name,
      status: req.body.status,
      description: req.body.description,
      icon: req.body.icon,
    };
    if (req.body.name == "") {
      delete req.body.name;
      delete obj.name;
    }
    // else{
    //   req.body.slug = slugify(req.body.name);
    // }
    if (req.body.status == "") {
      delete req.body.status;
      delete obj.status;
    }
    if (req.body.description == "") {
      delete obj.description;
    }

    const icon = req.file?.filename;
    if (icon) {
      obj.icon = process.env.IMAGE_PATH + icon;
      // delete obj.icon;
    } else {
      delete obj.icon;
    }
    await Category.findByIdAndUpdate(req.params.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
