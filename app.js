
require("dotenv/config");
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const constants = require("./config/constant");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: constants.CONST_REQUEST_LIMIT,
  })
);
app.use(bodyParser.raw({ limit: constants.CONST_REQUEST_LIMIT }));



const Message = require("./models/Message");


//login with linkedin
const session = require("express-session");
// const passport = require("passport");
// const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const config = require("./config/config");
//login with linkedin

const { API_PORT } = process.env;
const path = require("path");
/* language */
const i18n = require("./middleware/i18n");
// i18n init
app.use(i18n.init);
/*language end*/

//chat start
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
/* 29 March RB  start */

// var whitelist = ['https://admin.photoframewala.com', 'https://photoframewala.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Allow-Origin', 'photoframewala.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


/* 29 Mach RB end */

TZ = "Asia/Calcutta";
// console.log(new Date().toString());

// app.use(express.static(path.resolve("./public")));
// app.use("/public", express.static(path.resolve("./public")));

app.use(express.static(path.resolve("./images")));
app.use("/images", express.static(path.resolve("./images")));

app.use(express.static(path.resolve("./audio_files")));
app.use("/audio_files" , express.static(path.resolve("./audio_files")));

// Student Routers
const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute);

// common Routers
const commonRoute = require("./routes/common");
app.use("/", commonRoute);

// auth Routers
const authRoute = require("./routes/auth");
app.use("/auth", authRoute);

// Employee Routes
// const employeeRouter = require("./routes/employers");
// app.use("/employer", employeeRouter);

// Content Routers
// const contentRouter = require("./routes/contents");
// app.use("/", contentRouter);



// Auth Routers
// const authRouter = require("./routes/auth");
// app.use("/", authRouter);

app.get("/", (req, res) => {
  res.status(500).send("500 Server Error");
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.type("text/plain");
  res.status(500);
  res.send("500 Server Error");
});


app.listen(API_PORT, () => {
  // chatController.addSocketId()
  console.log(`Running on port ${API_PORT}`);
});
