const db = require('ocore/db.js');
const conf = require("ocore/conf.js");

async function getNickDataByWallet(wallet) {
  const res = await db.query(`SELECT * FROM ${conf.prefix}_donors WHERE donor = ?`, [wallet]);
  return res[0];
}

async function addDonor(wallet, nick, roleID) {
  return await db.query(`INSERT INTO ${conf.prefix}_donors (donor, nick_name, role_id) VALUES (?,?,?)`, [wallet, nick, roleID]);
}

async function removeDonor(wallet) {
  return await db.query(`DELETE FROM ${conf.prefix}_donors WHERE donor=?`, [wallet]);
}

module.exports = {
  getNickDataByWallet,
  addDonor,
  removeDonor
}
