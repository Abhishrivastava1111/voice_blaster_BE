const ChatUserHistory = require('./../../models/ChatUserHistory');
const response = require("../../config/response");
const { Validator } = require("node-input-validator");
const helper = require("./../../helper/hlp_common");
const constants = require('./../../config/constant');
const mongoose = require("mongoose");
const addHistory = async (senderId, receiverId, roomId) => {
  const insertDetails = {
      senderId: senderId,
      receiverId: receiverId,
      roomId: roomId
  };
  const ChatUserHistoryRecord = new ChatUserHistory(insertDetails);
  return await ChatUserHistoryRecord.save();
};

const checkHistoryExists = async (senderId, receiverId, roomId) => {
    const getDetails = await ChatUserHistory.findOne({
        senderId: senderId,
        receiverId: receiverId,
        roomId: roomId
    });
    return getDetails;
};

const getUserHistory = async (req, res, next) => {
    const body = req.body;
    const v = new Validator(body, {
        user_id: "required",
        type: 'required'
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
    
    let tempObj = {};
    if (body.room.length) {
        tempObj.roomId = new mongoose.Types.ObjectId(body.room);
    }
    let details;
    if (body.type == constants.CONST_USER_ROLE_EMPLOYER) {
        tempObj.senderId = new mongoose.Types.ObjectId(body.user_id);

        details = await ChatUserHistory.aggregate([
            {
                $match: tempObj
            },
            {
                $project: {
                    "roomId": 1, "receiverId": 1,
                    "senderId": 1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiverId',
                    foreignField: '_id',
                    as: 'user_info',
                    pipeline: [
                        {
                            $project: {
                                "name": 1,
                                "surname": 1, "email": 1,
                                "profile_image": 1
                            }
                        }
                    ]
                }
            }
        ]);
    } else {
        tempObj.receiverId = new mongoose.Types.ObjectId(body.user_id);
        console.log(JSON.stringify(tempObj));
        details = await ChatUserHistory.aggregate([
            {
                $match: tempObj
            },
            {
                $project: {
                    "roomId": 1, "receiverId": 1,
                    "senderId": 1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'user_info',
                    pipeline: [
                        {
                            $project: {
                                "name": 1,
                                "surname": 1, "email": 1,
                                "profile_image": 1
                            }
                        }
                    ]
                }
            }
        ]);
    }

    if (details.length > 0) {
        return response.returnTrue(
            req,
            res,
            res.translate("record_found"),
            details
        );
    } else {
        return response.returnFalse(
            req,
            res,
            res.translate("no_record_found"),
            {}
        );
    }

}

module.exports = { addHistory, checkHistoryExists, getUserHistory };