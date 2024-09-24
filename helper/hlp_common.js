const constants = require('../config/constant');
var moment = require('moment');
var momentTimeZone = require('moment-timezone');
momentTimeZone.tz.setDefault("UTC");
const response = require('../config/response');
const jwt = require('jsonwebtoken');
const config = process.env;
// Model section define
// const Location = require('./../models/Location');
// const SubscriptionPlan = require("../models/SubscriptionPlan");
const Company = require("./../models/Company");
const { default: mongoose } = require("mongoose");
// const Subscribe = require("./../models/Subscribe");
const User = require("./../models/User");
module.exports = {
    getCurrentYear: () => {
        return moment().format('YYYY');
    },
    getGraduationYear: (startYear, currentYear) => {
        var years = [];
        var startYear = startYear || 1980;  
        while ( startYear <= currentYear ) {
            years.push(startYear++);
        }   
        return years;
    },
    validationErrorConvertor: (validation) => {
        var error;
        for (var i = 0; i <= Object.values(validation.errors).length; i++) {
            error = Object.values(validation.errors)[0].message;
            break;
        }
        return error;
    },
    generateRandomPassword: () => {
        const randomString = Math.random().toString(36).slice(-6);
        return randomString;
    },
    onlyUnique: (value) => {
        value.forEach((content) => {
            trimContent.push(content.trim());
        });
        return [...new Set(value)];
    },
    parseJwt: (token) => {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    },
    loginUserId: (token) => {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        return decoded.id;
    },
    expExists(title) {
      return arr.some(function(el) {
        return el.title === title;
      }); 
    },  getPlanInfo: async(userData)=> {

        let companyDetails
            let matchObj = { status: constants.CONST_DB_STATUS_ACTIVE };
            if (userData.role == constants.CONST_USER_ROLE_STUDENT) {
              matchObj.userId = mongoose.Types.ObjectId(userData._id);
              matchObj.planId = mongoose.Types.ObjectId(userData.subscription_plan_id);
              // matchObj.planId =userData.subscription_plan_id
            } else if (userData.role == constants.CONST_USER_ROLE_EMPLOYER) {
               companyDetails = await Company.findById(userData.company_id);
              matchObj.company_id = mongoose.Types.ObjectId(userData.company_id);
              matchObj.planId = mongoose.Types.ObjectId(
                companyDetails.purchased_plan_id
              );
              // matchObj.planId = companyDetails.purchased_plan_id
            }
        let getList=[]
             getList = await Subscribe.aggregate([
              {
                // $match: {
                //   userId: mongoose.Types.ObjectId(tokenId), // replace user_id with the actual user ID you want to filter by
                //   planId: userData.subscription_plan_id,
                // },
                $match: matchObj,
              },
              {
                $lookup: {
                  from: "subscription_plans",
                  localField: "planId",
                  foreignField: "_id",
                  as: "subscriptionDetails",
                },
              },
              {
                $unwind: "$subscriptionDetails",
              },
              {
                $addFields: {
                  noOfInterview: "$subscriptionDetails.noOfInterview",
                  unlimittedInterview: "$subscriptionDetails.unlimittedInterview",
                  planName: "$subscriptionDetails.planName",
                  afterPlanName: "$subscriptionDetails.afterPlanName",
                  description: "$subscriptionDetails.description",
                  monthlyPrice: "$subscriptionDetails.monthlyPrice",
                  setupAmount: "$subscriptionDetails.setupAmount",
                  oneTimePrice: "$subscriptionDetails.oneTimePrice",
                },
              },
        
              {
                $project: {
                  subscriptionDetails: 0,
                },
              },
            ]);
        
         getList.push(companyDetails)
        
            return getList
          },
        
          studentInterviewCountManage: async(userData ,planData,type)=> {
        
            if (type == "increament" || type == "decreament") {
              if (planData.length > 0 && !planData[0].unlimittedInterview) {
                const count = parseInt(userData.interviewLeft) + (type == "increament" ? 1 : -1);
                await User.findByIdAndUpdate(userData._id, { interviewLeft: count });
              }
            }
          },
          employeInterviewCountManage: async(planData,type)=> {
        
            if (type == "increament" || type == "decreament") {
              if  ( planData.length > 0 &&
              planData[0].unlimittedInterview == false &&
              planData[1]) {
                const count= parseInt(planData[1].interview_Schedulel_Left) + (type == "increament" ? 1 : -1);
                await Company.findByIdAndUpdate(planData[1]._id, {
                  interview_Schedulel_Left: count,
                });
              }
            }
          },
};