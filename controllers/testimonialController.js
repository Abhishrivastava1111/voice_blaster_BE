const constants = require("../config/constant");
const response = require("../config/response");
const Testimonial = require("../models/Testimonial");

module.exports.getAllTestimonial = async (req, res, next) => {
  const getList = await Testimonial.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "name description image status _id"
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
