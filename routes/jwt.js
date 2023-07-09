const router = require('express').Router()
const controllers = require("../controllers/index");

router.post("/generate-token", controllers.jwtController.generateToken);

module.exports = router