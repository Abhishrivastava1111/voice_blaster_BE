const constants = require("../config/constant");
const response = require("../config/response");
const Country = require("../models/Country");
const { path, dirname } = require("path");
const csvtojson = require("csvtojson");
const { Validator } = require('node-input-validator');
const helper = require('./../helper/hlp_common');

module.exports.getAllCountry = async (req, res, next) => {
  const getList = await Country.find(
    { status: constants.CONST_DB_STATUS_ACTIVE },
    "name code status _id"
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
//62e3bce63a67cd58cf1adc26, 62e3bd1d3a67cd58cf1adc2a
module.exports.storeCountry = async (req, res, next) => {
  const appDir = dirname(require.main.filename);
  let filePath = appDir + "/public/uploads/Country.csv";
  /*csvtojson().fromFile(filePath).then(async source => {
  
        // Fetching the data from each row 
        // and inserting to the table "sample"
        for (var i = 2; i < source.length; i++) {
            var name = source[i].Name
            var code = source[i].Code
            var phone_code = source[i].Phonecode
            let newName = name.toLowerCase().split(' ').map(value => {
                return value.charAt(0).toUpperCase() + value.substring(1);
              }).join(' ');
            console.log(phone_code+" , "+newName+" , "+ code);
      
            const school = new Country({
                phone_code: phone_code,
                name: newName,
                code: code
            });
            const saved = await school.save();
        }
        console.log(
    "All items stored into database successfully");
    });*/

  /* await Country.create({
        phone_code: req.body.phone_code,
        name: req.body.name,
        code: req.body.code
    });*/
  return response.returnTrue(
    req,
    res,
    res.translate("update_data_success"),
    []
  );
};

module.exports.addCountry = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await Country.findOne({
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
    const country = new Country(req.body);
    await country.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteCountry = async (req, res, next) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateCountry = async (req, res, next) => {
  try {
    if(req.body.name ==''){
      delete req.body.name
    }
    if(req.body.status ==''){
      delete req.body.status
    }
    if(req.body.code ==''){
      delete req.body.code
    }
    if(req.body.phone_code ==''){
      delete req.body.phone_code
    }
    //check unique name
    // const checkUniqueName = await Country.findOne({
    //   name: req.body.name.trim(),
    // });
    // if (checkUniqueName !== null) {
    //   return response.returnFalse(req, res, res.translate("name_unique"), []);
    // }
    // let v = new Validator(req.body, {
    //   name: "required|string",
    // });
    // let matched = await v.check();
    // if (!matched) {
    //   return response.returnFalse(
    //     req,
    //     res,
    //     helper.validationErrorConvertor(v),
    //     {}
    //   );
    // }
    const icon = req.file === undefined ? "" : `${req.file.location}`;
    if (icon) {
      req.body.icon = icon;
    }
    await Country.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
