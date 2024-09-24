const constants = require('../config/constant');
const response = require('../config/response');
const StaticPages = require('../models/staticPage');
const { Validator } = require('node-input-validator');
const helper = require('./../helper/hlp_common');

module.exports.getPages = async (req, res, next) => {
    try{

        let v = new Validator(req.body, {
            page_slug  : 'required|string',
        });

        let matched = await v.check();

        if (!matched) {
            return response.returnFalse(req, res, helper.validationErrorConvertor(v), {});
    }
        let { page_slug } = req.body ;
        let getList = await StaticPages.findOne({ slug: page_slug } );   
        
        if (getList) {
            return response.returnTrue(req, res, res.translate('record_found'), getList);
        } else {
            return response.returnFalse(req, res, res.translate('no_record_found'), {});
        } 
    }
    catch(err){
        return response.returnFalse(req, res, err.message, []);
    }
};


