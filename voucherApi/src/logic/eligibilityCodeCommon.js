const fs = require("fs");
const { parse } = require("csv-parse/sync");

function loadCoupons(csvFilePath) {
  const fileContent = fs.readFileSync(csvFilePath);
  console.log(fileContent.toString());
  console.log(csvFilePath)
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

function findCouponConfig(coupons, code) {
  return coupons.find(c => c.code === code);
}

module.exports = {
  loadCoupons,
  findCouponConfig,
};