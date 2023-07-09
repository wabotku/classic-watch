const router = require("express").Router();
const controllers = require("../controllers/index");
const middleware = require("../utilities/middleware");

// router.post("/", controllers.usersBackendController.findAll);

router.post(
  "/verify-data",
  controllers.usersBackendController.checkDuplicateUserNameOrEmail
);

router.post(
  "/signin",
  [middleware.getUserInfo],
  controllers.usersBackendController.signin
);

router.post(
  "/refresh",
  [controllers.jwtController.verifyToken],
  controllers.usersBackendController.refresh
);

module.exports = router;
