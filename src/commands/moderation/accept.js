const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("accept")
    .setDescription(
      "Gives a certain role to a user and sends a DM with a reason for their acceptance"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to accept")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to give")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The acceptance message")
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

    member.roles.add(role);
    try {
        await user.send(
          `You have been accepted. \n\`\`\`\nReason: ${text}\n\`\`\``
        );
    } catch (error) {
        return interaction.reply({
          content: `An error occured. This user may have DMs off, but the roles was successfully given`,
          ephemeral: true,
        });
    }
    await interaction.reply({ content: `Accepted ${user} and gave them the ${role} role.`, ephemeral: true });
  },
};
