/*jslint node: true */
"use strict";
exports.port = null;

exports.bServeAsHub = false;
exports.bLight = true;
exports.bNoPassphrase = true;

exports.storage = 'sqlite';

exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';
exports.deviceName = 'Kivach discord bot';
exports.permanent_pairing_secret = '*';
exports.control_addresses = [''];
exports.payout_address = 'WHERE THE MONEY CAN BE SENT TO';


exports.bIgnoreUnpairRequests = true;
exports.bSingleAddress = false;
exports.bStaticChangeAddress = true;
exports.KEYS_FILENAME = 'keys.json';

exports.SERVER_ID = process.env.SERVER_ID;
exports.BOT_TOKEN = process.env.BOT_TOKEN;

exports.kivach_backend_api_url = "https://kivach.org/api";
exports.kivach_invite_to_bot_url = "https://cascading-donations-v2.vercel.app/api/bot";
exports.prefix = "DISCORD_ROLES";

// hex to decimals color converter: https://www.mathsisfun.com/hexadecimal-decimal-colors.html
exports.discordRoles = [
  {
    name: "Kivach donor",
    minimum_usd_donation: 0.1,
    color: 0x63cdda,
    id: undefined // "1176143103678238730" // please add this 
  },
  {
    name: "Kivach piranha donor",
    minimum_usd_donation: 50,
    color: 0x45C2F2,
    id: undefined //"1176143102617067550" // please add this 
  },
  {
    name: "Kivach shark donor",
    minimum_usd_donation: 200,
    color: 0x2D98DA,
    id: undefined //"1176143102617067550" // please add this 
  },
  {
    name: "Kivach whale donor",
    minimum_usd_donation: 1000,
    color: 0x4b7bec,
    id: undefined //"1176143100947734538" // please add this 
  }
]