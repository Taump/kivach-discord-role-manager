const conf = require('ocore/conf');
const { Routes } = require('discord.js');

const discordInstance = require("./discordInstance");

(async () => {
  await discordInstance.login(conf.BOT_TOKEN);

  const rolesWithoutId = conf.discordRoles.filter((role) => !role.id);

  const getters = rolesWithoutId.reverse().map((role) => discordInstance.rest.post(Routes.guildRoles(conf.SERVER_ID), {
    body: {
      name: role.name,
      color: role.color,
      hoist: true,
      mentionable: true,
      permissions: 0,
    }
  }));

  const data = await Promise.all(getters);

  if (rolesWithoutId.length) {
    console.log("\x1b[32m", `Roles have been created. Please add the following ids to conf.js: \n`, data.reverse().map((role) => `For ${role.name} id = ${role.id}`));
  }
})();
