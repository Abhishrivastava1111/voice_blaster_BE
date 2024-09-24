const AWS = require("aws-sdk");
var multer = require("multer");
//var multerS3 = require("multer-s3");
const multerS3 = require("multer-s3-v2");

var path = require("path");
const constants = require("../config/constant");
const whitelist = constants.CONST_PROFILE_IMAGE_TYPE;
const whitelistVideo = constants.CONST_COMPANY_VIDEO;
const response = require("../config/response");
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (file.fieldname == 'profile') {
//             cb(null, './public/image/user');
//         } else if (file.fieldname == 'company_logo') {
//             cb(null, './public/image/company_logo');
//         } else if (file.fieldname == 'company_picture') {
//             cb(null, './public/image/company_picture');
//         }else if (file.fieldname == 'company_video') {
//             cb(null, './public/image/company_video');
//         }
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// })

/*var upload = multer({
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //     if (file.fieldname == 'company_video') {
    //         if (!whitelistVideo.includes(file.mimetype)) {
    //             // return response.returnFalse(req, req, 'File not allowed');
    //             // return cb(new Error('file is not allowed'))
    //         }
    //     } else {
    //         if (!whitelist.includes(file.mimetype)) {
    //             return response.returnFalse(req, req, 'File not allowed');
    //             // return cb(new Error('file is not allowed'));
    //         }
    //     }
    //     cb(null, true)
    // }
});*/

const config = {
  Bucket: constants.AWS_BUCKET_NAME,
  //dirName: "test",
  region: constants.AWS_REGION,
  accessKeyId: constants.AWS_ACCESS_KEY_ID,
  secretAccessKey: constants.AWS_SECRET_ACCESS_KEY,
  //endPoint: "arn:aws:s3:::giftmegrid",
};

let s3bucket = new AWS.S3(config);

var upload = multer({
  storage: multerS3({
    s3: s3bucket,
    bucket: constants.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
         if (file.fieldname == 'profile') {
            cb(null, 'user/'+file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        } else if (file.fieldname == 'company_logo') {
            cb(null, 'company_logo/'+file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        } else if (file.fieldname == 'company_picture') {
            cb(null, 'company_picture/'+file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }else if (file.fieldname == 'company_video') {
            cb(null, 'company_video/'+file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
        else if (file.fieldname == 'school_logo') {
            cb(null, 'school_logo/'+file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
        else if (file.fieldname == 'jobs_resume') {
            cb(null, 'job_resume/'+file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
        else{
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    },
  }),
  // SET DEFAULT FILE SIZE UPLOAD LIMIT
 /* limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
  fileFilter: function(req, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (mimetype && extname) {
          return cb(null, true);
      } else {
          cb("Error: Allow images only of extensions jpeg|jpg|png !");
      }
  }*/
});

module.exports = upload;
