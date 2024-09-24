const constants = require("../../config/constant");
const response = require("../../config/response");
// const jobCategory = require('../../models/jobCategory');
// const Jobs = require('../../models/Jobs');
const path = require("path");
const User = require("../../models/User");
const { Validator } = require("node-input-validator");
const { isValidObjectId } = require("mongoose");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");
const bcrypt = require("bcrypt");
const pug = require("pug");
const jwt = require("jsonwebtoken");
const helper = require("./../../helper/hlp_common");
const sendMail = require("../../common/sendMail");

module.exports.login = async (req, res, next) => {
  const postData = req.body;
  const v = new Validator(postData, {
    email: "required|email",
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
    const userInfo = await User.findOne({ email: postData.email });
    console.log(userInfo);
    if (!userInfo) {
      return response.returnFalse(
        req,
        res,
        res.translate("oops_please_try_again"),
        {}
      );
    }

    if (
      userInfo.role == constants.CONST_USER_ROLE_EMPLOYER ||
      userInfo.role == constants.CONST_USER_ROLE_STUDENT
    ) {
      return response.returnFalse(
        req,
        res,
        res.translate("oops_please_try_again"),
        {}
      );
    }

    const userDetails = await User.findOne(
      { email: postData.email },
      "password name email role status"
    );

    if (userDetails && userDetails.emailVerified === false) {
      return response.returnFalse(
        req,
        res,
        res.translate("email_not_verified"),
        {}
      );
    }

    if (userDetails && userDetails.status === "Inactive") {
      return response.returnFalse(
        req,
        res,
        "your account is currently inactive. you cannot log in",
        {}
      );
    }

    if (
      userDetails &&
      (await bcrypt.compare(postData.password, userDetails.password))
    ) {
      const token = jwt.sign(
        { id: userDetails._id },
        process.env.JWT_TOKEN_KEY,
        {
          expiresIn: constants.CONST_VALIDATE_SESSION_EXPIRE,
        }
      );

      const profile = userDetails.profile_image;
      let tempObj = {
        _id: userDetails._id,
        email: userDetails.email,
        name: userDetails.name,
        //   lastname: userDetails.lastname,
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

module.exports.updateProfile = async (req, res, next) => {
  try {
    let obj = {
      name: req.body.name,
      // lastname: req.body.lastname,
      mobile_no: req.body.mobile_no,
      address: req.body.address,
      profile_image: "",
    };

    const icon = req.file?.filename;
    if (icon) {
      obj.profile_image = process.env.IMAGE_PATH + icon;
      // delete obj.icon;
    } else {
      delete obj.profile_image;
    }
    console.log(icon);
    await User.findByIdAndUpdate(req.user.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.changePassword = async (req, res, next) => {
  const body = req.body;

  const v = new Validator(req.body, {
    // id: 'required',
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
console.log("userInfo ==>",validPassword);
    if (!validPassword) {
      return response.returnFalse(
        req,
        res,
        res.translate("invalid_password"),
        {}
      );
    }

    const salt = await bcrypt.genSalt(10);
    // let password = await bcrypt.hash(body.new_pass, salt);
    let password = await bcrypt.hash(body.new_pass, salt);
    const updateInfo = await User.updateOne(
      { _id: req.user.id },
      { $set: { password: password } }
    );
    console.log("updateInfo ==>",updateInfo);
    if (updateInfo.modifiedCount == 1) {
      return response.returnTrue(
        req,
        res,
        res.translate("password_changed_successfully"),
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

    if (!userInfo) {
      return response.returnFalse(
        req,
        res,
        res.translate("oops_please_try_again"),
        {}
      );
    }

    if (
      userInfo.role == constants.CONST_USER_ROLE_EMPLOYER ||
      userInfo.role == constants.CONST_USER_ROLE_STUDENT
    ) {
      return response.returnFalse(
        req,
        res,
        res.translate("oops_please_try_again"),
        {}
      );
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = helper.generateRandomPassword();
    var password = await bcrypt.hash(newPassword, salt);

    const updateInfo = await User.updateOne(
      { _id: userInfo._id },
      { $set: { password: password } }
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
        password: newPassword,
      });
      sendMail(
        userInfo.email.toLowerCase(),
        res.translate("forgot_password_reset"),
        messageBody
      );

      return response.returnTrue(
        req,
        res,
        res.translate("forgot_password_successfully"),
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
