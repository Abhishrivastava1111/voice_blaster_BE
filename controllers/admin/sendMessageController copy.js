const constants = require("../../config/constant");
const response = require("../../config/response");
const SendMessage = require("../../models/SendMessage");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const slugify = require("slugify");
const fs = require("fs");
const mongoose = require("mongoose");
const moment = require("moment");

const http = require("http");
const axios = require("axios");
const User = require("../../models/User");
const WhiteList = require("../../models/WhiteList");

module.exports.getAllSendMessage = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE
  // const getList = await SendMessage.find();

  let status = "Pending";
  if (req.body.status) {
    status: req.body.status;
  }
  const getList = await SendMessage.aggregate([
    {
      $match: {
        // status: status,
        // role: constants.CONST_USER_ROLE_STUDENT.toString(),
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

    { $sort: { createdAt: -1 } },
  ]);
  if (getList.length > 0) {
    getList.forEach(async (content) => {
      let report = [];
      let ReportArray = [];
      console.log(content.contact_no);
      report = content.contact_no;
      ReportArray.push([
        "Unique_Id",
        "Username",
        "Mobile_No",
        "Status",
        "Create_At",
        "Completed_At",
      ]);
      report.forEach((number) => {

        var completedDateTime =
        content.status == "Complete" ? content.Completed_At.replaceAll(',', ''): "";
        var createdAt =
        content.createdAt ? content.createdAt.replaceAll(',', ''): "";
        
        ReportArray.push([
          content._id,
          content.createBy_user_details[0]?.name,
          number,
          content.status,
          createdAt,
          completedDateTime
          // content.Completed_At,
        ]);
      });
      content.report = ReportArray;
    });
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

module.exports.getAllLetestMessage = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE
  // const getList = await SendMessage.find();

  let status = "Pending";
  if (req.body.status) {
    status: req.body.status;
  }
  const getList = await SendMessage.aggregate([
    {
      $match: {
        // status: status,
        // role: constants.CONST_USER_ROLE_STUDENT.toString(),
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
    { $limit: 10 },

    { $sort: { createdAt: -1 } },
  ]);
  if (getList.length > 0) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      minute: "numeric",
      weekday: "long",
      timeZone: "Asia/calcutta",
    });
    getList.forEach(async (content) => {
      let report = [];
      let ReportArray = [];
      console.log(content.contact_no);
      report = content.contact_no;
      ReportArray.push([
        "Unique_Id",
        "Username",
        "Mobile_No",
        "Status",
        "Create_At",
        "Completed_At",
      ]);
      report.forEach((number) => {
        // var completedDateTime=(content.status=='Complete')?moment(content.Completed_At).format("DD-MM-YYYY hh:mm A "):"";
        var completedDateTime =
          content.status == "Complete" ? content.Completed_At : "";
        // formatter.format(moment(content.createdAt).format("DD-MM-YYYY hh:mm A ")),

        ReportArray.push([
          content._id,
          content.createBy_user_details[0]?.name,
          number,
          content.status,
          content.createdAt,
          completedDateTime, //moment(content.Completed_At).format("DD-MM-YYYY hh:mm A "),
        ]);
      });
      content.report = ReportArray;
    });
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
module.exports.getAllUserSendMessage = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE
  // const getList = await SendMessage.find();

  let status = "Pending";
  if (req.body.status) {
    status: req.body.status;
  }
  const getList = await SendMessage.aggregate([
    {
      $match: {
        // status: status,
        create_by: mongoose.Types.ObjectId(req.user.id),
        // role: constants.CONST_USER_ROLE_STUDENT.toString(),
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

    { $sort: { createdAt: -1 } },
  ]);
  if (getList.length > 0) {
    getList.forEach(async (content) => {
      let report = [];
      let ReportArray = [];
      console.log(content.contact_no);
      report = content.contact_no;
      ReportArray.push([
        "Unique_Id",
        "Username",
        "Mobile_No",
        "Status",
        "Create_At",
        "Completed_At",
      ]);

      report.forEach((number) => {
        var completedDateTime =
          content.status == "Complete" ? content.Completed_At : "";
        ReportArray.push([
          content._id,
          content.createBy_user_details[0]?.name,
          number,
          content.status,
          content.createdAt,
          completedDateTime, //moment(content.Completed_At).format("DD-MM-YYYY hh:mm A "),
        ]);
      });
      content.report = ReportArray;
    });
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
module.exports.addSendMessage = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      msg_count: "required",
      contact_no: "required",
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

    // https://obd37.sarv.com/api/voice/voice_broadcast.php?username=u14311&token=1JcpOU&plan_id=32782&announcement_id=444777&caller_id=8305453647&contact_numbers=
    // 8305453647&retry_json={"FNA":"1","FBZ":0,"FCG":"2","FFL":"1"}&dtmf_wait=1&dtmf_wait_time=1

    // https://obd37.sarv.com/api/voice/upload_announcement.php?username=u14311&token=1JcpOU&announcement_path=
    // https://file-examples.com/storage/fe7bb0e37864d66f29c40ee/2017/11/file_example_MP3_700KB.mp3

    //     let username = "u14311";
    //     let token = "1JcpOU";
    //     let audio_file =
    //       "https://file-examples.com/storage/fe7bb0e37864d66f29c40ee/2017/11/file_example_MP3_700KB.mp3";
    //     const options = {
    //       hostname: `https://obd37.sarv.com/api/voice/upload_announcement.php?username=${username}&token=${token}&announcement_path=${audio_file}`,

    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     };

    //     const request = http.request(options, (response) => {
    //       // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
    //       response.setEncoding("utf8");

    //       // As data starts streaming in, add each chunk to "data"
    //       response.on("data", (chunk) => {
    //         data += chunk;
    //       });

    //       // The whole response has been received. Print out the result.
    //       response.on("end", () => {
    //         console.log(data);
    //       });
    //     });

    //     // Log errors if any occur
    //     request.on("error", (error) => {
    //       console.error(error);
    //     });

    //     // End the request
    //     request.end();
    // return;
    req.body.create_by = req.user.id;
    req.body.audio_file = process.env.IMAGE_PATH + req.file.filename;
    // req.body.slug = slugify(req.body.name);
    let contact_number = req.body.contact_no;
    req.body.contact_no = contact_number.split(/\r\n/); ///\r|\r\n|\n/
    let createTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Calcutta",
    });
    // console.log();
    req.body.createdAt = createTime;
    // req.body.createdTime=moment(createTime).format("hh:mm A");
    const userDetails = await User.findOne({ _id: req.user.id });

    if (userDetails.balance >= req.body.contact_no.length) {
      let count = req.body.contact_no.length;
      let balanceUpdate1 = parseInt(userDetails.balance) - parseInt(count);
      let updateBalance = await User.updateOne(
        { _id: req.user.id },
        {
          $set: {
            balance: balanceUpdate1,
          },
        }
      );
      let contact_numbers = req.body.contact_no;
      let username = "u14311";
      let token = "1JcpOU";
      let audio_file = req.body.audio_file; //"https://file-examples.com/storage/fe7bb0e37864d66f29c40ee/2017/11/file_example_MP3_700KB.mp3"; //
      console.log("audio_file", audio_file);
      // const res1 = await axios.get(
      //   `https://obd37.sarv.com/api/voice/upload_announcement.php?username=${username}&token=${token}&announcement_path=${audio_file}`
      // );
      // console.log("res", res1.data);
      // await ContactNumber.insertMany([...req.body.contact_no].map((item)=>{
      let numbers = "";
      let WhiteListNumber = [];
      contact_numbers.forEach((element) => {
        numbers += element + ",";
        WhiteListNumber.push(element);
        // console.log(element);
      });

      // const WhiteListNo = await WhiteList.find({
      //   phoneNo: { $in: WhiteListNumber },
      // });

      // console.log(WhiteListNo);

      // contact_numbers.forEach((element) => {});

      const contact_numbers_str = numbers.replace(/,*$/, "");

      // https://obd37.sarv.com/api/voice/voice_broadcast.php?username=u14311&token=1JcpOU&plan_id=32782
      // &announcement_id=441570&caller_id=0&contact_numbers=8305453647&retry_json={"FNA":"1","FBZ":0,"FCG":"2","FFL":"1"}
      if (req.body.contact_no.length <= 20) {
        // const res2 = await axios.get(
        //   `https://obd37.sarv.com/api/voice/voice_broadcast.php?username=${username}&token=${token}&plan_id=32782&announcement_id=${res1.data.data[0].announcement_id}&caller_id=0&contact_numbers=${contact_numbers_str}&retry_json={"FNA":"1","FBZ":0,"FCG":"2","FFL":"1"}`
        // );
      }

      // console.log("res", res1.data.data[0].announcement_id);
      const sendMsg = new SendMessage(req.body);
      await sendMsg.save();
      return response.returnTrue(req, res, res.translate("added_success"), []);
    } else {
      return response.returnFalse(
        req,
        res,
        res.translate("insufficient_balance"),
        []
      );
    }
    // req.body.icon=req.file.filename;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteSendMessage = async (req, res, next) => {
  try {
    // const checkDdata = await Category.findOne({
    // _id: req.params.id.trim(),
    // });
    // console.log(checkDdata.icon);
    // let filePath = process.env.IMAGE_PATH + checkDdata.icon;
    // fs.unlinkSync(filePath);
    await SendMessage.findByIdAndDelete(req.params.id);
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateReport = async (req, res, next) => {
  try {
    let obj = {};

    // else{
    //   req.body.slug = slugify(req.body.name);
    // }

    const icon = req.file?.filename;
    if (icon) {
      obj.final_report_file = process.env.IMAGE_PATH + icon;
      // delete obj.icon;
    } else {
      delete obj.final_report_file;
    }
    await SendMessage.findByIdAndUpdate(req.params.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateSendMessageStatus = async (req, res, next) => {
  try {
    let obj = {
      status: req.body.status,
    };
    if (req.body.status == "Complete") {
      // obj.Completed_At = new Date().toLocaleString("en-US", {
      //   timeZone: "Asia/Calcutta",
      // });

      obj.Completed_At = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      });
      // console.log();
      // req.body.createdAt = createTime;
      //new Date(Date.now()).toISOString();
    }
    await SendMessage.findByIdAndUpdate(req.params.id, obj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
