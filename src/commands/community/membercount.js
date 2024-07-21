const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Displays the number of members in the server"),
  run: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server",
        ephemeral: true,
      });
      return;
    }

    const { guild } = interaction;

    const embed = new EmbedBuilder()
    .setTitle('Server Member Count')
    .setColor('Green')
    .setDescription(`\`${guild.name}\` has **${guild.memberCount} members!**`)
    .setFooter({ text: `Member Count`})
    .setTimestamp()

    await interaction.reply({ embeds: [embed] });
  },
};
