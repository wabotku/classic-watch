const { Op, QueryTypes } = require("../models/init-models").Sequelize;
const sequelize = require("../models/init-models").sequelize;
const UserBE = require("../models/init-models").users_backend;
const generalResp = require("../utilities/httpResp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../utilities/middleware");

exports.migrate = async (req, res, next) => {
  await User.sync();
  next();
};

exports.checkDuplicateUserNameOrEmail = async (req, res, next) => {
  let result;

  try {
    let getData = await sequelize.query(
      `select (username = :search_username) as is_valid_username , (email = :search_email) as is_valid_email from users where username = :search_username or email = :search_email limit 1`,
      {
        replacements: {
          search_username: `${req.body.username}`,
          search_email: `${req.body.email}`,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (getData[0]) {
      let text;
      if (getData[0].is_valid_username == 1 && getData[0].is_valid_email == 1) {
        text = "Username dan Email sudah terpakai";
      } else {
        text = `${
          getData[0].is_valid_username == 1 ? "Username" : "Email"
        } sudah terpakai`;
      }
      result = {
        rc: generalResp.HTTP_BADREQUEST,
        rd: text,
        data: {},
      };
      res.locals.status = generalResp.HTTP_BADREQUEST;
      res.locals.response = JSON.stringify(result);

      return next();
    }

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Email dan Username tersedia",
      data: {
        auth: true,
        email: req.body.email,
        username: req.body.username,
      },
    };
    res.locals.response = JSON.stringify(result);
    next();
  } catch (error) {
    result = {
      rc: generalResp.HTTP_GENERALERROR,
      rd: "FAILED",
      data: {
        message: error.message || "Some error occurred while retrieving users.",
      },
    };
    res.locals.status = generalResp.HTTP_GENERALERROR;
    res.locals.response = JSON.stringify(result);
  }

  next();
};

exports.signin = async (req, res, next) => {

  let result;
    console.log('kvbfkdfgsdf');
    console.log(req.body);
    try {
    let getData = await UserBE.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!getData) {
      result = {
        rc: generalResp.HTTP_BADREQUEST,
        rd: "User tidak ditemukan!",
        data: {},
      };
      res.locals.status = generalResp.HTTP_BADREQUEST;
      res.locals.response = JSON.stringify(result);

      return next();
    }
    // var hashedPassword = bcrypt.hashSync(getData.password, 10);
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      getData.password
    );

    if (!passwordIsValid) {
      result = {
        rc: generalResp.HTTP_BADREQUEST,
        rd: "Password salah!",
        data: {},
      };
      res.locals.status = generalResp.HTTP_BADREQUEST;
      res.locals.response = JSON.stringify(result);

      return next();
    }

    var param = {
      id: getData.id,
      username: getData.username,
      email: getData.email,
      roles: getData.privilege,
    };

    var refreshToken = getData.refreshToken;

    jwt.verify(getData.refreshToken, process.env.secret, (err, decoded) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          refreshToken = jwt.sign(param, process.env.secret, {
            expiresIn: "24h",
          });
        } else {
          return res.status(500).send({
            auth: false,
            message: "Error",
            errors: err,
          });
        }
      }
    });

    var jwtToken = jwt.sign(param, process.env.secret, {
      expiresIn: "1h", //24h expired
    });

    await getData.update({ refreshToken: refreshToken });

    param = {
      token: jwtToken,
      refreshToken: refreshToken,
    };

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Login Sukses",
      data: param,
    };
    res.locals.response = JSON.stringify(result);

    next();
  } catch (error) {
    console.error(error);
    next();
  }
};

exports.refresh = async (req, res, next) => {
  // Verifying refresh token
  const refreshToken = req.headers.authorization;
  let token = refreshToken.split(" ")[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      // Wrong Refesh Token
      return res.status(406).json({ message: "Unauthorized" });
    } else {
      console.log(decoded);
      // Correct token we send a new access token
      const accessToken = jwt.sign(
        {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          roles: decoded.roles,
        },
        process.env.SECRET,
        {
          expiresIn: "1h",
        }
      );
      result = {
        rc: generalResp.HTTP_OK,
        rd: "Refresh Token Sukses",
        data: { refreshToken: accessToken },
      };
      res.locals.response = JSON.stringify(result);
    }
  });

  next();
};

exports.create = async (req, res, next) => {
  // Verifying refresh token
  const refreshToken = req.headers.authorization;
  let token = refreshToken.split(" ")[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      // Wrong Refesh Token
      return res.status(406).json({ message: "Unauthorized" });
    } else {
      console.log(decoded);
      // Correct token we send a new access token
      const accessToken = jwt.sign(
        {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          roles: decoded.roles,
        },
        process.env.SECRET,
        {
          expiresIn: "1h",
        }
      );
      result = {
        rc: generalResp.HTTP_OK,
        rd: "Refresh Token Sukses",
        data: { refreshToken: accessToken },
      };
      res.locals.response = JSON.stringify(result);
    }
  });

  next();
};
