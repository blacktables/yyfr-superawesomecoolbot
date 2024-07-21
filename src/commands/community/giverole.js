const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giverole")
    .setDescription(
      "Gives a certain role to a selected user. Only administrators are able to use this."
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give the role to")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to give")
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

    if (member.roles.cache.has(role.id)) {
      interaction.reply({
        content: `${user} already has the ${role} role.`,
        ephemeral: true,
      });
      return;
    }

    member.roles.add(role);
    await interaction.reply({ text: `Gave the ${role} role to ${user}.`, ephemeral: true });
  },
};
