const dayjs = require('moment')

const FMT_DATE_TIME_YMDHMS = 'YYYY-MM-DD HH:mm:ss'
const FMT_DATE_TIME_YMDHMSU = 'YYYY-MM-DD HH:mm:ss.SSS'
const TODAY = 'YYYY-MM-DD'
const TIME = 'HH:mm:ss'

function now(microtime) {
  return dayjs().format(microtime ? FMT_DATE_TIME_YMDHMSU : FMT_DATE_TIME_YMDHMS)
}

function tomorrow(day, microtime) {
  return dayjs()
    .add(day, 'day')
    .format(microtime ? FMT_DATE_TIME_YMDHMSU : FMT_DATE_TIME_YMDHMS)
}

function expandDate(date, expandDay, microtime) {
  return dayjs(date)
    .add(expandDay, 'day')
    .format(microtime ? FMT_DATE_TIME_YMDHMSU : FMT_DATE_TIME_YMDHMS)
}

function normalDate(date, microtime) {
  return dayjs(date).format(microtime ? FMT_DATE_TIME_YMDHMSU : FMT_DATE_TIME_YMDHMS)
}

function todayDate() {
  return dayjs().format(TODAY)
}

function rangeDate(day) {
  return dayjs().subtract(day, 'day').format(TODAY)
}

function hoursNow() {
  return dayjs().format(TIME)
}

function yearNow() {
  return dayjs().year()
}

function getYear(day) {
  return dayjs(day, 'DD/MM/YYYY').year()
}

function formatDate(day) {
  return dayjs(day).format(TODAY)
}

function expireDate(day, microtime) {
  return dayjs()
    .subtract(day, 'day')
    .format(microtime ? FMT_DATE_TIME_YMDHMSU : FMT_DATE_TIME_YMDHMS)
}

module.exports = {
  now,
  tomorrow,
  expandDate,
  normalDate,
  todayDate,
  expireDate,
  hoursNow,
  rangeDate,
  yearNow,
  getYear,
  formatDate,
}
