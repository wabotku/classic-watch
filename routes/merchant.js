const router = require("express").Router();
const controllers = require("../controllers/index");
const middleware = require("../utilities/middleware");

// router.post("/", controllers.usersBackendController.findAll);
// >>>>>>>>>>>>>>>>>>>>>>>>>>> Merchant <<<<<<<<<<<<<<<<<<<<<<<<<<<
router.get(
  "/",
  controllers.merchantController.findAll
);

router.post(
  "/create",
  controllers.merchantController.merchantCreate
);

router.post(
  "/update/:id",
  controllers.merchantController.merchantUpdate
);

router.post(
  "/delete/:id",
  controllers.merchantController.merchantDelete
);

// >>>>>>>>>>>>>>>>>>>>>>>>>>> Product <<<<<<<<<<<<<<<<<<<<<<<<<<<

router.get(
  "/product",
  controllers.productController.findAll
);

router.post(
  "/product/create",
  controllers.productController.productCreate
);

router.post(
  "/product/update/:id",
  controllers.productController.productUpdate
);

router.post(
  "/product/delete/:id",
  controllers.productController.productDelete
);

// >>>>>>>>>>>>>>>>>>>>>>>>>>> Merk <<<<<<<<<<<<<<<<<<<<<<<<<<<

router.get(
  "/product/merk",
  controllers.merkController.findAll
);

router.post(
  "/product/merk/create",
  controllers.merkController.merkCreate
);

router.post(
  "/product/merk/update/:id",
  controllers.merkController.merkUpdate
);

router.post(
  "/product/merk/delete/:id",
  controllers.merkController.merkDelete
);

module.exports = router;
