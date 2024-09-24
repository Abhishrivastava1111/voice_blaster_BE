const constants = require("../config/constant");
const response = require("../config/response");
const Country = require("../models/Country");
const Cities = require("../models/City");
const { Validator } = require("node-input-validator");
const helper = require("./../helper/hlp_common");
const { path, dirname } = require("path");
const csvtojson = require("csvtojson");
module.exports.getAllCity = async (req, res, next) => {
  const body = req.body;

  const v = new Validator(req.body, {
    country: "required",
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

  try {
    const getList = await Cities.find(
      { status: constants.CONST_DB_STATUS_ACTIVE, country_id: body.country },
      "name status _id"
    ).sort({ name: 1 });
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
        []
      );
    }
  } catch (e) {
    return response.returnFalse(
      req,
      res,
      res.translate("oops_please_try_again"),
      {}
    );
  }
};

module.exports.storeCity = async (req, res, next) => {
  const appDir = dirname(require.main.filename);
  let filePath = appDir + "/public/uploads/City.csv";
  /*csvtojson().fromFile(filePath).then(async source => {
  
        // Fetching the data from each row 
        // and inserting to the table "sample"
        for (var i = 1; i < source.length; i++) {
            var name = source[i].city
            var country = source[i].country;
            let newName = name.toLowerCase().split(' ').map(value => {
                return value.charAt(0).toUpperCase() + value.substring(1);
              }).join(' ');
            const getCountry = await Country.findOne({name: country}, "id name");
            //const getCountry = await Country.findOne({name: { $regex: '.*' + country + '.*' }}, "id name");
            //const getCountry = await Country.findOne({name:new RegExp(country, 'i'}, "id name");
            console.log(getCountry);
            console.log(name+" , "+getCountry.name+ " , "+getCountry._id+ " , "+getCountry.name);

      
            const city = new Cities({
                name:newName,
                country_id: getCountry._id
            });
            const saved = await city.save();
        }
        console.log(
    "All items stored into database successfully");
    });*/

  /*await Cities.create({
        country: '62cbbde242835a1a632cd1d4',
        name: 'Indore'
    },{
        country: '62cbbde242835a1a632cd1d4',
        name: 'Bhopal'
    });*/
  return response.returnFalse(
    req,
    res,
    res.translate("update_data_success"),
    []
  );
};

module.exports.addCitie = async (req, res, next) => {
  try {
    //check unique name
    const checkUniqueName = await Cities.findOne({
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
    const cities = new Cities(req.body);
    await cities.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteCitie = async (req, res, next) => {
  try {
   

    await Cities.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateCitie = async (req, res, next) => {
  try {
    if (req.body.name == "") {
      delete req.body.name;
    }
    if (req.body.status == "") {
      delete req.body.status;
    }
    if (req.body.country_id == "") {
      delete req.body.country_id;
    }
    //check unique name
    // const checkUniqueName = await Cities.findOne({
    //   name: req.body.name.trim(),
    // });
    // if (checkUniqueName !== null) {
    //   return response.returnFalse(req, res, res.translate("name_unique"), []);
    // }
    await Cities.findByIdAndUpdate(req.params.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
