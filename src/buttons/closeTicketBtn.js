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
  Events,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const ticket = require("../schemas/ticketschema");

module.exports = {
  customId: "closeTicket",
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param { Client } client
   * @param { ButtonInteraction } interaction
   */
  run: async (client, interaction) => {
    const closeModal = new ModalBuilder()
      .setTitle(`Ticket Closing`)
      .setCustomId("closeTicketModal");

    const reason = new TextInputBuilder()
      .setCustomId("closeReasonTicket")
      .setRequired(false)
      .setPlaceholder(
        "What is the reason for closing this ticket? Are you satisfied with our services?"
      )
      .setLabel("Provide a closing reason")
      .setMaxLength(500)
      .setStyle(TextInputStyle.Paragraph);

    const one = new ActionRowBuilder().addComponents(reason);

    closeModal.addComponents(one);
    await interaction.showModal(closeModal);
  },
};
