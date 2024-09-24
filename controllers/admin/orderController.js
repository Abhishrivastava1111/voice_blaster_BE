const constants = require("../../config/constant");
const response = require("../../config/response");
const TempCart = require("../../models/tempCart");
const Orders = require("../../models/Orders");
const OrderDetails = require("../../models/OrderDetails");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/hlp_common");
const mongoose = require("mongoose");
module.exports.getAllOrders = async (req, res, next) => {
  console.log(req.body.status);
  let searchObj={
    status:req.body.status
  }
  if(req.body.status === undefined){
    delete searchObj.status
  }
  // console.log(searchObj)
  const getList = await Orders.find(searchObj);
  if (getList.length > 0) {
    // let finalArray = [];
    // getList.forEach(async (content) => {
    //   let getDetails = await OrderDetails.find({ orderId: content._id });
    //   let row = {
    //     _id: content._id,
    //     userId: content.userId,
    //     user_Order_ID: content.user_Order_ID,
    //     customer_name: content.customer_name,
    //     customer_mobile_no: content.customer_mobile_no,
    //     customer_email_id: content.customer_email_id,
    //     customer_address1: content.customer_address1,
    //     customer_address2: content.customer_address2,
    //     country: content.country,
    //     state: content.state,
    //     city: content.city,
    //     zip_code: content.zip_code,
    //     amount: content.amount,
    //     discount_amount: content.discount_amount,
    //     total_amount: content.total_amount,
    //     delivery_type: content.delivery_type,
    //     payment_status: content.payment_status,
    //     status: content.status,
    //     createdAt: content.createdAt,
    //     orderId: content.orderId,
    //     OrderDetails: getDetails,
    //   };

    //   finalArray.push(row);
    //   if (finalArray.length == getList.length) {
    //     return response.returnTrue(
    //       req,
    //       res,
    //       res.translate("record_found"),
    //       finalArray
    //     );
    //   }
    // });

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


module.exports.getOrderDetails = async (req, res, next) => {
  const getList = await OrderDetails.aggregate([
    {
      $match: {orderID:mongoose.Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product_details",
      },
    },
  
  ]);

  let order = await Orders.find({_id:mongoose.Types.ObjectId(req.params.id)});
  // console.log(req.params.id);
  if (getList.length > 0) {
 const OrderDetail={
order:order[0],
  Product:getList
 }
    return response.returnTrue(
      req,
      res,
      res.translate("record_found"),
      OrderDetail
    );
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
};

module.exports.ChangesStatus = async (req, res, next) => {
  try {
    const body = req.body;
    const v = new Validator(req.body, {
      orderID: "required",
      status: "required",
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

    let OrderObj = {
      status: body.status,
    };

    await Orders.findByIdAndUpdate(body.orderID, OrderObj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.DeleteOrder = async (req, res, next) => {
  try {
    // const body = req.body;
    // const v = new Validator(req.body, {
    //   orderID: "required",
    //   status: "required",
    // });

    // let matched = await v.check();
    // if (!matched) {
    //   console.log(v);
    //   return response.returnFalse(
    //     req,
    //     res,
    //     helper.validationErrorConvertor(v),
    //     {}
    //   );
    // }

    // let OrderObj = {
    //   status: body.status,
    // };

    await Orders.deleteOne({_id:req.params.id});

    await OrderDetails.deleteMany({ orderID: req.params.id });
    return response.returnTrue(req, res, res.translate("delete_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// updatePaymentGetaway


