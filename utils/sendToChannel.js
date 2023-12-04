const { EmbedBuilder } = require("discord.js");
const conf = require('ocore/conf');

const discordInstance = require("../discordInstance");

async function sendToChannel(userGlobalName, role) {
  if (process.env.CHANNEL_ID) {
    try {
      const channel = await discordInstance.channels.fetch(process.env.CHANNEL_ID);

      const roleFields = conf.discordRoles.sort((a, b) => a.minimum_usd_donation - b.minimum_usd_donation).map(role => ({
        name: role.name, value: `Min. $${role.minimum_usd_donation}`, inline: false
      }));

      const embed = new EmbedBuilder()
        .setTitle(`${userGlobalName} is now “${role.name}”`)
        .setDescription(`You can get this role too. If you already donated you can send your address to [the ${conf.deviceName}](${conf.kivach_invite_to_bot_url}) and get it or you may [Donate now](https://kivach.org).`)
        .setAuthor({ name: "Kivach roles bot", url: "https://kivach.org" })
        .setColor(role.color)
        .setFields(roleFields);

      await channel.send({ embeds: [embed] });
    } catch (e) {
      console.error("Can't send message to channel", e)
    }
  }
}

exports.sendToChannel = sendToChannel;
