const User = require("../controllers/usersController");
const Jwt = require("../controllers/jwtController");
const router = require("express").Router();

router.post("/", User.findAll);

router.post("/verify-data", User.checkDuplicateUserNameOrEmail);

router.post("/signin", [Jwt.verifyToken],User.signin);

module.exports = router;
