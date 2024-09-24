var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const constant = require("../config/constant");

var transport = nodemailer.createTransport(
    smtpTransport({
        host: constant.SMTP_HOST,
        port: constant.SMTP_PORT,
        secure: true,
        auth: {
            user: constant.SMTP_USERNAME,
            pass: constant.SMTP_PASSWORD,
        },
    })
);

const mail = (email, subject, message) => {
    var mailOptions = {
        from: constant.MAIL_SEND_FROM,
        to: email,
        subject,
        //text: message,
        html: message,
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error);

        return info;
    });
};

module.exports = mail;
