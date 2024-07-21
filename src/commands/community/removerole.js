const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription(
      "Removes a certain role from a selected user. Only administrators are able to use this."
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove the role from")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to remove")
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

    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = interaction.guild.members.cache.get(user.id);

    if (!member.roles.cache.has(role.id)) {
      interaction.reply({
        content: `${user} does not have the ${role} role.`,
        ephemeral: true,
      });
      return;
    }

    member.roles.remove(role);
    await interaction.reply({ content: `Removed the ${role} role from ${user}.`, ephemeral: true });
  },
};
