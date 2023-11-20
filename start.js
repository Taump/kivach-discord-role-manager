const conf = require('ocore/conf');
const eventBus = require('ocore/event_bus.js');
const device = require('ocore/device.js');
const network = require('ocore/network.js');
const headlessWallet = require('headless-obyte');
const db = require('./db/index.js');

const discordInstance = require('./discordInstance');
const { isValidAddress } = require('ocore/validation_utils');
const { getRoleByWalletAddress } = require('./utils/getRoleByWalletAddress.js');
const { addDonor, getNickDataByWallet, removeDonor } = require('./db/api.js');

const sessions = {} // device_address: { wallet: 'ADDRESS', signed: bool, role: roleObject from conf.js }

eventBus.once('headless_wallet_ready', () => {
  headlessWallet.setupChatEventHandlers();

  eventBus.once('connected', async function (ws) {
    network.initWitnessesIfNecessary(ws, start);
  });

  eventBus.on('paired', (from_address) => {
    device.sendMessageToDevice(from_address, 'text', "Please insert your donor obyte address");
  });


  eventBus.on('text', async (from_address, data) => {
    let arrSignedMessageMatches = data.match(/\(signed-message:(.+?)\)/);

    const trimmedData = data.trim();
    let wallet = null;
    let nick = null;

    if (isValidAddress(trimmedData)) {
      wallet = trimmedData;
      const role = await getRoleByWalletAddress(wallet);
      
      sessions[from_address] = { wallet, role, signed: false };

      if (role) {
        device.sendMessageToDevice(from_address, 'text', `[${wallet}](sign-message-request: ${wallet} is my wallet)`);

      } else {
        device.sendMessageToDevice(from_address, 'text', 'Sorry we can\'t find your address in kivach donors database. Please try again.');
      }

    } else if (data.startsWith("[Signed message]")) {
      let signedMessageBase64 = arrSignedMessageMatches[1];

      let validation = require('ocore/validation.js');

      let signedMessageJson = Buffer.from(signedMessageBase64, 'base64').toString('utf8');
      let objSignedMessage;

      try {
        objSignedMessage = JSON.parse(signedMessageJson);
      } catch (e) {
        return null;
      }

      validation.validateSignedMessage(objSignedMessage, err => {
        if (!err && objSignedMessage.authors && objSignedMessage.authors.length) {

          if (sessions[from_address] && sessions[from_address].wallet === objSignedMessage.authors[0].address) {
            sessions[from_address] = { ...sessions[from_address], signed: true }
          }

          device.sendMessageToDevice(from_address, 'text', 'Please send your discord nick (in Obyte server)');
        }
      });

    } else {
      nick = trimmedData;
      const wallet = sessions[from_address]?.wallet;
      const signed = sessions[from_address]?.signed;
      const roleId = sessions[from_address]?.role?.id;

      if (wallet && signed && roleId) {
        await discordInstance.login(conf.BOT_TOKEN);

        const members = await discordInstance.guilds.fetch(conf.SERVER_ID).then(data => data.members.fetch());
        const membersData = members.toJSON().map(member => ({ ...member.user }))
        const user = membersData.find(({ username }) => username.toLowerCase() === nick.toLowerCase());

        const lastNickData = await getNickDataByWallet(wallet);
        
        if (lastNickData && user) {
          device.sendMessageToDevice(from_address, 'text', `Your last discord nick was ${lastNickData.nick_name}. We will remove it.`);

          try {

            const lastMemberData = membersData.find(({ username }) => username.toLowerCase() === lastNickData.nick_name.toLowerCase());

            if (lastMemberData) {
              const guild = await discordInstance.guilds.fetch(conf.SERVER_ID);

              const role = await guild.roles.fetch(lastNickData.role_id);
              const lastMember = members.get(lastMemberData.id);

              await lastMember.roles.remove(role);

              await removeDonor(lastNickData.donor);
            } else {
              device.sendMessageToDevice(from_address, 'text', `We can't find member in discord server`);
            }

          } catch (e) {
            return console.error("Can't remove role", e);
          }
        }

        if (user) {
          device.sendMessageToDevice(from_address, 'text', 'Your discord status has been updated.');

          try {
            const guild = await discordInstance.guilds.fetch(conf.SERVER_ID);
            const member = members.get(user.id);
            const role = await guild.roles.fetch(roleId);

            await member.roles.add(role);

            await addDonor(wallet, nick, role.id);
          } catch (e) {
            console.log("Can't add role", e);
          }

          delete sessions[from_address];
        } else {
          device.sendMessageToDevice(from_address, 'text', 'We could not find your discord nick (in Obyte server). Please try again.');
        }

      } else {
        device.sendMessageToDevice(from_address, 'text', "Please insert your donor obyte address");
      }
    }
  });
});



async function start() {
  await db.create();
}
