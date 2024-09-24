const constants = require('../config/constant');
const response = require('../config/response');
const Faq = require('../models/Faq');
const { Validator } = require('node-input-validator');
const helper = require('./../helper/hlp_common');

module.exports.getFaqs = async (req, res, next) => {
    try{

        let getList = await Faq.find({});   
        
        if (getList) {
            return response.returnTrue(req, res, res.translate('record_found'), getList);
        } else {
            return response.returnFalse(req, res, res.translate('no_record_found'), []);
        } 
    }
    catch(err){
        return response.returnFalse(req, res, err.message, []);
    }
};

module.exports.addFaq = async (req, res, next) => {
    try{

       let  v = new Validator(req.body, {
            title            : 'required|string',
            description      : 'required|string',
        });

        let matched = await v.check();

        if (!matched) {
            return response.returnFalse(req, res, helper.validationErrorConvertor(v), {});
        }
        let { title, description } = req.body ;
        let save = await Faq.create({
                title: title,
                description: description
            });  
        if (save) {
            return response.returnTrue(req, res, res.translate('faq_added_success'), {});
        } else {
            return response.returnFalse(req, res, res.translate('faq_added_error'), {});
        } 
    }
    catch(err){
        return response.returnFalse(req, res, err.message, []);
    }
};

module.exports.editFaq = async (req, res, next) => {
    try{

       let  v = new Validator(req.body, {
            id            : 'required|string',
            title            : 'required|string',
            description      : 'required|string',
        });

        let matched = await v.check();

        if (!matched) {
            return response.returnFalse(req, res, helper.validationErrorConvertor(v), {});
        }
        let { id, title, description } = req.body ;
        const updateInfo = await Faq.updateOne(
            {_id: id},
            {$set: {title: title, description: description }}
        );

        if (updateInfo.modifiedCount == 1) {
            return response.returnTrue(req, res, res.translate('faq_update_success'), {});
        } else {
            return response.returnFalse(req, res, res.translate('faq_update_error'), {});
        } 
    }
    catch(err){
        return response.returnFalse(req, res, err.message, []);
    }
};

