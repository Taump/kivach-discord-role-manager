const { EmbedBuilder } = require("discord.js");
const conf = require('ocore/conf');

const discordInstance = require("../discordInstance");

async function sendToChannel(userGlobalName, role) {
  if (process.env.CHANNEL_ID) {
    try {
      const channel = await discordInstance.channels.fetch(process.env.CHANNEL_ID);

      const embed = new EmbedBuilder()
        .setTitle(`${userGlobalName} is now “${role.name}”`)
        .setDescription(`You can get this role too. If you already donated you can send your address to the ${conf.deviceName} and get it or you may [Donate now](https://kivach.org).`)
        .setAuthor({ name: "Kivach roles bot", url: "https://kivach.org" })
        .setColor(role.color);

      await channel.send({ embeds: [embed] });
    } catch (e) {
      console.error("Can't send message to channel", e)
    }
  }
}

exports.sendToChannel = sendToChannel;
