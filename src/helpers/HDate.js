const moment = require("moment-timezone");

var date = new Date();
var year = date.getFullYear();
var month = String(date.getMonth() + 1).padStart(2, "0");
var day = String(date.getDate()).padStart(2, "0");
var hours = String(date.getHours()).padStart(2, "0");
var minutes = String(date.getMinutes()).padStart(2, "0");
var seconds = String(date.getSeconds()).padStart(2, "0");

const frFullDate = () => {
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const frDate = () => {
  return `${year}-${month}-${day}`;
};

const frFolderDate = () => {
  return `${year}${month}`;
};

const frIndonesiaDate = () => {
  return moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
};

const frIndonesiaTimeForId = () => {
  return moment().tz("Asia/Jakarta").valueOf();
};

module.exports = {
  frFullDate,
  frDate,
  frFolderDate,
  frIndonesiaDate,
  frIndonesiaTimeForId,
};
