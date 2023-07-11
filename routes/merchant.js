const router = require("express").Router();
const controllers = require("../controllers/index");
const middleware = require("../utilities/middleware");

// router.post("/", controllers.usersBackendController.findAll);

router.post(
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
