const mongoose = require("mongoose");
const constants = require("../config/constant");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductSchema = mongoose.Schema({
  productId: {
    type: Number,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    autopopulate: true,
  },
  SubCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    autopopulate: true,
  },
  ChildCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChildSubCategory",
    autopopulate: true,
  },
  HomeCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HomeCategory",
    autopopulate: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 150,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxLength: 150,
  },
  mrp: {
    type: Number,
    //required: true,
    default: 0,
    //unique: true
  },
  quantity: {
    type: Number,
    //required: true,
    default: 0,
    //unique: true
  },
  price: {
    type: Number,
    //required: true,
    default: 0,
    //unique: true
  },
  image: {
    type: Array,
    //required: true,
    default: [],
    //unique: true
  },
  short_decription: {
    type: String,
    required: true,
    // unique: true,
  },
  long_decription: {
    type: String,
    required: true,
    // unique: true,
  },
  shipping_info: {
    type: String,
    default: "",
  },
  refund_policy: {
    type: String,
    default: "",
  },
  sort_order: {
    type: String,
    //required: true,
    default: "",
    //unique: true
  },
  status: {
    type: String,
    enum: [
      constants.CONST_DB_STATUS_ACTIVE,
      constants.CONST_DB_STATUS_INACTIVE,
    ],
    default: constants.CONST_DB_STATUS_ACTIVE,
  },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.plugin(AutoIncrement, { inc_field: "productId" });
module.exports = mongoose.model("Products", ProductSchema);
