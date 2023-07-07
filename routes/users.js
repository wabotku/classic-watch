const router = require('express').Router()
const controllers = require("../controllers/index");

router.post("/", controllers.usersController.findAll);

router.post("/verify-data", controllers.usersController.checkDuplicateUserNameOrEmail);

router.post("/signin", [controllers.jwtController.verifyToken], controllers.usersController.signin);


module.exports = router