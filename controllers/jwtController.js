const jwt = require("jsonwebtoken");
const { Validator } = require("node-input-validator");
const generalResp = require("../utilities/httpResp");
const { v4: uuidv4 } = require("uuid");

exports.verifyToken = async (req, res, next) => {
  let tokenHeader = req.headers.authorization;

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
    req.userId = decoded.id;
    next();
  });
};

exports.generateToken = async (req, res, next) => {
  const v = new Validator(req.body, {
    client: "required|string",
  });

  const matched = await v.check();
  if (!matched) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Periksa kembali inputan anda!",
      data: {},
    };
    res.locals.status = generalResp.HTTP_BADREQUEST;
    res.locals.response = JSON.stringify(result);

    return next();
  }
  const mid = uuidv4();
  try {
    var param = {
      uuid: mid,
      client: req.body.client,
    };

    // // generate token
    var jwtToken = jwt.sign(param, process.env.secret, {});

    param = {
      token: jwtToken,
    };

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Generate Sukses",
      data: param,
    };
    console.log(result)
    res.locals.response = JSON.stringify(result);
    return next();
  } catch (error) {}

  next();
};
