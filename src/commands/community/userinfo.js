const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays information about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove the role from")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server",
        ephemeral: true,
      });
      return;
    }
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setThumbnail(user.displayAvatarURL())
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .addFields({ name: "ID", value: `${user.id}`, inline: true })
      .addFields({ name: "Username", value: `${user.username}`, inline: true })
      .addFields({
        name: "Creation Date",
        value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
        inline: true,
      })
      .addFields({
        name: "Join Date",
        value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
 