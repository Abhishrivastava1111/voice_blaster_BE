const constants = require("../../config/constant");
const response = require("../../config/response");
const Notes = require("../../models/notes");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");

module.exports.getNotes = async (req, res, next) => {
  try {
    let getList = await Notes.find({});

    if (getList) {
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
        []
      );
    }
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};

module.exports.getAllNotes = async (req, res, next) => {
  try {
    let getList = await Notes.find({status:'Active'});

    if (getList.length>0) {
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
        []
      );
    }
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};

module.exports.addNotes = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      title: "required|string",
      //   status: "required|string",
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
    // let { title, status } = req.body;
    let save = await Notes.create(req.body);
    if (save) {
      return response.returnTrue(req, res, res.translate("added_success"), {});
    } else {
      return response.returnFalse(req, res, res.translate("added_error"), {});
    }
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};

module.exports.editNotes = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      id: "required|string",
      title: "required|string",
      //   description: "required|string",
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
    let { id } = req.body;
    const updateInfo = await Notes.updateOne({ _id: id }, { $set: req.body });

    if (updateInfo.modifiedCount == 1) {
      return response.returnTrue(req, res, res.translate("update_success"), {});
    } else {
      return response.returnFalse(req, res, res.translate("update_error"), {});
    }
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};

module.exports.deleteNotes = async (req, res, next) => {
  try {
    const updateInfo = await Notes.findByIdAndDelete({ _id: req.params.id });

    return response.returnTrue(req, res, res.translate("delete_success"), {});
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};
