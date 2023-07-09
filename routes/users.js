const router = require("express").Router();
const controllers = require("../controllers/index");
const middleware = require("../utilities/middleware");

router.post("/", controllers.usersController.findAll);

router.post(
  "/verify-data",
  controllers.usersController.checkDuplicateUserNameOrEmail
);

router.post(
  "/signin",
  [middleware.getUserInfo],
  controllers.usersController.signin
);

router.post("/refresh", controllers.usersController.refresh);

module.exports = router;
