const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription(
      "Sends an announcement to a channel in the form of an embed with the text from the command"
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The announcement text")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the announcement to")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server",
        ephemeral: true,
      });
      return;
    }
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      interaction.reply({
        content:
          "You do not have the required permissions to use this command.",
        ephemeral: true,
      });
      return;
    }
    const text = interaction.options.getString("text");
    const channel = interaction.options.getChannel("channel");

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("📢 Announcement")
      .setDescription(text)
      .setTimestamp();

    channel.send({ embeds: [embed] });
    await interaction.reply({
      content: `Announcement sent to ${channel}`,
      ephemeral: true,
    });
  },
};
