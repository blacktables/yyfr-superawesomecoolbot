require("colors");

const { EmbedBuilder } = require("discord.js");
const messageConfig = require("../../messageConfig.json");
const fetchLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = fetchLocalCommands();

  try {
    const command = localCommands.find(
      (cmd) => cmd.data.name === interaction.commandName
    );
    if (!command) return;

    const userPerms = command.userPermissions || [];
    for (const perm of userPerms) {
      if (!interaction.member.permissions.has(perm)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(messageConfig.userNoPermissions);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    const botPerms = command.botPermissions || [];
    const botMember = interaction.guild.members.me;
    for (const perm of botPerms) {
      if (!botMember.permissions.has(perm)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(messageConfig.botNoPermissions);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    await command.run(client, interaction);
  } catch (error) {
    console.error(`Error handling chat input command: ${error.message}`.red);
  }
};
