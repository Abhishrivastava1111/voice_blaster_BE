const constants = require("../../config/constant");
const response = require("../../config/response");
const SendMessage = require("../../models/SendMessage");
const AudioFile = require("../../models/AudioFile");
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


module.exports.changeAudioStatus = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE
  // const getList = await SendMessage.find();

  const audio_id = req.body.audio_id;
  const modifiedStatus = req.body.modified_status;
  const currentTimeStamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta" });
  AudioFile.updateOne({ audio_id: audio_id }, { $set: { status: modifiedStatus, admin_action_date: currentTimeStamp } })
    .then(result => {
      console.log(result);
      return response.returnTrue(
        req,
        res,
        "record updated",
      );
    })
    .catch(error => {
      console.error(error);
      return response.returnFalse(req, res, "update record failed");
    });
} // end of changeAudioStatus






module.exports.getAllAudiosDetails = async (req, res, next) => {

  const page = parseInt(req.body.page);
  const limit = parseInt(req.body.limit);
  const skip = (page - 1) * limit;
  const statusFilter = req.body.statusFilter == "all" ? {} : { status: req.body.statusFilter };

  const getAudioList = await AudioFile.aggregate([
    {
      $match: statusFilter
    },
    {
      $lookup: {
        from: "users",
        localField: "uploaded_by",
        foreignField: "_id",
        as: "uploaded_by_user",
      },
    },
    { $unwind: '$uploaded_by_user' },
    { $project: { 'audio_id': 1, 'audio_file_display_name': 1, 'audio_file': 1, 'status': 1, 'upload_date': 1, 'uploaded_by_user.name': 1, 'uploaded_by_user.email': 1, 'uploaded_by_user.mobile_no': 1 } },
    { $sort: { upload_date: -1 } },
    { $limit: skip + limit },
    { $skip: skip },
  ]);

  if (getAudioList.length > 0) {

    const count = await AudioFile.countDocuments();
    let resData = {
      data: getAudioList,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };

    console.log(getAudioList);
    return response.returnTrue(
      req,
      res,
      "record found",
      resData
    );
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
} // end of getAllAudiosDetails


module.exports.getAllSendMessage = async (req, res, next) => {
  //status: constants.CONST_DB_STATUS_ACTIVE
  // const getList = await SendMessage.find();

  const page = parseInt(req.body.page);
  const limit = parseInt(req.body.limit);
  console.log("page ==> ", req.body.page);
  const skip = (page - 1) * limit;
  console.log("skip ==> ", skip);
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
    { $sort: { campaign_date: -1 } },
    { $limit: skip + limit },
    { $skip: skip },
  ]);
  if (getList.length > 0) {
    getList.forEach(async (content) => {
      let report = [];
      let ReportArray = [];
      // console.log(content.contact_no);
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
          content.status == "Complete"
            ? content.Completed_At.replaceAll(",", "")
            : "";
        var createdAt = content.createdAt
          ? content.createdAt.replaceAll(",", "")
          : "";

        ReportArray.push([
          content._id,
          content.createBy_user_details[0]?.name,
          number,
          content.status,
          createdAt,
          completedDateTime,
          // content.Completed_At,
        ]);
      });
      content.report = ReportArray;
    });
    const count = await SendMessage.countDocuments();
    let resData = {
      data: getList,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
    // console.log(resData);
    return response.returnTrue(
      req,
      res,
      res.translate("record_found"),
      resData
    );
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
};






