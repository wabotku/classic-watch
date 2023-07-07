const model = require("./models/init-models");

module.exports = async function () {
  await model.users.sync();
  // for(var key in model.sequelize.models){
  //   await model.`${key}`.sync();
  // }
};
