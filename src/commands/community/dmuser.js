const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm-user")
    .setDescription(
      "Sends a DM message to a selected user in the form of an embed"
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The message to send")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to send the DM to")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    try {
        const text = interaction.options.getString("text");
        const user = interaction.options.getUser("user");
    
        const embed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("📩 Direct Message")
          .setDescription(text)
          .setTimestamp();
    
        await user.send({ embeds: [embed] });
        await interaction.reply({ content: `DM sent to ${user}`, ephemeral: true });
    } catch (error) {
        return interaction.reply({ content: `An error occured. This user may have DMs off.`, ephemeral: true})
    }
  },
};
