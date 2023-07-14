const { Op, QueryTypes } = require("../models/merchant/init-models").Sequelize;
const sequelize = require("../models/merchant/init-models").sequelize;
const { merchant, search } = require("../models/merchant/init-models");
const generalResp = require("../utilities/httpResp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../utilities/middleware");
const { v4: uuidv4 } = require("uuid");

exports.getMerchant = async (req, res, next) => {
  let result;
  try {
    let data = await search.merchant(merchant, req.body);

    result = {
      rc: generalResp.HTTP_OK,
      rd: "Sukses",
      data: data,
    };
    res.locals.response = JSON.stringify(result);
    next();
  } catch (error) {
    console.error(error);
    next();
  }
};

exports.merchantCreate = async (req, res, next) => {
  let result;
  try {
    let getData = await sequelize.query(
      `insert into cw_m_merchant (uuid, nama, deskripsi) values (:uuid, :nama, :deskripsi)`,
      {
        replacements: {
          uuid: uuidv4(),
          nama: `${req.body.nama}`,
          deskripsi: `${req.body.deskripsi}`,
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

exports.merchantUpdate = async (req, res, next) => {
  let result;
  try {
    let getData = await merchant.findOne({
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
    console.log(req.params.id);
    let updateData = await merchant.update(
      { nama: req.body.nama, deskripsi: req.body.deskripsi },
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
      rd: "Update Error",
      data: error.errors,
    };
    res.locals.response = JSON.stringify(result);
    console.error(error);
  }
  next();
};

exports.merchantDelete = async (req, res, next) => {
  let result;
  try {
    let getData = await merchant.findOne({
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

    let updateData = await merchant.update(
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
