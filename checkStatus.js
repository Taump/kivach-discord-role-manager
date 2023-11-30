const conf = require("ocore/conf.js");
const device = require('ocore/device.js');

const { getAllDonors, updateDonorRole } = require("./db/api");
const discordInstance = require("./discordInstance");
const { getRoleByWalletAddress } = require("./utils/getRoleByWalletAddress");
const { sendToChannel } = require("./utils/sendToChannel");

const checkAndUpdateStatus = async () => {
  const donors = await getAllDonors();
  const members = await discordInstance.guilds.fetch(conf.SERVER_ID).then(data => data.members.fetch());
  const membersData = members.toJSON().map(member => ({ ...member.user }));
  const guild = await discordInstance.guilds.fetch(conf.SERVER_ID);

  console.error('Update time: ', Date.now());

  for (let i = 0; i < donors.length; i++) {
    const donor = donors[i]; // actualRole = conf.discordRoles[2] // for test
    const actualRole = await getRoleByWalletAddress(donor.donor);

    if (String(donor.role_id) !== String(actualRole.id)) {
      const user = membersData.find(({ id }) => id === donor.user_id);
      console.error('user', user.globalName + ' -> ' + actualRole.name);

      if (user) {
        const member = members.get(user.id);
        const oldRole = await guild.roles.fetch(donor.role_id);
        const newRole = await guild.roles.fetch(actualRole.id);

        try {
          await member.roles.remove(oldRole);
        } catch (e) {
          console.error("Can't remove role", e, donor.donor);
        }

        await member.roles.add(newRole);

        await updateDonorRole(donor.donor, actualRole.id);

        device.sendMessageToDevice(donor.device_address, 'text', `Your new discord status: ${newRole.name}`);

        await sendToChannel(user.globalName || user.username, actualRole);
      }
    }
  }
}

exports.checkAndUpdateStatus = checkAndUpdateStatus;