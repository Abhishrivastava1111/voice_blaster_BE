const constants = require("../../config/constant");
const response = require("../../config/response");
const Testimonial = require("../../models/Testimonial");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");

module.exports.getAllTestimonial = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE
  const getList = await Testimonial.find(
    {},
    "name description image status _id"
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

module.exports.addTestimonial = async (req, res, next) => {
  try {
    //check unique name
    // const checkUniqueName = await Testimonial.findOne({
    //   name: req.body.name.trim(),
    // });
    // if (checkUniqueName !== null) {
    //   return response.returnFalse(req, res, res.translate("name_unique"), []);
    // }
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
    req.body.image = process.env.IMAGE_PATH + req.file.filename;
    // req.body.slug = slugify(req.body.name);

    // req.body.icon=req.file.filename;
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteTestimonial = async (req, res, next) => {
  try {
    // const checkDdata = await Category.findOne({
    // _id: req.params.id.trim(),
    // });
    // console.log(checkDdata.icon);
    // let filePath = process.env.IMAGE_PATH + checkDdata.icon;
    // fs.unlinkSync(filePath);
    await Testimonial.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateTestimonial = async (req, res, next) => {
  try {
    let obj = {
      name: req.body.name,
      status: req.body.status,
      description: req.body.description,
      image: req.body.image,
    };
    if (req.body.name == "") {
      delete obj.name;
    }
    // else{
    //   req.body.slug = slugify(req.body.name);
    // }
    if (req.body.status == "") {
      delete obj.status;
    }
    if (req.body.description == "") {
      delete obj.description;
    }

    const icon = req.file?.filename;
    if (icon) {
      obj.image = process.env.IMAGE_PATH + icon;
      // delete obj.icon;
    } else {
      delete obj.icon;
    }
    await Testimonial.findByIdAndUpdate(req.params.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
