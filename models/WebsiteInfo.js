const mongoose = require('mongoose');
const constants = require('../config/constant');
// var AutoIncrement = require('mongoose-sequence')(mongoose);

const WebsiteInfoSchema = mongoose.Schema({
    // bannerId : {
    //     type: Number
    // },
    name: { 
        type: String,
       
        maxLength: 150 
    }, 
    logo: { 
        type: String,
        default : ""
    },
    email: { 
        type: String,
        default : ""
    },
    phone_no: { 
        type: String,
        default:""
    },
    address: { 
        type: String,
        default:""
    },
    title: { 
        type: String,
        default:""
    },
    description: { 
        type: String,
        default:""
    },
    keyword: { 
        type: String,
        default:""
    },
    announcement: { 
        type: String,
        default:""
    },

    about_us: { 
        type: String,
        default:""
    },
    facebook_url: { 
        type: String,
        default:""
    },
    instgram_url: { 
        type: String,
        default:""
    },
    youtube_url: { 
        type: String,
        default:""
    },
    twitter_url: { 
        type: String,
        default:""
    },
    google_url: { 
        type: String,
        default:""
    },
    logo: { 
        type: String,
        default:""
    },
    favicon_icon: { 
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
module.exports = mongoose.model('website_info', WebsiteInfoSchema);