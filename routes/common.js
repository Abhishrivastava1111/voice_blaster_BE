const express = require("express");
const router = express.Router();

const authMiddleWare = require("../middleware/auth");

const CategoryController = require("../controllers/categoryController");
const SubCategoryController = require("../controllers/subCategoryController");
const HomeCategoryController = require("../controllers/homeCategoryController");
const ProductController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");

const sliderController = require("../controllers/sliderController");

const bannerController = require("../controllers/bannerController");

const websiteInfo = require("../controllers/websiteInfo");
const testimonialController = require("../controllers/testimonialController");
const staticPagesController = require("../controllers/staticPagesController");

const shipmentChargesController = require("../controllers/shipmentChargesController");

//Category
router.get(
  "/getAllCategory",
  CategoryController.getAllCategory
);
//Category

//SubCategory
router.get(
  "/getSubCategory/:id",
  SubCategoryController.getAllSubCategory
);
//SubCategory

//HomeCategory
router.get(
  "/getAllHomeCategory",
  HomeCategoryController.getAllHomeCategory
);
//HomeCategory

//Product
router.get(
  "/getAllProduct",
  ProductController.getAllProduct
);
router.get(
  "/ProductView/:slug",
  ProductController.ProductDetails
);

router.get(
  "/relatedProducts/:id",
  ProductController.RelatedProducts
);

router.post(
  "/getProductsByCategorySlug/",
  ProductController.getProductsByCategorySlug
);



router.post(
  "/getProductsByCategorySlugAndSubCategory/",
  ProductController.getProductsByCategorySlugAndSubCategory
);

router.post(
  "/getProductsByHomeCategorySlug/",
  ProductController.getProductsByHomeCategorySlug
);


router.post(
  "/productSearch/",
  ProductController.productSearch
);


// getProductsByCategorySlug
//Product

//cart
router.post(
  "/getAllCart",
  cartController.getAllCartItem
);

router.post(
  "/addToCart",
  cartController.addToCart
);

router.put(
  "/updateCart/:id",
  cartController.updateCart
);

router.delete(
  "/deleteCart/:id",
  cartController.deleteCart
);

//cart

// Order
router.post(
  "/createOrder",
  authMiddleWare.authenticateToken,
  orderController.createOrder
);

router.post(
  "/getAllOrders",
  authMiddleWare.authenticateToken,
  orderController.getAllOrders
);

router.post(
  "/updatePaymentGetawayStatus",
  authMiddleWare.authenticateToken,
  orderController.UpdatePaymentGetawayStatus
);


// Order

//slider
router.get(
  "/getAllSlider",
  sliderController.getAllSlider
);

//Banner
router.get(
  "/getAllBanner",
  bannerController.getAllBanner
);

//Website Info
router.get(
  "/getWebsiteInfo",
  websiteInfo.getWebsiteInfo
);


//Testimonial
router.get(
  "/getAllTestimonial",
  testimonialController.getAllTestimonial
);
//Testimonial

//getPages
router.post(
  "/getPages",
  staticPagesController.getPages
);
//getPages

//website on off
router.get(
  "/websiteOn",
  websiteInfo.websiteOn
);
//website on off

//getShipmentcharges
router.get(
  "/getShipmentcharges",
  authMiddleWare.authenticateToken,
  shipmentChargesController.getShipmentcharges
);
//getShipmentcharges


module.exports = router;
