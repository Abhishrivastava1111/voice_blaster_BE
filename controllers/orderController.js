const constants = require("../config/constant");
const response = require("../config/response");
const TempCart = require("../models/tempCart");
const Orders = require("../models/Orders");
const OrderDetails = require("../models/OrderDetails");
const { path, dirname } = require("path");
const { Validator } = require("node-input-validator");
const helper = require("../helper/hlp_common");
const mongoose = require("mongoose");

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_live_ovgyZIxh8Y3yaM",
  key_secret: "NGaGphaVlCrCXpNLPFgjS142",
  // key_id: "rzp_test_FmPGGojSfkvlsy",
  // key_secret: "bjnssyQD2PV7xGHKI4SgMlUO",
  // key_id: "rzp_live_qcIhO5Qqeih1zg",
  // key_secret: "HCxhNChk0LPSboi2cSaor6HJ",
});

module.exports.getAllOrders = async (req, res, next) => {
  const getList = await Orders.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  if (getList.length > 0) {
    return response.returnTrue(
      req,
      res,
      res.translate("record_found"),
      getList
    );
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
  } else {
    return response.returnFalse(req, res, res.translate("no_record_found"), []);
  }
};

module.exports.createOrder = async (req, res, next) => {
  try {
    const body = req.body;
    const v = new Validator(req.body, {
      customer_name: "required",
      customer_mobile_no: "required",
      customer_email_id: "required|email",
      customer_address1: "required",
      // country: "required",
      state: "required",
      city: "required",
      // zip_code: "required",
      amount: "required",
      // discount_amount: "required",
      total_amount: "required",
      delivery_type: "required",
      // payment_status: "required",
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
    let OrderID = Math.floor(100000 + Math.random() * 900000);
    let OrderObj = {
      userId: req.user.id,
      user_Order_ID: OrderID,
      customer_name: body.customer_name,
      customer_mobile_no: body.customer_mobile_no,
      customer_email_id: body.customer_email_id,
      customer_address1: body.customer_address1,
      customer_address2: body.customer_address1,
      country: body.country,
      state: body.state,
      city: body.city,
      zip_code: body.zip_code,
      amount: body.amount,
      discount_amount: body.discount_amount,
      total_amount: body.total_amount,
      note: body.note,
      delivery_type: body.delivery_type,
      payment_status: (body.delivery_type !== "Prepaid")?body.payment_status:"Failed",
      status: (body.delivery_type !== "Prepaid")?"Pending":"Cancelled",      
      shipping_charge: body.shipping_charge,
    };

    const order = new Orders(OrderObj);
    let orderSaved = await order.save();
    if (orderSaved) {
      let order_detail = [];
      for (let i = 0; i < body.cart.length; i++) {
        let order_detail_obj = {
          orderID: orderSaved._id,
          productID: body.cart[i].productId,
          quantity: body.cart[i].quantity,
        };
        order_detail.push(order_detail_obj);
      }
      if (body.cart.length > 0) {
        await TempCart.deleteMany({ tmpUserID: body.cart[0].tmpUserID });
      }

      await OrderDetails.insertMany(order_detail);
    }
    let obj = {};
    if (body.delivery_type === "Prepaid") {
      const options = {
        amount: body.total_amount, // Amount in paise
        currency: "INR",
        receipt: OrderID,
        payment_capture: 1,
      };
      console.log(options);
      let response1 = razorpay.orders.create(options);
      obj.orderId = response1.id;
      obj.order_id = orderSaved._id;
    }

    let api_response = {
      success: true,
      message: "Success",
      data: obj,
    };

    return res.status(200).json(api_response);
    // return res.status(200).json(obj);
    // let
    // return response.returnTrue(req, res, res.translate("added_success"), obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.UpdatePaymentGetawayStatus = async (req, res, next) => {
  try {
    const body = req.body;
    const v = new Validator(req.body, {
      razorpay_payment_id: "required",
      order_id: "required",
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
      status: "Pending",
      payment_status: "Success",
      razorpay_payment_id: req.body.razorpay_payment_id,
    };

    await Orders.findByIdAndUpdate(body.order_id, OrderObj);
    return response.returnTrue(req, res, res.translate("update_success"), []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
