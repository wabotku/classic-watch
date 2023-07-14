const logger = require("../utilities/logger");
const { v4: uuidv4 } = require("uuid");
const { Validator } = require("node-input-validator");
const generalResp = require("../utilities/httpResp");
const jwt = require("jsonwebtoken");
const constant = require("./constant");

async function printForwardRequestResponse(req, res, next) {
  res.set("Content-Type", "application/json");
  const { response, status } = res.locals;

  res.status(status || 200);
  res.send(response);

  next();
}

async function recordHit(req, res, next) {
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const mid = uuidv4();

  res.locals.mid = mid;
  res.locals.clientIp = clientIp;

  logger.http(req.originalUrl, {
    service: "USER API",
    mid,
    ip: clientIp || "",
  });

  next();
}

async function checkGrants(req, res, next) {
  let result = {
    rc: generalResp.HTTP_BADREQUEST,
    rd: "Invalid grant: access is invalid",
    data: {},
  };

  if (req.originalUrl === "/users-backend/signin") {
    return next();
  } else {
    let tokenHeader = req.headers.authorization;
    if (typeof tokenHeader !== "undefined") {
      if (tokenHeader.split(" ")[0] !== "Bearer") {
        return res.status(500).send({
          auth: false,
          message: "Error",
          errors: "Incorrect token format",
        });
      }

      let token = tokenHeader.split(" ")[1];
      if (!token) {
        return res.status(403).send({
          auth: false,
          message: "Error",
          errors: "No token provided",
        });
      }

      jwt.verify(token, process.env.secret, (err, decoded) => {
        if (err) {
          return res.status(500).send({
            auth: false,
            message: "Error",
            errors: err,
          });
        }
        req.privilege = decoded.roles;
      });

      if (
        req.privilege === "AS_SUPERADMIN" &&
        constant.ALLOW_CLIENT_CREDENTIAL.indexOf(
          req.originalUrl.replace(/\d+|\?.*/gm, "")
        ) > -1
      ) {
        return next();
      }
    }

    logger.info("Invalid Grants #1");
    res.status(generalResp.HTTP_BADREQUEST);
    res.send({
      error: "invalid_grants",
      error_description: "Invalid grant: access is invalid #2",
    });
  }
}

async function getUserInfo(req, res, next) {
  logger.debug(`Check Payload User Info`);

  result = {
    rc: generalResp.HTTP_UNAUTHORIZED,
    rd: "Autentifikasi tidak ditemukan, Silahkan Login",
    data: "",
  };
  res.locals.response = JSON.stringify(result);
  const checker = {
    username: "required",
    password: "required",
  };

  if (req.originalUrl === "/user/signin") {
    checker.username = "username";
    checker.password = "string|numeric|maxLength:15";
  }

  const v = new Validator(req.body, checker);
  const match = await v.check();

  if (!match) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Permintaan tidak dapat diproses",
      data: "",
    };
    res.locals.response = JSON.stringify(result);

    logger.error(v.errors);
  }

  next();
}

async function checkValidToken(req, res, next) {
  const result = {};
  result.status = generalResp.HTTP_UNAUTHORIZED;
  result.rc = generalResp.HTTP_UNAUTHORIZED;
  result.rd = "Invalid Token";
  const authUser = req.headers.authorization.replace("Bearer ", "");

  const check = await model.checkToken(authUser);

  if (check !== undefined) {
    result.status = generalResp.HTTP_OK;
    result.rc = generalResp.HTTP_OK;
    result.rd = "Valid Token";
  }

  res.status(result.status).send(result);
}

module.exports = {
  printForwardRequestResponse,
  recordHit,
  checkGrants,
  getUserInfo,
  checkValidToken,
};
