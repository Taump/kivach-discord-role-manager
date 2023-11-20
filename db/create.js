const db = require('ocore/db.js');
const conf = require("ocore/conf.js");

exports.create = async function () {
  console.error("will create tables if not exist");

  await db.query(`CREATE TABLE IF NOT EXISTS ${conf.prefix}_donors (
    donor CHAR(32) NOT NULL,
    nick_name CHAR(32) NOT NULL,
    role_id CHAR(32) NOT NULL,
    UNIQUE(donor)
  )`);
}