module.exports.getAllSendMessageOLD = async (req, res, next) => {
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

    { $sort: { SendMessageId: -1 } },
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
          content.status == "Complete"
            ? content.Completed_At.replaceAll(",", "")
            : "";
        var createdAt = content.createdAt
          ? content.createdAt.replaceAll(",", "")
          : "";

        ReportArray.push([
          content._id,
          content.createBy_user_details[0]?.name,
          number,
          content.status,
          createdAt,
          completedDateTime,
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

    { $sort: { SendMessageId: -1 } },
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

module.exports.getUserAudios = async (req, res, next) => {
  const audioList = await AudioFile.find({
    uploaded_by: req.user.id,
  }, { _id: false })
    .sort({ upload_date: -1 });;

  return response.returnTrue(
    req,
    res,
    "records_found",
    audioList
  );
}


module.exports.getUserApprovedAudios = async (req, res, next) => {

  const audioList = await AudioFile
    .find({ uploaded_by: req.user.id, status: "approved" }, { _id: 0, audio_id: 1, audio_file_display_name: 1 })
    .sort({ upload_date: -1 });

  return response.returnTrue(
    req,
    res,
    "records_found",
    audioList
  );
}


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
    { $sort: { SendMessageId: -1 } },
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


    console.log(getList);


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

module.exports.getAudioApproval = async (req, res, next) => {
  try {
    var data = {}
    data.audio_file_display_name = req.body.fileName || req.file.originalname;
    data.audio_file = process.env.AUDIO_PATH + req.file.filename;
    data.status = "pending";
    data.uploaded_by = req.user.id;
    data.upload_date = new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta" });
    var af = new AudioFile(data);
    af.save()
      .then((success) => {
        console.log(success);
        response.returnTrue(req, res, "audio file uploaded successfully !! ");
      })
      .catch((failure) => {
        var msg = "failed to upload audio file !!";
        if (failure.code == 11000) {
          fs.unlink("./audio_files/" + req.file.filename, (err) => {
            if (err)
              console.log(err)
            else
              console.log("file removed sucessfully");
          });
          msg = "file with same name already exists !!!";
        }//end of if 
        response.returnFalse(req, res, msg);
      });
  }
  catch (err) {
    response.returnFalse(req, res, "failed to upload audio file !!");
  }

}//end of getAudioApproval


module.exports.addSendMessage = async (req, res, next) => {
  try {
    let v = new Validator(req.body, {
      contact_no: "required",
      msg_count: "required",
      audio_id : "required"
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

    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    // let WhiteListNo;

    let checkLimit = await SendMessage.find({
      campaign_date: { $gte: start, $lt: end },
      create_by: req.user.id,
    }).count();

    if (checkLimit >= 4) {
      return response.returnFalse(req, res, "your daily limit has been cross");
    }

    //check audio approval status 
    let fetchedAudio = await AudioFile.findOne({ uploaded_by : req.user.id , audio_id : req.body.audio_id , status : "approved"});
    
    if(!fetchedAudio){
      return response.returnFalse(req, res, "invalid audio" )
    }

    req.body.create_by = req.user.id;
    req.body.audio_file = fetchedAudio.audio_file ;  
    // req.body.slug = slugify(req.body.name);
    let contact_number = req.body.contact_no;
    let contactNo = (req.body.contact_no = contact_number.split(/\r\n/)); ///\r|\r\n|\n/
    let contactNoLen = contactNo.length;
    let WhiteListNumber = req.body.contact_no;
    // console.log("req.body.contact_no", req.body.contact_no.join(","));
    let contacts = req.body.contact_no.join(",");
    req.body.contact_no = contacts.replace(/,*$/, "");
    // console.log("req.body.contact_no", req.body.contact_no);
    let createTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Calcutta",
    });
    // console.log();
    req.body.createdAt = createTime;
    // req.body.createdTime=moment(createTime).format("hh:mm A");
    const userDetails = await User.findOne({ _id: req.user.id });

    if (userDetails.balance >= contactNoLen) {
      // let count = req.body.contact_no.length;
      // console.log("contact_no", req.body.contact_no);
      // console.log("count", contactNoLen);
      // console.log("balance", userDetails.balance);

      let balanceUpdate1 =
        parseInt(userDetails.balance) - parseInt(contactNoLen);
      let updateBalance = await User.updateOne(
        { _id: req.user.id },
        {
          $set: {
            balance: balanceUpdate1,
          },
        }
      );
      let contact_numbers = req.body.contact_no;
  
      let audio_file = req.body.audio_file; //"https://file-examples.com/storage/fe7bb0e37864d66f29c40ee/2017/11/file_example_MP3_700KB.mp3"; //"https://api.voiceblaster.co.in/images/1696676029423.mp3";//
      // console.log("audio_file", audio_file);
      
      //----------- commented - because servise is temporary unavailable
      // let username = "u14311";
      // let token = "1JcpOU";
      // const res1 = await axios.get(
      //   `https://obd37.sarv.com/api/voice/upload_announcement.php?username=${username}&token=${token}&announcement_path=${audio_file}`
      // );
      // console.log("res", res1.data);
      //----------- commented - because servise is temporary unavailable
      
      
      // await ContactNumber.insertMany([...req.body.contact_no].map((item)=>{
      const WhiteListNo = (
        await WhiteList.find({
          phoneNo: { $in: WhiteListNumber },
        })
      )
        .map((entry) => entry.phoneNo)
        .join(",");

      let whiteListLen = WhiteListNo.split(",").length;
      //   const WhiteListNo = await WhiteList.find({
      //     phoneNo: { $in: WhiteListNumber },
      //   });

      // const WhiteListNo = await WhiteList.find({
      //   phoneNo: { $in: WhiteListNumber },
      // });

      // console.log(WhiteListNo);

      // contact_numbers.forEach((element) => {});

      // const contact_numbers_str = numbers.replace(/,*$/, "");

      // https://obd37.sarv.com/api/voice/voice_broadcast.php?username=u14311&token=1JcpOU&plan_id=32782
      // &announcement_id=441570&caller_id=0&contact_numbers=8305453647&retry_json={"FNA":"1","FBZ":0,"FCG":"2","FFL":"1"}
      if (WhiteListNumber.length <= 20) {
        console.log("contact_numbers", contact_numbers);
        // const res2 = await axios.get(
        //   `https://obd37.sarv.com/api/voice/voice_broadcast.php?username=${username}&token=${token}&plan_id=37535&announcement_id=${res1.data.data[0].announcement_id}&caller_id=0&contact_numbers=${contact_numbers}&retry_json={"FNA":"1","FBZ":0,"FCG":"2","FFL":"1"}`
        // );
        // console.log("res2", res2);
      } else {
        // let WhiteListNum = "";
        // WhiteListNo.forEach((element) => {
        //   WhiteListNum += element.phoneNo + ",";
        // });
        // const WhiteListNumbers = WhiteListNum.replace(/,*$/, "");

        // console.log("WhiteListNo", WhiteListNo);
        console.log("WhiteListNo.length", whiteListLen);
        if (whiteListLen > 0) {
          console.log("whiteList:=>", WhiteListNo);

          // const res2 = await axios.get(
          //   `https://obd37.sarv.com/api/voice/voice_broadcast.php?username=${username}&token=${token}&plan_id=32782&announcement_id=${res1.data.data[0].announcement_id}&caller_id=0&contact_numbers=${WhiteListNo}&retry_json={"FNA":"1","FBZ":0,"FCG":"2","FFL":"1"}`
          // );
        }

        //  console.log("WhiteListNum", WhiteListNumbers);
      }
      console.log("contactNo1", req.body.contact_no);
      req.body.contact_no = contactNo;
      console.log("contactNo2", req.body.contact_no);
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
