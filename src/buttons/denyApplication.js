const {
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");
const application = require("../schemas/applicationsSchema");

module.exports = {
  customId: "denyApplication",
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const messageId = interaction.message.id;

    const foundApplication = await application.findOne({
      ResultMessageID: messageId,
      Status: "submitted",
    });

    if (foundApplication) {
      try {
        const reasonModal = new ModalBuilder()
          .setTitle(`Application Denial`)
          .setCustomId("denyApplicationModal");

        const reasonInput = new TextInputBuilder()
          .setCustomId("denyApplicationReason")
          .setRequired(false)
          .setPlaceholder("Enter reason for denial (Optional)")
          .setLabel("Provide a closing reason")
          .setMaxLength(500)
          .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder().addComponents(reasonInput);
        reasonModal.addComponents(actionRow);

        await interaction.showModal(reasonModal);
      } catch (error) {
        console.error("Error handling deny application:", error);
        return await interaction.reply({
          content: `An error occurred while processing your request.`,
          ephemeral: true,
        });
      }
    } else {
      return await interaction.reply({
        content: `No submitted application found`,
        ephemeral: true,
      });
    }
  },
};
