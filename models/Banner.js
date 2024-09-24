const mongoose = require('mongoose');
const constants = require('../config/constant');
// var AutoIncrement = require('mongoose-sequence')(mongoose);

const bannerSchema = mongoose.Schema({
    sideBanner1: { 
        type: String,
        default : ""
    },
    sideBanner2: { 
        type: String,
        default : ""
    },
    sideBannerUrl1: { 
        type: String,
        default:""
    },
    sideBannerUrl2: { 
        type: String,
        default:""
    },
    footerBanner: { 
        type: String,
        default:""
    },
    footerBannerUrl: { 
        type: String,
        default:""
    },   
    status: {
        type: String,
        enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE],
        default: constants.CONST_DB_STATUS_ACTIVE
    },
    createdAt: { type: Date, default: Date.now },
});

// WebsiteInfoSchema.plugin(AutoIncrement, {inc_field: 'bannerId'});
module.exports = mongoose.model('banner',bannerSchema);