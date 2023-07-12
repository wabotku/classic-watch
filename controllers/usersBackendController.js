const { Op, QueryTypes } = require("../models/users/init-models").Sequelize;
const sequelize = require("../models/users/init-models").sequelize;
const UserBE = require("../models/users/init-models").users_backend;
const Roles = require("../models/users/init-models").roles;
const generalResp = require("../utilities/httpResp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../utilities/middleware");
const { v4: uuidv4 } = require("uuid");

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

exports.findAll = async (req, res, next) => {
  let result;
  try {
    let getData = await Roles.findAll({
      where: {
        isActive: 1,
      },
    });

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Sukses",
      data: getData,
    };
    res.locals.response = JSON.stringify(result);
    next();
  } catch (error) {
    console.error(error);
    next();
  }
};

exports.create = async (req, res, next) => {
  // Verifying refresh token
  let result;
  var hashedPassword = bcrypt.hashSync(req.body.password, 10);
  var param = {
    username: req.body.username,
    email: req.body.email,
    roles: req.body.role,
  };

  var refreshToken = jwt.sign(param, process.env.secret, {
    expiresIn: "24h",
  });
  try {
    let insertData = await sequelize.query(
      `insert into users_backend (username,name, password, email, phone, privilege, refreshToken) values (:username, :name, :password, :email, :phone, :privilege, :refreshToken)`,
      {
        replacements: {
          uuid: uuidv4(),
          username: `${req.body.username}`,
          name: `${req.body.name}`,
          password: `${hashedPassword}`,
          email: `${req.body.email}`,
          phone: `${req.body.phone}`,
          privilege: `${req.body.role}`,
          refreshToken: `${refreshToken}`,
        },
        type: QueryTypes.INSERT,
      }
    );

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Create Sukses",
      data: 1,
    };
    res.locals.response = JSON.stringify(result);
  } catch (error) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Create Gagal",
      data: error.errors,
    };
    res.locals.response = JSON.stringify(result);
  }

  next();
};

exports.update = async (req, res, next) => {
  let result;
  try {
    let getData = await Roles.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!getData) {
      result = {
        rc: generalResp.HTTP_BADREQUEST,
        rd: "Data tidak ditemukan!",
        data: {},
      };
      res.locals.status = generalResp.HTTP_BADREQUEST;
      res.locals.response = JSON.stringify(result);

      return next();
    }

    let updateData = await Roles.update(
      { deskripsiPrivilege: req.body.deskripsiPrivilege },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Update Sukses",
      data: updateData[0],
    };
    res.locals.response = JSON.stringify(result);
  } catch (error) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Create Error",
      data: error.errors,
    };
    res.locals.response = JSON.stringify(result);
    console.error(error);
  }
  next();
};

exports.delete = async (req, res, next) => {
  let result;
  try {
    let getData = await Roles.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!getData) {
      result = {
        rc: generalResp.HTTP_BADREQUEST,
        rd: "Data tidak ditemukan!",
        data: {},
      };
      res.locals.status = generalResp.HTTP_BADREQUEST;
      res.locals.response = JSON.stringify(result);

      return next();
    }

    let updateData = await Roles.update(
      { isActive: 0 },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Delete Sukses",
      data: 1,
    };
    res.locals.response = JSON.stringify(result);
  } catch (error) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Delete Error",
      data: error.errors,
    };
    res.locals.response = JSON.stringify(result);
    console.error(error);
  }
  next();
};

exports.findAll = async (req, res, next) => {
  let result;
  try {
    let getData = await Roles.findAll({
      where: {
        isActive: 1,
      },
    });

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Login Sukses",
      data: getData,
    };
    res.locals.response = JSON.stringify(result);
    next();
  } catch (error) {
    console.error(error);
    next();
  }
};

exports.rolesCreate = async (req, res, next) => {
  let result;
  try {
    let getData = await sequelize.query(
      `insert into roles (uuid, deskripsiPrivilege) values (:uuid, :deskripsiPrivilege)`,
      {
        replacements: {
          uuid: uuidv4(),
          deskripsiPrivilege: `${req.body.deskripsiPrivilege}`,
        },
        type: QueryTypes.INSERT,
      }
    );

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Create Sukses",
      data: 1,
    };
    res.locals.response = JSON.stringify(result);
  } catch (error) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Create Error",
      data: error.errors,
    };
    res.locals.response = JSON.stringify(result);
    console.error(error);
  }
  next();
};

exports.rolesUpdate = async (req, res, next) => {
  let result;
  try {
    let getData = await Roles.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!getData) {
      result = {
        rc: generalResp.HTTP_BADREQUEST,
        rd: "Data tidak ditemukan!",
        data: {},
      };
      res.locals.status = generalResp.HTTP_BADREQUEST;
      res.locals.response = JSON.stringify(result);

      return next();
    }

    let updateData = await Roles.update(
      { deskripsiPrivilege: req.body.deskripsiPrivilege },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Create Sukses",
      data: updateData[0],
    };
    res.locals.response = JSON.stringify(result);
  } catch (error) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Create Error",
      data: error.errors,
    };
    res.locals.response = JSON.stringify(result);
    console.error(error);
  }
  next();
};

exports.rolesDelete = async (req, res, next) => {
  let result;
  try {
    let getData = await Roles.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!getData) {
      result = {
        rc: generalResp.HTTP_BADREQUEST,
        rd: "Data tidak ditemukan!",
        data: {},
      };
      res.locals.status = generalResp.HTTP_BADREQUEST;
      res.locals.response = JSON.stringify(result);

      return next();
    }

    let updateData = await Roles.update(
      { isActive: 0 },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Delete Sukses",
      data: 1,
    };
    res.locals.response = JSON.stringify(result);
  } catch (error) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Delete Error",
      data: error.errors,
    };
    res.locals.response = JSON.stringify(result);
    console.error(error);
  }
  next();
};
