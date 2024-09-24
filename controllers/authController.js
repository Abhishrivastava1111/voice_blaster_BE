const constants = require("../config/constant");
const response = require("../config/response");
// const jobCategory = require("../models/jobCategory");
const path = require("path");
const User = require("../models/User");
const { Validator } = require("node-input-validator");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");
const bcrypt = require("bcrypt");
const pug = require("pug");
const jwt = require("jsonwebtoken");
const helper = require("./../helper/hlp_common");
const sendMail = require("../common/sendMail");

// const Degree = require("../models/Degree");
// const School = require("../models/School");
// const Location = require("../models/Location");
// const Category = require("./../models/jobCategory");
// const jobType = require("../models/jobType");
// const skills = require("../models/Skill");
// const Language = require("../models/Language");
// const Students = require("../models/Students");
// const Employers = require("../models/Employers");
// const Company = require("./../models/Company");
// const { stripeModule } = require("../helper/stripe");
// const Subscribe = require("../models/Subscribe");

module.exports.register = async (req, res, next) => {
  const postData = req.body;

  let v;

  v = new Validator(req.body, {
    name: "required",
    // lastname: "required",
    email: "required|email",
    mobile_no: "required",
    password: "required|string",
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

  const post_password = postData.password;

  // Check User exist
  try {
    const userDetails = await User.findOne({ email: postData.email });

    if (userDetails) {
      return response.returnFalse(
        req,
        res,
        res.translate("email_already_exist"),
        {}
      );
    }

    const salt = await bcrypt.genSalt(10);
    postData.password = await bcrypt.hash(post_password, salt);

    postData.accountVerified = constants.CONST_USER_VERIFIED_TRUE;

    postData.accountVerified = constants.CONST_USER_VERIFIED_TRUE;
    postData.role = 3;

    const user = new User(postData);
    const userSave = await user.save();

    const userInsertId = userSave._id;

    const userInfo = await User.findOne(
      { _id: userInsertId },
      "password role name profile_image _id email emailVerified"
    );
    console.log("user Details ===>>", userInfo);

    const token = jwt.sign({ id: userInfo._id }, process.env.JWT_TOKEN_KEY, {
      expiresIn: constants.CONST_VALIDATE_SESSION_EXPIRE,
    });

    const profile = "";
    let tempObj = {
      _id: userInfo._id,
      email: userInfo.email,
      role: userInfo.role,
      // profile_image:
      //   userDetails.profile_image.length > 0 ? userDetails.profile_image : "",
      name: userInfo.name,
      // lastname: userDetails.lastname,
      token: token,
    };

    // let verify_code = cryptr.encrypt(postData.email);
    // let link = `${constants.CONST_APP_URL}verifyEmail/${verify_code}`;
    // let templateDir = "templates/";
    // let messageBody = pug.renderFile(`${templateDir}verification.pug`, {
    //   name: postData.name,
    //   surname: postData.surname,
    //   email: postData.email,
    //   link: link,
    // });
    // sendMail(
    //   postData.email.toLowerCase(),
    //   res.translate("account_verification_email"),
    //   messageBody
    // );

    return response.returnTrue(
      req,
      res,
      res.translate("registration_successfully"),
      tempObj
    );
  } catch (err) {
    return response.returnFalse(req, res, err.message, {});
  }
};

module.exports.login = async (req, res, next) => {
  const body = req.body;
  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
    // role: "required",
  });

  let matched = await v.check();
  if (!matched) {
    console.log(v);
    return response.returnFalse(
      req,
      res,
      helper.validationErrorConvertor(v),
      {}
    );
  }

  try {
    const userDetails = await User.findOne(
      { email: body.email },
      "password role name profile_image _id email emailVerified status"
    );
    console.log("user Details ===>>", userDetails);

    if (userDetails && userDetails.status === "Inactive") {
      return response.returnFalse(
        req,
        res,
        "your account is currently inactive. you cannot log in",
        {}
      );
    }
    if (body.role == 2) {
      if (userDetails && userDetails.emailVerified == "false") {
        return response.returnFalse(
          req,
          res,
          res.translate("email_not_verified"),
          {}
        );
      }
    }
let password_verifiy=await bcrypt.compare(body.password, userDetails.password)
    if (userDetails && password_verifiy) {
      const token = jwt.sign(
        { id: userDetails._id },
        process.env.JWT_TOKEN_KEY,
        {
          expiresIn: constants.CONST_VALIDATE_SESSION_EXPIRE,
        }
      );

      const profile = "";
      let tempObj = {
        _id: userDetails._id,
        email: userDetails.email,
        role: userDetails.role,
        // profile_image:
        //   userDetails.profile_image.length > 0 ? userDetails.profile_image : "",
        // firstname: userDetails.firstname,
        name: userDetails.name,
        token: token,
      };

      return response.returnTrue(
        req,
        res,
        res.translate("login_successfully"),
        tempObj
      );
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("invalid_credentials"),
        {}
      );
    }
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};

