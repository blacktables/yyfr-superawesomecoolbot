const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deny")
    .setDescription(
      "Denies a user and sends a DM with a reason for their denial"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to deny")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role related to the denial")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The denial message")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
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

    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const text = interaction.options.getString("text");
    const member = interaction.guild.members.cache.get(user.id);

    if (member.roles.cache.has(role.id)) {
      member.roles.remove(role);
    }

    try {
      await user.send(
        `You have been denied. Reason: \n\`\`\`\n${text}\n\`\`\``
      );
    } catch (error) {
      return interaction.reply({
        content: `An error occured. This user may have DMs off.`,
        ephemeral: true,
      });
    }
    await interaction.reply(
      { content: `Denied ${user} and sent them a DM with the reason.`, ephemeral: true }
    );
  },
};
