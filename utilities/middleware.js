const logger = require("../utilities/logger");
const { v4: uuidv4 } = require("uuid");
const { Validator } = require("node-input-validator");
const generalResp = require("../utilities/httpResp");

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
  const { user } = res.locals.oauth.token;
  if (typeof user === "object") {
    if (
      user.grants === "password" &&
      (user.detail.email === req.input.email ||
        user.detail.username == req.input.username ||
        user.detail.id == req.input.id_user ||
        user.detail.id == req.params.id_user ||
        constant.AVAILABLE_PATH.indexOf(req.originalUrl.replace(/\?.*/, "")) >
          -1)
    ) {
      // logger.debug('Grant Password OK')
      next();
    } else if (
      user.grants === "client_credentials" &&
      constant.ALLOW_CLIENT_CREDENTIAL.indexOf(
        req.originalUrl.replace(/\d+|\?.*/gm, "")
      ) > -1
    ) {
      // logger.debug('Grant CC OK')
      next();
    } else {
      logger.info("Invalid Grants #1");
      res.status(generalResp.HTTP_BADREQUEST);
      res.send({
        error: "invalid_grants",
        error_description: "Invalid grant: access is invalid #2",
      });
    }
  } else {
    logger.info("Invali Grants #1");
    res.status(generalResp.HTTP_BADREQUEST);
    res.send({
      error: "invalid_grants",
      error_description: "Invalid grant: access is invalid #1",
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

  if (req.originalUrl === "/user/sign-in") {
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
  const result = {}
  result.status = generalResp.HTTP_UNAUTHORIZED
  result.rc = generalResp.HTTP_UNAUTHORIZED
  result.rd = 'Invalid Token'
  const authUser = req.headers.authorization.replace('Bearer ', '')

  const check = await model.checkToken(authUser)

  if (check !== undefined) {
    result.status = generalResp.HTTP_OK
    result.rc = generalResp.HTTP_OK
    result.rd = 'Valid Token'
  }

  res.status(result.status).send(result)
}

module.exports = {
  printForwardRequestResponse,
  recordHit,
  checkGrants,
  getUserInfo,
  checkValidToken,
};
