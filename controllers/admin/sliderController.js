const constants = require("../../config/constant");
const response = require("../../config/response");
const Slider = require("../../models/Slider");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");

module.exports.getAllSlider = async (req, res, next) => {
  const getList = await Slider.find(
    {  },
    "name image slug status _id"
  );
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

module.exports.addSlider = async (req, res, next) => {
  try {
    const checkUniqueName = await Slider.findOne({
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
    req.body.image = process.env.IMAGE_PATH+req.file?.filename;
    // req.body.slug = slugify(req.body.name);
  
    const category = new Slider(req.body);
    await category.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteSlider = async (req, res, next) => {
  try {
     await Slider.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateSlider = async (req, res, next) => {
  try {
    let obj={
      name:req.body.name,
      status:req.body.status,
      image:req.body.icon,
      slug:req.body.slug
    }
    if (req.body.name == "") {
      delete req.body.name;
      delete obj.name;
    }
    if (req.body.status == "") {
      delete req.body.status;
      delete obj.status;
    }
    if (req.body.icon == "") {
      delete req.body.icon;
    }

    if (req.body.slug == "") {
      delete req.body.slug;
    }

    const icon = req.file?.filename;
    if (icon) {
      obj.image = process.env.IMAGE_PATH+icon;
     // delete obj.icon;
    }else{
      delete obj.image;
    }
    await Slider.findByIdAndUpdate(req.params.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
