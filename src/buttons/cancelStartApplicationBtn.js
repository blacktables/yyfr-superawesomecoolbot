const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputStyle,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const application = require("../schemas/applicationsSchema.js");
const startApplicationBtn = require("./startApplicationBtn.js");

module.exports = {
  customId: "cancelStartApplicationBtn",
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param { Client } client
   * @param { ButtonInteraction } interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.user;

      try {
        const member = interaction.user;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: member.username,
            iconURL: member.displayAvatarURL(),
          })
          .setColor("Red")
          .setTitle(`Staff Application Cancelled`)
          .setDescription(`This application has been cancelled`)
          .setFooter({
            text: `Applications | ${interaction.client.user.username}`,
          })
          .setTimestamp();

        const dmChannel = await member.createDM();
        const message = await dmChannel.messages.fetch(interaction.message.id);

        await message.edit({ embeds: [embed], components: [] });

        await application.findOneAndDelete({
          User: member.id,
          Status: "pending",
        });

        if (startApplicationBtn.collector) {
          startApplicationBtn.collector.end();
        }

        return await interaction.editReply({
          content: `Successfully cancelled this application`,
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        return await interaction.editReply({
          content: `An error occured`,
          ephemeral: true,
        });
      }
  },
};
