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

async function checkGrants(req, res, next) {
  const { user } = res.locals.oauth.token
  if (typeof user === 'object') {
    if (
      user.grants === 'password' &&
      (user.detail.email === req.input.email ||
        user.detail.username == req.input.username ||
        user.detail.id == req.input.id_user ||
        user.detail.id == req.params.id_user ||
        constant.AVAILABLE_PATH.indexOf(req.originalUrl.replace(/\?.*/, '')) > -1)
    ) {
      // logger.debug('Grant Password OK')
      next()
    } else if (
      user.grants === 'client_credentials' &&
      constant.ALLOW_CLIENT_CREDENTIAL.indexOf(req.originalUrl.replace(/\d+|\?.*/gm, '')) > -1
    ) {
      // logger.debug('Grant CC OK')
      next()
    } else {
      logger.info('Invalid Grants #1')
      res.status(generalResp.HTTP_BADREQUEST)
      res.send({
        error: 'invalid_grants',
        error_description: 'Invalid grant: access is invalid #2',
      })
    }
  } else {
    logger.info('Invali Grants #1')
    res.status(generalResp.HTTP_BADREQUEST)
    res.send({
      error: 'invalid_grants',
      error_description: 'Invalid grant: access is invalid #1',
    })
  }
}

module.exports = {
  printForwardRequestResponse,
  recordHit,
  checkGrants
};
