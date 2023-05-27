const logger = require("../utilities/logger");
const { v4: uuidv4 } = require('uuid')

async function printForwardRequestResponse(req, res, next) {
  res.set("Content-Type", "application/json");
  const { response, status } = res.locals;

  res.status(status || 200);
  res.send(response);

  next();
}

async function recordHit(req, res, next) {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const mid = uuidv4()

  res.locals.mid = mid
  res.locals.clientIp = clientIp

  logger.http(req.originalUrl, {
    service: 'USER API',
    mid,
    ip: clientIp || '',
  })

  next()
}

module.exports = {
  printForwardRequestResponse,
  recordHit
};
