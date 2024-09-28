const constants = require("../../config/constant");
const response = require("../../config/response");
const path = require("path");
const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const SendMessage = require("../../models/SendMessage");
const { Validator } = require("node-input-validator");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");
const bcrypt = require("bcrypt");
const pug = require("pug");
const jwt = require("jsonwebtoken");
const helper = require("./../../helper/hlp_common");
const sendMail = require("../../common/sendMail");
const { Console } = require("console");
const Utils = require("../../helper/utils");
module.exports.getAll = async (req, res, next) => {
  let v;
  v = new Validator(req.body, {
    page: "required|integer|between:1,1000",
    search: "alpha" , 
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
    const getList = await User.aggregate([
      {
        $match: {
          status: { $ne: constants.CONST_DB_STATUS_SOFT_DELETE },
          role: { $ne: "3" }, //constants.CONST_USER_ROLE_STUDENT.toString(),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "create_by",
          foreignField: "_id",
          as: "createBy_user_details",
        },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     name: 1,
      //     surname: 1,
      //     email: 1,
      //     mobile_no: 1,
      //     emailVerified: 1,
      //     profile_image: 1,
      //     accountVerified: 1,
      //     status: 1,
      //     createdAt: 1,
      //     userId: 1,
      //   },
      // },
      { $sort: { createdAt: -1 } },
    ]);

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
//dashboard

module.exports.getDashboardCount = async (req, res, next) => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  // Get the start and end of the current month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

  try {
    const getUsers = await User.find({ role: "1" });
    const getReseller = await User.find({ role: "2" });
    // Get today's comping entries
    const getTodayComping = await SendMessage.find({
      createdAt: {
        $gte: startOfDay.toLocaleDateString(),
        $lt: endOfDay.toLocaleDateString(),
      },
    });

    // Get the count of all entries for the current month
    const getMonthComping = await SendMessage.find({
      createdAt: {
        $gte: startOfMonth.toLocaleDateString(),
        $lt: endOfMonth.toLocaleDateString(),
      },
    });
    let obj = {
      users: getUsers.length > 0 ? getUsers.length : 0,
      reseller: getReseller.length > 0 ? getReseller.length : 0,
      comping: getTodayComping.length > 0 ? getTodayComping.length : 0,
      MonthComping: getMonthComping.length > 0 ? getMonthComping.length : 0,
    };
    // if (getList.length > 0) {
    return response.returnTrue(req, res, res.translate("record_found"), obj);
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
module.exports.getuserDashboardCount = async (req, res, next) => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  // Get the start and end of the current month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Fetch users and resellers created by this user
    const getUsers = await User.find({
      role: "1",
      create_by: userId,
    });

    const getReseller = await User.find({
      role: "2",
      create_by: userId,
    });

    // Get today's comping entries
    const getTodayComping = await SendMessage.find({
      create_by: userId,
      createdAt: {
        $gte: startOfDay.toLocaleDateString(),
        $lt: endOfDay.toLocaleDateString(),
      },
    });

    // Get the count of all entries for the current month
    const getMonthComping = await SendMessage.find({
      create_by: userId,
      createdAt: {
        $gte: startOfMonth.toLocaleDateString(),
        $lt: endOfMonth.toLocaleDateString(),
      },
    });

    // Get total transactions
    const totalTransaction = await Transaction.find({
      user: userId,
    });

    let obj = {
      users: getUsers.length > 0 ? getUsers.length : 0,
      reseller: getReseller.length > 0 ? getReseller.length : 0,
      comping: getTodayComping.length > 0 ? getTodayComping.length : 0,
      MonthComping: getMonthComping.length > 0 ? getMonthComping.length : 0,
      totalTransaction:
        totalTransaction.length > 0 ? totalTransaction.length : 0,
    };

    return response.returnTrue(req, res, res.translate("record_found"), obj);
  } catch (e) {
    return response.returnFalse(
      req,
      res,
      res.translate("oops_please_try_again"),
      {}
    );
  }
};


module.exports.getUserAll = async (req, res, next) => {
  let v;
  v = new Validator(req.body, {
    page: "required|integer|between:1,1000",
    search: "alpha",
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
    const getList = await User.aggregate([
      {
        $match: {
          status: { $ne: constants.CONST_DB_STATUS_SOFT_DELETE },
          //role: constants.CONST_USER_ROLE_STUDENT.toString(),
          create_by: mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "create_by",
          as: "createBy_user_details",
        },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     name: 1,
      //     surname: 1,
      //     email: 1,
      //     mobile_no: 1,
      //     emailVerified: 1,
      //     profile_image: 1,
      //     accountVerified: 1,
      //     status: 1,
      //     createdAt: 1,
      //     userId: 1,
      //   },
      // },
      { $sort: { userId: -1 } },
    ]);

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

module.exports.addUser = async (req, res, next) => {
  const postData = req.body;
  let v;
  v = new Validator(req.body, {
    name: "required",
    email: "required|email",
    mobile_no: "required",
    role: "required",
    // password: "required|string",
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

    const userDetails1 = await User.findOne({ mobile_no: postData.mobile_no });
    if (userDetails1) {
      return response.returnFalse(
        req,
        res,
        res.translate("mobile_no__already_exist"),
        {}
      );
    }
    const salt = await bcrypt.genSalt(10);
    postData.password = await bcrypt.hash(post_password, salt);
    postData.accountVerified = constants.CONST_USER_VERIFIED_TRUE;
    postData.accountVerified = constants.CONST_USER_VERIFIED_TRUE;
    //postData.role = 1;

    console.log("req.file", req.file);
    const icon = req.file?.filename;
    if (icon) {
      postData.profile_image = process.env.IMAGE_PATH + icon;
    } else {
      delete postData.profile_image;
    }
    postData.create_by = req.user.id;

    const user = new User(postData);
    const userSave = await user.save();
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    return response.returnFalse(req, res, err.message, {});
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      name: "required",
      id: "required",
      email: "required|email",
      mobile_no: "required",
      // password: "required|string",
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
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      delete req.body.password;
    }

    const icon = req.file?.profile_image;
    if (icon) {
      req.body.profile_image = process.env.IMAGE_PATH + icon;
    } else {
      delete req.body.profile_image;
    }

    console.log(req.body);
    await User.findByIdAndUpdate(req.body.id, req.body);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.addBalance = async (req, res, next) => {
  const postData = req.body;
  let v;
  v = new Validator(req.body, {
    user: "required",
    credit_type: "required",
    NoOfSms: "required",
    PerSmsPrice: "required",
    // Description: "required",
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

  // const post_password = postData.password;
  // Check User exist
  try {
    const userDetails = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.user),
    });
    if (!userDetails) {
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        {}
      );
    }
    let balance = 0;
    if (req.body.credit_type == "Add") {
      balance = parseInt(userDetails.balance) + parseInt(req.body.NoOfSms);
    } else {
      balance = parseInt(userDetails.balance) - parseInt(req.body.NoOfSms);
    }

    const obj = {
      user: req.body.user,
      credit_type: req.body.credit_type,
      NoOfSms: req.body.NoOfSms,
      PerSmsPrice: req.body.PerSmsPrice,
      Description: req.body.Description,
    };

    const transaction = new Transaction(obj);
    const transactionSave = await transaction.save();
    await User.findByIdAndUpdate(req.body.user, { balance: balance });
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    return response.returnFalse(req, res, err.message, {});
  }
};

module.exports.addUserBalance = async (req, res, next) => {
  const postData = req.body;
  let v;
  v = new Validator(req.body, {
    user: "required",
    credit_type: "required",
    NoOfSms: "required",
    PerSmsPrice: "required",
    // Description: "required",
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

  // const post_password = postData.password;
  // Check User exist
  try {
    const userDetails = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.user),
    });
    const resellerUserDetails = await User.findOne({
      _id: mongoose.Types.ObjectId(req.user.id),
    });

    if (!userDetails) {
      return response.returnFalse(
        req,
        res,
        res.translate("no_record_found"),
        {}
      );
    }

    if (req.body.NoOfSms > resellerUserDetails.balance) {
      return response.returnFalse(req, res, "insufficient balance", {});
    }
    let balance = 0;
    let resellerbalance = 0;
    if (req.body.credit_type == "Add") {
      balance = parseInt(userDetails.balance) + parseInt(req.body.NoOfSms);
      resellerbalance =
        parseInt(resellerUserDetails.balance) - parseInt(req.body.NoOfSms);
    } else {
      balance = parseInt(userDetails.balance) - parseInt(req.body.NoOfSms);
      resellerbalance =
        parseInt(resellerUserDetails.balance) + parseInt(req.body.NoOfSms);
    }

    const obj = {
      user: req.body.user,
      credit_type: req.body.credit_type,
      NoOfSms: req.body.NoOfSms,
      PerSmsPrice: req.body.PerSmsPrice,
      Description: req.body.Description,
    };

    const transaction = new Transaction(obj);
    const transactionSave = await transaction.save();
    await User.findByIdAndUpdate(req.body.user, { balance: balance });
    await User.findByIdAndUpdate(req.user.id, { balance: resellerbalance });
    return response.returnTrue(req, res, res.translate("added_success"), []);
  } catch (err) {
    return response.returnFalse(req, res, err.message, {});
  }
};

module.exports.getTransactionAll = async (req, res, next) => {
  let v;
  v = new Validator(req.body, {
    page: "required|integer|between:1,1000",
    search: "alpha",
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
    const getList = await Transaction.aggregate([
      {
        $match: {
          // status: { $ne: constants.CONST_DB_STATUS_SOFT_DELETE },
          // role: constants.CONST_USER_ROLE_STUDENT.toString(),
          // create_by: mongoose.Types.ObjectId(req.user.id)
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user_details",
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

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

module.exports.getUserTransaction = async (req, res, next) => {
  let v;
  v = new Validator(req.body, {
    page: "required|integer|between:1,1000",
    search: "alpha",
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
    const getList = await Transaction.aggregate([
      {
        $match: {
          // status: { $ne: constants.CONST_DB_STATUS_SOFT_DELETE },
          // role: constants.CONST_USER_ROLE_STUDENT.toString(),
          user: mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user_details",
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

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

module.exports.deleteTransaction = async (req, res, next) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
