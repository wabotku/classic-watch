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

router.get(
  "/",
  controllers.usersBackendController.findAll
);

router.post(
  "/create",
  controllers.usersBackendController.create
);

router.post(
  "/update/:id",
  controllers.usersBackendController.update
);

router.post(
  "/delete/:id",
  controllers.usersBackendController.delete
);

router.get(
  "/roles",
  controllers.usersBackendController.findAll
);

router.post(
  "/roles/create",
  controllers.usersBackendController.rolesCreate
);

router.post(
  "/roles/update/:id",
  controllers.usersBackendController.rolesUpdate
);

router.post(
  "/roles/delete/:id",
  controllers.usersBackendController.rolesDelete
);

module.exports = router;
