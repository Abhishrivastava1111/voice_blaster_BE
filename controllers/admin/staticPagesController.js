const constants = require("../../config/constant");
const response = require("../../config/response");
const StaticPages = require("../../models/staticPage");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
module.exports.getPages = async (req, res, next) => {
  try {
    //  const lang = req.headers['lang'];
    let getList = await StaticPages.find({});

    if (getList.length > 0) {
      return response.returnTrue(
        req,
        res,
        res.translate("record_found"),
        getList
      );
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};

module.exports.addPage = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await StaticPages.findOne({
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
    //req.body.image = process.env.IMAGE_PATH +req.file.filename;
    req.body.slug = slugify(req.body.name);
    const staticPage = new StaticPages(req.body);
    await staticPage.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteStaticPage = async (req, res, next) => {
  try {
    await StaticPages.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateStaticPages = async (req, res, next) => {
  try {
    if (req.body.name == "") {
      delete req.body.name;
    } else {
      req.body.slug = slugify(req.body.name);
    }

    if (req.body.status == "") {
      delete req.body.status;
    }

    await StaticPages.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