module.exports.changePassword = async (req, res, next) => {
  const body = req.body;
  // id: 'required',
  const v = new Validator(req.body, {
    old_pass: "required",
    new_pass: "required",
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
    const userInfo = await User.findById(req.user.id);
    const validPassword = await bcrypt.compare(
      body.old_pass,
      userInfo.password
    );

    if (!validPassword) {
      return response.returnFalse(
        req,
        res,
        res.translate("invalid_password"),
        {}
      );
    }

    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(body.new_pass, salt);

    const updateInfo = await User.updateOne(
      { _id: req.user.id },
      { $set: { password: password } }
    );

    // if (updateInfo.modifiedCount == 1) {
    return response.returnTrue(
      req,
      res,
      res.translate("password_changed_successfully"),
      {}
    );
    // } else {
    //   return response.returnFalse(
    //     req,
    //     res,
    //     res.translate("oops_please_try_again"),
    //     {}
    //   );
    // }
  } catch (e) {
    return response.returnFalse(
      req,
      res,
      res.translate("oops_please_try_again"),
      {}
    );
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  const body = req.body;

  const v = new Validator(req.body, {
    email: "required|email",
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
    const userInfo = await User.findOne({ email: body.email });

    const salt = await bcrypt.genSalt(10);
    const newPassword = helper.generateRandomPassword();
    const password = await bcrypt.hash(newPassword, salt);
    let otp = Math.floor(1000 + Math.random() * 9000);

    const updateInfo = await User.updateOne(
      { email: body.email },
      { $set: { otp: otp } }
    );

    if (updateInfo.modifiedCount == 1) {
      let verify_code = cryptr.encrypt(userInfo.email);
      let link = `${constants.CONST_APP_URL}verifyEmail/${verify_code}`;
      let templateDir = "templates/";
      let messageBody = pug.renderFile(`${templateDir}forgot_password.pug`, {
        name: userInfo.name,
        surname: userInfo.surname,
        email: userInfo.email,
        link: link,
        otp: otp,
      });
      sendMail(
        userInfo.email.toLowerCase(),
        res.translate("forgot_password_reset"),
        messageBody
      );

      return response.returnTrue(
        req,
        res,
        res.translate("forgot_password_otp_successfully"),
        {}
      );
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("oops_please_try_again"),
        {}
      );
    }
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};
module.exports.viewProfile = async (req, res, next) => {
  try {
    const userInfo = await User.findById(req.user.id);
    if (userInfo) {
      return response.returnTrue(
        req,
        res,
        res.translate("record_found"),
        userInfo
      );
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        {}
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
module.exports.resetPassword = async (req, res, next) => {
  const body = req.body;

  const v = new Validator(req.body, {
    email: "required|email",
    otp: "required",
    password: "required",
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
    let { email, otp, password } = req.body;
    const userInfo = await User.findOne({ email: body.email });

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    if (userInfo.otp == otp || otp == constants.DEFAULT_OTP) {
      const updateInfo = await User.updateOne(
        { email: body.email },
        { $set: { otp: "", password: password } }
      );

      if (updateInfo.modifiedCount == 1) {
        return response.returnTrue(
          req,
          res,
          res.translate("forgot_password_reset_successfully"),
          {}
        );
      } else {
        return response.returnFalse(
          req,
          res,
          res.translate("oops_please_try_again"),
          {}
        );
      }
    } else {
      return response.returnFalse(req, res, res.translate("invalid_otp"), {});
    }
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};

module.exports.verifyEmail = async (req, res, next) => {
  // let verify_code = cryptr.encrypt(postData.email);
  const email = cryptr.decrypt(req.params.code);

  try {
    const resp = await User.updateOne(
      { email: email, emailVerified: false },
      { $set: { emailVerified: true } }
    );
    if (resp.modifiedCount) {
      return res.send(res.translate("email_verification_success"));
    } else {
      return res.send(res.translate("email_verification_already"));
    }
  } catch (err) {
    return res.send(err.message);
  }
};

module.exports.updateInfo = async (req, res, next) => {
  const body = req.body;
  const v = new Validator(req.body, {
    // id: "required",
    name: "required",
    // email: "required",
    mobile_no: "required",
    address: "required",
    // address2: "required",
    // state: "required",
    // city: "required",
    // zip_code: "required",
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
    const icon = req.file?.filename;
    if (icon != undefined) {
      req.body.profile_image = process.env.IMAGE_PATH + icon;
    } else {
      delete req.body.profile_image;
    }
    const updateInfo = await User.updateOne({ _id: req.user.id }, req.body);

    return response.returnTrue(
      req,
      res,
      res.translate("profile_update_success"),
      {}
    );
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};

module.exports.profile = async (req, res, next) => {
  const body = req.body;
  const v = new Validator(req.body, {
    user_id: "required",
    role: "required|numeric|digitsBetween:1,2",
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
    const userDetails = await User.findOne(
      { _id: body.user_id, role: body.role },
      "role name surname profile_image banner_image _id email about_us oneTimePurchase oneTimePurchasePlanId  subscription_plan_id interviewLeft company_id"
    );

    if (userDetails && userDetails.emailVerified === false) {
      return response.returnFalse(
        req,
        res,
        res.translate("email_not_verified"),
        {}
      );
    }
    console.log("user details ==>", userDetails);

    if (!userDetails)
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        {}
      );
    let subscription_plan_id;
    if (userDetails && userDetails.role == constants.CONST_USER_ROLE_STUDENT) {
      subscription_plan_id =
        userDetails.subscription_plan_id == null ||
        userDetails.subscription_plan_id == undefined
          ? ""
          : userDetails.subscription_plan_id;
    }
    //code for sending subscription_plan_id in response

    let tempObj = {
      _id: userDetails._id,
      email: userDetails.email,
      role: userDetails.role,
      //profile_image: (userDetails.profile_image.length > 0) ? constants.CONST_APP_URL + constants.CONST_IMAGE_USER + userDetails.profile_image : '',
      profile_image:
        userDetails.profile_image.length > 0 ? userDetails.profile_image : "",
      banner_image: userDetails.banner_image ? userDetails.banner_image : "",
      name: userDetails.name,
      surname: userDetails.surname,
      about_us: userDetails.about_us,
      oneTimePurchase: userDetails.oneTimePurchase,
      // subscription_plan_id:userDetails.oneTimePurchasePlanId,
      subscription_plan_id: subscription_plan_id,
      token: req.headers["x-access-token"],
    };

    if (userDetails.role == constants.CONST_USER_ROLE_STUDENT) {
      const studentDetails = await Students.findOne({ user: userDetails._id });
      if (studentDetails) {
        tempObj.live_from = studentDetails.live_from;
        tempObj.school = studentDetails.school;
        tempObj.degree = studentDetails.degree;
        tempObj.major = studentDetails.major;
        tempObj.graduation_year = studentDetails.graduation_year;
        tempObj.language = studentDetails.languages;
        tempObj.skills = studentDetails.skills;
        tempObj.certifications = studentDetails.certifications;
        tempObj.job_type = studentDetails.job_type;
        tempObj.job_category = studentDetails.job_category;
        tempObj.location = studentDetails.location;
        tempObj.education = studentDetails.education;
        tempObj.experiences = studentDetails.experiences;
        tempObj.year_of_experience = studentDetails.year_of_experience;
        tempObj.job_resume = studentDetails.job_resume;
      }
    } else {
      let employeeDetails = await Employers.findOne(
        { user: userDetails._id },
        "job_title gender birth_date city country"
      );
      if (employeeDetails) {
        tempObj.employee = {
          job_title: employeeDetails.job_title,
          gender: employeeDetails.gender,
          dob: employeeDetails.birth_date,
          city: employeeDetails.city,
          country: employeeDetails.country,
        };
      }
      const companyDetails = await Company.findOne(
        { user: userDetails._id },
        "company url location founded staff industry about_us company_logo company_video purchased_plan_id"
      );

      //code for set subscriptionplanid
      subscription_plan_id =
        companyDetails.purchased_plan_id == null ||
        companyDetails.purchased_plan_id == undefined
          ? ""
          : companyDetails.purchased_plan_id;

      if (companyDetails) {
        tempObj.company = {
          company: companyDetails.company,
          url: companyDetails.url,
          location: companyDetails.location,
          founded: companyDetails.founded,
          staff: companyDetails.staff,
          linkedIn_url: companyDetails.linkedIn_url,
          industry: companyDetails.industry,
          about_us: companyDetails.about_us,
          company_logo:
            companyDetails.company_logo.length > 0
              ? companyDetails.company_logo
              : "",
          company_video:
            companyDetails.company_video.length > 0
              ? companyDetails.company_video
              : "",
          company_picture: companyDetails.company_profile
            ? companyDetails.company_profile
            : "",
        };
      }
    }

    //code to check expiration and set subscription plan id

    const planDetails = await helper.getPlanInfo(userDetails);
    const plan = planDetails[0];
    const cmpdata = planDetails[1];
    const isUnlimitedInterview = plan && plan.unlimittedInterview;

    //for expiration time

    const isSubscriptionExpired =
      plan && plan.periodEnd < Math.floor(Date.now() / 1000);

    subscription_plan_id =
      isUnlimitedInterview && isSubscriptionExpired ? "" : subscription_plan_id;

    //for interview count
    if (userDetails.role == constants.CONST_USER_ROLE_EMPLOYER && cmpdata) {
      subscription_plan_id =
        cmpdata.interview_Schedulel_Left <= 0 && !isUnlimitedInterview
          ? ""
          : subscription_plan_id;
    } else if (userDetails.role == constants.CONST_USER_ROLE_STUDENT) {
      subscription_plan_id =
        userDetails.interviewLeft <= 0 && !isUnlimitedInterview
          ? ""
          : subscription_plan_id;
    }

    tempObj.subscription_plan_id = subscription_plan_id;
    return response.returnTrue(
      req,
      res,
      res.translate("profile_update_success"),
      tempObj
    );
  } catch (e) {
    console.log(e);
    return response.returnFalse(req, res, e.message, {});
  }
};

module.exports.profileEmployer = async (req, res, next) => {
  const body = req.body;
  const v = new Validator(req.body, {
    user_id: "required",
    role: "required|numeric|digitsBetween:1,2",
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
    const userDetails = await User.findOne(
      { _id: body.user_id, role: body.role },
      "role name surname profile_image _id email about_us company_id oneTimePurchase subscription_plan_id"
    );

    if (userDetails && userDetails.emailVerified === false) {
      return response.returnFalse(
        req,
        res,
        res.translate("email_not_verified"),
        {}
      );
    }
    let tempObj = {
      _id: userDetails._id,
      email: userDetails.email,
      role: userDetails.role,
      //profile_image: (userDetails.profile_image.length > 0) ? constants.CONST_APP_URL + constants.CONST_IMAGE_USER + userDetails.profile_image : '',
      profile_image:
        userDetails.profile_image.length > 0 ? userDetails.profile_image : "",
      name: userDetails.name,
      surname: userDetails.surname,
      about_us: userDetails.about_us,
      oneTimePurchase: userDetails.oneTimePurchase,
      subscription_plan_id: userDetails.subscription_plan_id
        ? userDetails.subscription_plan_id
        : "",
      token: req.headers["x-access-token"],
    };

    if (userDetails.role == constants.CONST_USER_ROLE_STUDENT) {
      const studentDetails = await Students.findOne({ user: userDetails._id });
      if (studentDetails) {
        tempObj.live_from = studentDetails.live_from;
        tempObj.school = studentDetails.school;
        tempObj.degree = studentDetails.degree;
        tempObj.major = studentDetails.major;
        tempObj.graduation_year = studentDetails.graduation_year;
        tempObj.language = studentDetails.languages;
        tempObj.skills = studentDetails.skills;
        tempObj.job_type = studentDetails.job_type;
        tempObj.job_category = studentDetails.job_category;
        tempObj.location = studentDetails.location;
        tempObj.education = studentDetails.education;
        tempObj.experiences = studentDetails.experiences;
        tempObj.year_of_experience = studentDetails.year_of_experience;
      }
    } else {
      let employeeDetails = await Employers.findOne(
        { user: userDetails._id },
        "job_title gender birth_date city country"
      );
      if (employeeDetails) {
        tempObj.employee = {
          job_title: employeeDetails.job_title,
          gender: employeeDetails.gender,
          dob: employeeDetails.birth_date,
          city: employeeDetails.city,
          country: employeeDetails.country,
        };
      }
      const companyDetails = await Company.findOne(
        { _id: userDetails.company_id },
        "company url location founded staff industry about_us company_logo company_video company_pictures company_profile"
      );
      if (companyDetails) {
        tempObj.company = {
          company: companyDetails.company,
          url: companyDetails.url,
          location: companyDetails.location,
          founded: companyDetails.founded,
          staff: companyDetails.staff,
          industry: companyDetails.industry,
          about_us: companyDetails.about_us,
          company_logo:
            companyDetails.company_logo.length > 0
              ? companyDetails.company_logo
              : "",
          company_video:
            companyDetails.company_video.length > 0
              ? companyDetails.company_video
              : "",
          company_picture: companyDetails.company_pictures
            ? companyDetails.company_pictures
            : [],
          company_profile: companyDetails.company_profile
            ? companyDetails.company_profile
            : "",
          linkedIn_url: companyDetails.linkedIn_url,
        };
      }
    }
    return response.returnTrue(
      req,
      res,
      res.translate("profile_update_success"),
      tempObj
    );
  } catch (e) {
    console.log(e);
    return response.returnFalse(req, res, e.message, {});
  }
};

module.exports.updateEmployeeInfo = async (req, res, next) => {
  const postData = req.body;
  let v;
  v = new Validator(req.body, {
    user_id: "required|string",
    name: "required|alpha",
    surname: "required|alpha",
    email: "required|email",
    job_title: "required|string",
    bio: "required|string",
    gender: "required|string",
    dob: "required|date|dateBeforeToday:60,months",
    country: "required|string",
    city: "required|string",

    company: "required|string",
    url: "required",
    location: "required|string",
    founded: "required|integer|digits:4",
    //staff: "required|string",
    industry: "required|string",
    about_us: "required|string",
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

  const isValidCountry = isValidObjectId(postData.country);

  if (!isValidCountry) {
    return response.returnFalse(req, res, res.translate("invalid_country"), {});
  }

  const isValidCity = isValidObjectId(postData.city);

  if (!isValidCity) {
    return response.returnFalse(req, res, res.translate("invalid_city"), {});
  }

  const isValidLocation = isValidObjectId(postData.location);

  if (!isValidLocation) {
    return response.returnFalse(
      req,
      res,
      res.translate("invalid_location"),
      {}
    );
  }

  const isValidIndustry = isValidObjectId(postData.industry);

  if (!isValidIndustry) {
    return response.returnFalse(
      req,
      res,
      res.translate("invalid_industry"),
      {}
    );
  }

  const isValidUser = isValidObjectId(postData.user_id);

  if (!isValidUser) {
    return response.returnFalse(req, res, res.translate("no_record_found"), {});
  }

  const post_profile_image =
    "profile" in req.files ? req.files.profile[0].location : "";
  const company_logo =
    "company_logo" in req.files ? req.files.company_logo[0].location : "";
  // const company_picture =
  // "company_picture" in req.files ? req.files.company_picture[0].location : "";
  const company_video =
    "company_video" in req.files ? req.files.company_video[0].location : "";
  let company_picture_data = [];
  if (req.files.company_picture) {
    if (
      req.files.company_picture.length != undefined &&
      req.files.company_picture.length > 0
    ) {
      for (var i = 0; i < req.files.company_picture.length; i++) {
        let c_image = req.files.company_picture[i].location;
        company_picture_data.push(c_image);
      }
    }
  }
  try {
    const userDetails = await User.findOne(
      { _id: postData.user_id, role: constants.CONST_USER_ROLE_EMPLOYER },
      "password role name surname profile_image _id email about_us company_id stripeCusId"
    );
    let company_picture = [];
    if (company_picture_data.length > 0) {
      company_picture = company_picture_data;
      const EmpCompany = await Company.findOne({ _id: userDetails.company_id });
      company_picture = company_picture.concat(EmpCompany.company_pictures);
    }
    if (!userDetails) {
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        {}
      );
    }

    // const userInfo = await User.findById(body.id);
    //UPDATE CUSTOMER ON STRIP
    let obj = {};
    const name =
      req.body.name && req.body.surname
        ? `${req.body.name} ${req.body.surname}`
        : req.body.name
        ? `${req.body.name} ${userDetails.surname}`
        : req.body.surname
        ? `${userDetails.name} ${req.body.surname}`
        : "";

    if (name) {
      obj.name = name;
      await stripeModule.updateCustomer(userDetails.stripeCusId, obj);
    }

    const checkCompany = await Company.findOne({ company: postData.company });

    if (checkCompany) {
      if (checkCompany.user != postData.user_id) {
        return response.returnFalse(
          req,
          res,
          res.translate("company_already_exists"),
          {}
        );
      }
    }

    const checkUrl = await Company.findOne({ url: postData.url });

    if (checkUrl) {
      if (checkCompany.user != postData.user_id) {
        return response.returnFalse(
          req,
          res,
          res.translate("company_url_exists"),
          {}
        );
      }
    }

    let tempUserInfo = {
      name: postData.name,
      surname: postData.surname,
      about_us: postData.bio,
    };

    if (post_profile_image.length > 0) {
      tempUserInfo.profile_image = post_profile_image;
    }

    let tempCompanyInfo = {
      company: postData.company,
      url: postData.url,
      location: postData.location,
      founded: postData.founded,
      staff: postData.staff,
      industry: postData.industry,
      about_us: postData.about_us,
    };

    if (company_logo.length > 0) {
      tempCompanyInfo.company_profile = company_logo;
    }

    // if (company_picture.length > 0) {
    //   tempCompanyInfo.company_logo = company_picture;
    // }

    if (company_picture.length > 0) {
      tempCompanyInfo.company_pictures = company_picture;
      tempCompanyInfo.company_profile = company_picture[0];
    }

    if (company_video.length > 0) {
      tempCompanyInfo.company_video = company_video;
    }

    let tempEmployeeInfo = {
      job_title: postData.job_title,
      about_us: postData.bio,
      gender: postData.gender.toLowerCase(),
      birth_date: postData.dob,
      country: postData.country,
      city: postData.city,
    };

    // const updateInfo = await User.updateOne(
    //   { _id: userDetails._id },
    //   { $set: tempUserInfo }
    // );

    // const updateCompany = await Company.updateOne(
    //   { user: userDetails._id },
    //   { $set: tempUserInfo }
    // );

    // const updateEmployee = await Employers.updateOne(
    //   { user: userDetails._id },
    //   { $set: tempUserInfo }
    // );
    const updateInfo = await User.updateOne(
      { _id: userDetails._id },
      { $set: tempUserInfo }
    );

    const updateCompany = await Company.updateOne(
      { user: userDetails._id },
      { $set: tempCompanyInfo }
    );

    const updateEmployee = await Employers.updateOne(
      { user: userDetails._id },
      { $set: tempEmployeeInfo }
    );
    return response.returnTrue(
      req,
      res,
      res.translate("profile_update_successfully"),
      {}
    );
  } catch (err) {
    return response.returnFalse(req, res, err.message, { id: 1 });
  }
};

module.exports.emailCheck = async (req, res, next) => {
  const body = req.body;
  const v = new Validator(req.body, {
    email: "required|email",
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
    const userDetails = await User.findOne(
      { email: body.email },
      "password role name surname profile_image _id email about_us"
    );

    if (!userDetails) {
      return response.returnTrue(req, res, res.translate("email_unique"), {});
    }
    return response.returnFalse(
      req,
      res,
      res.translate("email_already_exist"),
      {}
    );
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};
