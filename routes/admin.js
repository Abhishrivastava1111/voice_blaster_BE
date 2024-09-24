const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const authMiddleWare = require("../middleware/auth");

const authController = require("../controllers/admin/authController");
const whiteListController = require("../controllers/admin/whiteListController");

// const CategoryController = require("../controllers/admin/categoryController");
// const sliderController = require("../controllers/admin/sliderController");
// const SubCategoryController = require("../controllers/admin/subCategoryController");
// const ChildCategoryController = require("../controllers/admin/childCategoryController");
// const HomeCategoryController = require("../controllers/admin/homeCategoryController");
// const ProductController = require("../controllers/admin/productController");
// const orderController = require("../controllers/admin/orderController");
const userController = require("../controllers/admin/userController");
const sendMessageController = require("../controllers/admin/sendMessageController");
const contactGroupController = require("../controllers/admin/contactGroupController");

// const staticPagesController = require("../controllers/admin/staticPagesController");
const websiteInfo = require("../controllers/admin/websiteInfo");
// const bannerController = require("../controllers/admin/bannerController");
// const testimonialController = require("../controllers/admin/testimonialController");
const supportController = require("../controllers/admin/supportController");

const notesController = require("../controllers/admin/notesController");

// image upload
const multer = require("multer");

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    // cb(null, `${Date.now()}--${file.originalname}`);
    if (file.fieldname == "final_report_file") {
      cb(null, `${Date.now()}--${file.originalname}`);
    } else if (file.fieldname == "profile_image") {
      cb(null, `${Date.now()}--${file.originalname}`);
    } else if (file.fieldname == "logo") {
      cb(null, `${Date.now()}--${file.originalname}`);
    } else if (file.fieldname == "favicon_icon") {
      cb(null, `${Date.now()}--${file.originalname}`);
    } else {
      cb(null, `${Date.now()}.mp3`);
    }
    // cb(null, `${Date.now()}.mp3`);
    // cb(null, `${Date.now()}`);
  },
});
//initializing multer
const upload = multer({
  storage: storageEngine,
});

// const upload = multer({ dest: "./images" });

router.post(
  "/login",
  //  authMiddleWare.version,
  authController.login
);

router.post(
  "/change-password",
  authMiddleWare.authenticateToken,
  authController.changePassword
);

router.post(
  "/updateProfile",
  authMiddleWare.adminAuthentication,
  upload.single("profile_image"),
  authController.updateProfile
);

router.post(
  "/forgot-password",
  // authMiddleWare.version,
  authController.forgotPassword
);

//user list
router.post(
  "/getAllUser",
  authMiddleWare.adminAuthentication,
  userController.getAll
);

router.post(
  "/getAllResellerUser",
  authMiddleWare.authenticateToken,
  userController.getUserAll
);

router.delete(
  "/deleteUser/:id",
  authMiddleWare.adminAuthentication,
  userController.deleteUser
);

router.post(
  "/addUser",
  authMiddleWare.authenticateToken,
  upload.single("profile_image"),
  userController.addUser
);

router.post(
  "/updateUser/",
  authMiddleWare.authenticateToken,
  upload.single("profile_image"),
  userController.updateUser
);
//user list

//SendMessage
router.post(
  "/getAllSendMessage",
  authMiddleWare.adminAuthentication,
  sendMessageController.getAllSendMessage
);
router.post(
  "/getAllLetestMessage",
  authMiddleWare.adminAuthentication,
  sendMessageController.getAllLetestMessage
);
router.post(
  "/getAllUserSendMessage",
  authMiddleWare.authenticateToken,
  sendMessageController.getAllUserSendMessage
);

router.post(
  "/addSendMessage",
  authMiddleWare.authenticateToken,
  upload.single("audio"),
  sendMessageController.addSendMessage
);

router.delete(
  "/deleteSendMessage/:id",
  authMiddleWare.adminAuthentication,
  sendMessageController.deleteSendMessage
);

