const constants = require("../../config/constant");
const response = require("../../config/response");
const Support = require("../../models/support");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const { default: mongoose } = require("mongoose");

module.exports.getSupport = async (req, res, next) => {
  try {
    let getList = await Support.aggregate([
      // {
      //   $match: {orderID:mongoose.Types.ObjectId(req.params.id) },
      // },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user_details",
        },
      },
    ]);

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

module.exports.getAllSupport = async (req, res, next) => {
  try {
    let getList = await Support.find({
      // status: "Active",
      userId: mongoose.Types.ObjectId(req.user.id),
    });

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

module.exports.addSupport = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      subject: "required|string",
      message: "required|string",
      priority: "required|string",
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
    req.body.userId = req.user.id;
    let save = await Support.create(req.body);
    if (save) {
      return response.returnTrue(req, res, res.translate("added_success"), {});
    } else {
      return response.returnFalse(req, res, res.translate("added_error"), {});
    }
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};

module.exports.deleteSupport = async (req, res, next) => {
  try {
    const updateInfo = await Support.findByIdAndDelete({ _id: req.params.id });

    return response.returnTrue(req, res, res.translate("delete_success"), {});
  } catch (err) {
    return response.returnFalse(req, res, err.message, []);
  }
};
