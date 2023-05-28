require("./kickstart");
const express = require("express");
const cors = require("cors");
const logger = require("./utilities/logger");
const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;
const users = require("./routes/users");
const middleware = require("./utilities/middleware");

// console.log(JSON.parse(process.env.ROLES))
logger.verbose("==================KICK START==================");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/users",
  users,
  middleware.recordHit,
  middleware.printForwardRequestResponse
);

app.listen(port, () => {
  logger.verbose(`Classic Watch User API listening at http://${host}:${port}`);
  logger.verbose("===================KICK END===================");
});
