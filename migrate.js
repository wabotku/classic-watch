const model = require("./models/init-models");

module.exports = async function () {
  await model.users.sync();
};
