require('dotenv').config();
module.exports = Object.freeze({

    CONST_APP_NAME: process.env.APP_NAME,
    CONST_APP_URL: process.env.APP_URL,
    CONST_IMAGE_USER: 'public/image/user/',
    CONST_IMAGE_COMPANY_LOGO: 'public/image/company_logo/',
    CONST_IMAGE_COMPANY_VIDEO: 'public/image/company_video/',
    CONST_IMAGE_COMPANY_PICTURE: 'public/image/company_picture/',
    CONST_IMAGE_IMAGE_FILE_SIZE: 'dimensions:minWidth=50,minHeight=50',
    CONST_IMAGE_FILE_MIME_TYPE: 'jpg,jpeg,png',
    // Database constant
    CONST_DB_STATUS_ACTIVE: 'Active',
    CONST_DB_STATUS_INACTIVE: 'Inactive',
    CONST_DB_STATUS_BLOCK: 'Blocked',
    CONST_DB_STATUS_SOFT_DELETE: 'Deleted',
    CONST_DB_STATUS_CANCEL: "Cancel",

    // Currency constant
    CONST_CURRENCY: "usd",

    //Paymet constant
    CONST_SETUP_PAYMENT_DESCRIPTION:"Payment for setup",
    CONST_ONE_TIME_PAYMENT_DESCRIPTION:"Payment for interview",

    // Major option content
    CONST_MAJOR_CONTENT: [
        {_id: 'yes', name: 'Yes'},
        {_id: 'no', name: 'No'}
    ],

    // Validation constant
    CONST_VALIDATE_SESSION_EXPIRE: '24h',

    //OTP
    DEFAULT_OTP: '1234',

    // User role
    CONST_USER_ROLE_STUDENT: 1,
    CONST_USER_ROLE_EMPLOYER: 2,
    CONST_USER_ROLE_ADMIN: 3,
    CONST_USER_ROLE_SUB_ADMIN: 4,

    // User status verified
    CONST_USER_VERIFIED_FALSE: false,
    CONST_USER_VERIFIED_TRUE: true,

    // Max year bellow current year
    CONST_GRADUATION_START_YEAR: 30,

    // Const request limit
    CONST_REQUEST_LIMIT: '150mb',

    // Profile Image file type
    CONST_PROFILE_IMAGE_UPLOAD: 1,

    // Profile Image file type validation
    CONST_PROFILE_IMAGE_TYPE: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp'
    ],

    CONST_COMPANY_VIDEO: [
        'video/mp4'
    ],

    CONST_GENDER_MALE: 'male',
    CONST_GENDER_FEMALE: 'female',
    CONST_GENDER_OTHER: 'other',

    // Job status
    CONST_JOB_STATUS_DRAFT: 1,
    CONST_JOB_STATUS_ACTIVE: 2,
    CONST_JOB_STATUS_FINISHED: 3,

    // Job Type
    CONST_JOB_TYPE_IN_HOUSE: 1,
    CONST_JOB_TYPE_EXTERNAL: 2,

    // Job Paid Type
    CONST_JOB_TYPE_PAID: "Paid",
    CONST_JOB_TYPE_FREE: "Unpaid",

    // Job Section Type
    CONST_JOB_SECTION_OFFICE: "No",
    CONST_JOB_SECTION_REMOTE: "Yes",

    // Send Email Constant
    SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT,
	SMTP_USERNAME: process.env.SMTP_USERNAME,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,
	MAIL_SEND_FROM: process.env.MAIL_SEND_FROM,

    // AWS S3 Configuration
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
	AWS_REGION: process.env.AWS_REGION,
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    // PAgination
    PAGINATION_LIMIT: process.env.PAGINATION_LIMIT,

    //Notification Msg and tittle
    CONST_PAYMENT_STATUS:"Payment Staus",
    CONST_SETUP_PAYMENT_BODY:"Your verification cost payment has been successfully processed. You're now verified and ready to enjoy our service.",
    CONST_PURCHASE_PLAN_BODY:"Your subscription is confirmed! Get ready to enjoy all the benefits of your new plan.",
    CONST_PURCHASE_INTERVIEW_BODY:"Your payment is confirmed! Get ready to enjoy all the benefits."
});