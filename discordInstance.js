const { Client, GatewayIntentBits } = require('discord.js');

const discordInstance = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, 'GuildMembers'] });

module.exports = discordInstance;
