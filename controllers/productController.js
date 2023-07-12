const { Op, QueryTypes } = require("../models/merchant/init-models").Sequelize;
const sequelize = require("../models/merchant/init-models").sequelize;
const { product, merchant, merk } = require("../models/merchant/init-models");
const generalResp = require("../utilities/httpResp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../utilities/middleware");
const { v4: uuidv4 } = require("uuid");

exports.findAll = async (req, res, next) => {
  let result;
  try {
    let getData = await product.findAll({
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

// async function getMerkMerchant(req) {
//   const getMerchant = await merchant.findOne({
//     where: {
//       isActive: 1,
//       uuid: req.body.uuidMerchant,
//     },
//   });
//   return getMerchant;
//   if (getMerchant == null) {
//     result = {
//       rc: generalResp.HTTP_BADREQUEST,
//       rd: "Merchant Tidak Ditemukan",
//       data: {},
//     };
//     res.locals.response = JSON.stringify(result);
//     return next();
//   }
// }

exports.productCreate = async (req, res, next) => {
  let result;
  const getMerchant = await merchant.findOne({
    where: {
      isActive: 1,
      uuid: req.body.uuidMerchant,
    },
  });

  if (getMerchant == null) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Merchant Tidak Ditemukan",
      data: {},
    };
    res.locals.response = JSON.stringify(result);
    return next();
  }

  const getMerk = await merk.findOne({
    where: {
      isActive: 1,
      uuid: req.body.uuidMerk,
    },
  });

  if (getMerk == null) {
    result = {
      rc: generalResp.HTTP_BADREQUEST,
      rd: "Merk Tidak Ditemukan",
      data: {},
    };
    res.locals.response = JSON.stringify(result);
    return next();
  }

  try {
    let getData = await sequelize.query(
      `insert into cw_m_product (uuid, uuidMerchant, namaMerchant, nama, tahun, deskripsi, qty, uuidMerk, namaMerk, harga, sku, noSeri, kelengkapan) values (:uuid, :uuidMerchant, :namaMerchant,:nama, :tahun, :deskripsi,:qty, :uuidMerk, :namaMerk,:harga, :sku, :noSeri, :kelengkapan)`,
      {
        replacements: {
          uuid: uuidv4(),
          nama: `${req.body.nama}`,
          uuidMerchant: `${req.body.uuidMerchant}`,
          namaMerchant: `${getMerchant.nama}`,
          nama: `${req.body.nama}`,
          deskripsi: `${req.body.deskripsi}`,
          qty: `${req.body.qty}`,
          tahun: `${req.body.tahun}`,
          uuidMerk: `${req.body.uuidMerk}`,
          namaMerk: `${getMerk.nama}`,
          harga: `${req.body.harga}`,
          sku: `${req.body.sku}`,
          noSeri: `${req.body.noSeri}`,
          kelengkapan: `${req.body.kelengkapan}`,
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

exports.productUpdate = async (req, res, next) => {
  let result;
  try {
    let getData = await Product.findOne({
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
    let updateData = await Product.update(
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

exports.productDelete = async (req, res, next) => {
  let result;
  try {
    let getData = await Product.findOne({
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

    let updateData = await Product.update(
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
