const jwt = require("jsonwebtoken");
const response = require("./../config/response");
const config = process.env;
const helper = require("./../helper/hlp_common");
const User = require("./../models/User");
const constants = require("../config/constant");

module.exports = middlewares = {
  authenticateToken: async (req, res, next) => {
    try {
      // if (!req.headers["version"]) {
      //   return response.returnFalse(req, res, res.translate('version_not_exist'), {});
      // } else if (req.headers["version"] != config.APP_VERSION) {
      //   return response.returnFalse(req, res, res.translate('version_not_match'), {});
      // }

      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (!token) {
        return response.returnFalse(
          req,
          res,
          res.translate("token_required_for_auth"),
          {}
        );
      }

      try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        req.user = decoded;
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return response.returnFalse(
            req,
            res,
            res.translate("token_expired"),
            {},
            463
          ); // Return a custom error for expired token
        } else {
          return response.returnFalse(
            req,
            res,
            res.translate("invalid_token"),
            {},
            461
          ); // Invalid token
        }
      }

      return next();
    } catch (err) {
      return response.returnFalse(
        req,
        res,
        res.translate("validation_error_message"),
        { err }
      );
    }
  },
  employerAuthentication: async (req, res, next) => {
    try {
      if (!req.headers["version"]) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_exist"),
          {}
        );
      } else if (req.headers["version"] != config.APP_VERSION) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_match"),
          {}
        );
      }

      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (!token) {
        return response.returnFalse(
          req,
          res,
          res.translate("token_required_for_auth"),
          {}
        );
      }

      try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        const roleId = decoded.id;
        const user = await User.findById(roleId);
        if (user.role != constants.CONST_USER_ROLE_EMPLOYER) {
          let error_code = 461;
          return response.returnFalse(
            req,
            res,
            res.translate("invalid_token"),
            {},
            error_code
          );
        }
        req.user = decoded;
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return response.returnFalse(
            req,
            res,
            res.translate("token_expired"),
            {},
            463
          ); // Return a custom error for expired token
        } else {
          return response.returnFalse(
            req,
            res,
            res.translate("invalid_token"),
            {},
            461
          ); // Invalid token
        }
      }

      return next();
    } catch (err) {
      return response.returnFalse(
        req,
        res,
        res.translate("validation_error_message"),
        { err }
      );
    }
  },
  adminAuthentication: async (req, res, next) => {
    try {
      if (!req.headers["version"]) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_exist"),
          {}
        );
      } else if (req.headers["version"] != config.APP_VERSION) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_match"),
          {}
        );
      }

      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (!token) {
        return response.returnFalse(
          req,
          res,
          res.translate("token_required_for_auth"),
          {}
        );
      }

      try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        const roleId = decoded.id;
        const user = await User.findById(roleId);
        if (user.role != constants.CONST_USER_ROLE_ADMIN) {
          let error_code = 461;
          return response.returnFalse(
            req,
            res,
            res.translate("invalid_token"),
            {},
            error_code
          );
        }
        req.user = decoded;
      } catch (err) {
        debugger;
        console.log(err);
        
        if (err.name === "TokenExpiredError") {
          return response.returnFalse(
            req,
            res,
            res.translate("token_expired"),
            {},
            463
          ); // Return a custom error for expired token
        } else {
          return response.returnFalse(
            req,
            res,
            res.translate("invalid_token"),
            {},
            461
          ); // Invalid token
        }
      }

      return next();
    } catch (err) {
      return response.returnFalse(
        req,
        res,
        res.translate("validation_error_message"),
        { err }
      );
    }
  },
  studentAuthentication: async (req, res, next) => {
    try {
      if (!req.headers["version"]) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_exist"),
          {}
        );
      } else if (req.headers["version"] != config.APP_VERSION) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_match"),
          {}
        );
      }

      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (!token) {
        return response.returnFalse(
          req,
          res,
          res.translate("token_required_for_auth"),
          {}
        );
      }

      try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        const roleId = decoded.id;
        const user = await User.findById(roleId);
        if (user.role != constants.CONST_USER_ROLE_STUDENT) {
          let error_code = 461;
          return response.returnFalse(
            req,
            res,
            res.translate("invalid_token"),
            {},
            error_code
          );
        }
        req.user = decoded;
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return response.returnFalse(
            req,
            res,
            res.translate("token_expired"),
            {},
            463
          ); // Return a custom error for expired token
        } else {
          return response.returnFalse(
            req,
            res,
            res.translate("invalid_token"),
            {},
            461
          ); // Invalid token
        }
      }

      return next();
    } catch (err) {
      return response.returnFalse(
        req,
        res,
        res.translate("validation_error_message"),
        { err }
      );
    }
  },
  version: async (req, res, next) => {
    try {
      if (!req.headers["version"]) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_exist"),
          {}
        );
      } else if (req.headers["version"] != config.APP_VERSION) {
        return response.returnFalse(
          req,
          res,
          res.translate("version_not_match"),
          {}
        );
      }
      return next();
    } catch (e) {
      console.log(e);
      return response.returnFalse(
        req,
        res,
        res.translate("validation_error_message"),
        {}
      );
    }
  },
};
