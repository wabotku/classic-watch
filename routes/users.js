const User = require("../controllers/usersController");
const router = require("express").Router();

router.post("/", User.findAll);

router.post("/verify-data", User.checkDuplicateUserNameOrEmail);

router.post("/signin", User.signin);


module.exports = router;
