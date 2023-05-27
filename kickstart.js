const fs = require('fs')
const dotenv = require('dotenv')

let env
if (fs.existsSync('./config/config.env')) {
  const buff = fs.readFileSync('./config/config.env')
  if (buff) {
    env = buff.toString().replace(/[^a-z]/g, '')
  }
}

let path = `./config/${env}.env`
if (!env || !fs.existsSync(path)) {
  path = `./config/production.env`
}

dotenv.config({ path })