router.put(
  "/updateReport/:id",
  authMiddleWare.adminAuthentication,
  upload.single("final_report_file"),
  sendMessageController.updateReport
);

router.put(
  "/updateSendMessageStatus/:id",
  authMiddleWare.adminAuthentication,
  sendMessageController.updateSendMessageStatus
);
//SendMessage

router.post(
  "/dashboardCount",
  authMiddleWare.adminAuthentication,
  userController.getDashboardCount
);
router.post(
  "/userDashboardCount",
  authMiddleWare.authenticateToken,
  userController.getuserDashboardCount
);
//Notes
router.post(
  "/getNotes",
  authMiddleWare.adminAuthentication,
  notesController.getNotes
);
router.post(
  "/addNotes",
  authMiddleWare.adminAuthentication,
  notesController.addNotes
);
router.put(
  "/updateNotes/:id",
  authMiddleWare.adminAuthentication,
  notesController.editNotes
);
router.delete(
  "/deleteNotes/:id",
  authMiddleWare.adminAuthentication,
  notesController.deleteNotes
);
//public
router.post(
  "/getAllNotes",
  // authMiddleWare.adminAuthentication,
  notesController.getAllNotes
);
//Notes

//Slider
router.get(
  "/getWebsiteInfo",
  // authMiddleWare.adminAuthentication,
  websiteInfo.getWebsiteInfo
);
router.post(
  "/addUpdateWebsiteInfo",
  authMiddleWare.adminAuthentication,
  // upload.single("image"),
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "favicon_icon",
      maxCount: 1,
    },
  ]),
  websiteInfo.addUpdateWebsiteInfo
);
//slider

//Balance
router.post(
  "/addBalance",
  authMiddleWare.adminAuthentication,
  userController.addBalance
);

router.post(
  "/addUserBalance",
  authMiddleWare.authenticateToken,
  userController.addUserBalance
);
router.post(
  "/getTransactionAll",
  authMiddleWare.adminAuthentication,
  userController.getTransactionAll
);
router.post(
  "/getuserTransaction",
  authMiddleWare.authenticateToken,
  userController.getUserTransaction
);

router.delete(
  "/deleteTransaction/:id",
  authMiddleWare.adminAuthentication,
  userController.deleteTransaction
);
//Balance

//getAllWhiteList
router.post(
  "/getAllWhiteList",
  authMiddleWare.adminAuthentication,
  whiteListController.getAllWhiteList
);

router.post(
  "/addWhiteList",
  authMiddleWare.adminAuthentication,
  whiteListController.addWhiteList
);

router.delete(
  "/deleteWhiteList/:id",
  authMiddleWare.adminAuthentication,
  whiteListController.deleteWhiteList
);

//supportController
router.post(
  "/getSupport",
  authMiddleWare.adminAuthentication,
  supportController.getSupport
);
router.post(
  "/addSupport",
  authMiddleWare.authenticateToken,
  supportController.addSupport
);

router.post(
  "/getAllSupport",
  authMiddleWare.authenticateToken,
  supportController.getAllSupport
);

router.delete(
  "/deleteSupport/:id",
  authMiddleWare.authenticateToken,
  supportController.deleteSupport
);
//public
router.post(
  "/getAllNotes",
  authMiddleWare.authenticateToken,
  supportController.getAllSupport
);
//supportController

//contactGroup

router.post(
  "/getAllContactGroup",
  authMiddleWare.authenticateToken,
  contactGroupController.getAllContactGroup
);

router.post(
  "/addContactGroup",
  authMiddleWare.authenticateToken,
  contactGroupController.addContactGroup
);

router.delete(
  "/deleteContactGroup/:id",
  authMiddleWare.authenticateToken,
  contactGroupController.deleteContactGroup
);

router.put(
  "/updateContactGroup/:id",
  authMiddleWare.adminAuthentication,
  contactGroupController.updateContactGroup
);

//contactGroup

module.exports = router;
