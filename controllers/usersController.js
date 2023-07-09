const { Op, QueryTypes } = require("../models/init-models").Sequelize;
const sequelize = require("../models/init-models").sequelize;
const User = require("../models/init-models").users;
const generalResp = require("../utilities/httpResp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../utilities/middleware");

exports.migrate = async (req, res, next) => {
  await User.sync();
  next();
};

exports.findAll = async (req, res, next) => {
  let result;
  try {
    console.log("asdasd");
    let data = await User.findAll();
    console.log("cvx");
    result = {
      message: "users retrieved successfully.",
      data: data,
    };
    res.locals.response = JSON.stringify(result);
  } catch (error) {
    result = {
      message: error.message || "Some error occurred while retrieving users.",
      data: null,
    };
    res.locals.status = 500;
    res.locals.response = JSON.stringify(result);
  }

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
  try {
    let getData = await User.findOne({
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

    if (getData.token) {
      // console.log("masuk");
    }

    // generate token
    var jwtToken = jwt.sign(param, process.env.secret, {
      expiresIn: "15m", //24h expired
    });

    const refreshToken = jwt.sign(param, process.env.secret, {
      expiresIn: "1h",
    });

    // Assigning refresh token in http-only cookie
    // res.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

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
  if (req.headers.cookie) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.headers.cookies;

    console.log(refreshToken);

    next();
    // Verifying refresh token
    // jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
    //   if (err) {
    //     // Wrong Refesh Token
    //     return res.status(406).json({ message: "Unauthorized" });
    //   } else {
    //     // Correct token we send a new access token
    //     const accessToken = jwt.sign(
    //       {
    //         username: userCredentials.username,
    //         email: userCredentials.email,
    //       },
    //       process.env.SECRET,
    //       {
    //         expiresIn: "10m",
    //       }
    //     );
    //     return res.json({ accessToken });
    //   }
    // });
  } else {
    // return res.status(406).json({ message: "Unauthorized" });
  }
  next();
};
