const constants = require("../config/constant");
const response = require("../config/response");
const Banner = require("../models/Banner");

module.exports.getAllBanner = async (req, res, next) => {
  

  const getList = await Banner.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "sideBanner1 sideBanner2 sideBannerUrl1 sideBannerUrl2 footerBanner footerBannerUrl").sort( {createdAt: -1 } );
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
