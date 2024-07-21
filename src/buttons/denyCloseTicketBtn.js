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
  customId: "denyCloseTicket",
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param { Client } client
   * @param { ButtonInteraction } interaction
   */
  run: async (client, interaction) => {
    const ticketDocument = await ticket.find({ Guild: interaction.guild.id });
    let ticketChannelData = ticketDocument.find(
      (ticketData) => ticketData.Channel === interaction.channelId
    );
    if (interaction.user.id === ticketChannelData.User) {
      console.log("Valid Denial");

      try {
        const foundTicket = ticketDocument.find(
          (ticketData) => ticketData.Channel === interaction.channelId
        );

        const latestTicket = await ticket
          .findOne({})
          .sort({ CloseRequestCountID: -1 });

        if (latestTicket) {
          const interactionId = latestTicket.CloseRequestMsgID;
          console.log(interactionId);

          const denyClosure = new EmbedBuilder()
            .setTitle("Closure Denied")
            .setDescription(
              `<@${foundTicket.User}> has denied the closure of this ticket`
            )
            .setColor("Red");

          const originalMessage = await interaction.channel.messages
            .fetch(interactionId)
            .catch((error) => {
              console.error("Error fetching original message:", error.message);
            });

          if (originalMessage) {
            await originalMessage.edit({
              content: "",
              embeds: [denyClosure],
              components: [],
            });
          } else {
            console.error("Original message not found");
          }
        } else {
          console.log("Close request message ID not found");
        }
      } catch (error) {
        console.error("Error replying to button interaction:", error.message);
      }
    } else if (interaction.user.id !== ticketChannelData.User) {
      console.log("Invalid Denial");

      try {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.replied) {
          console.warn("Interaction already replied.");
        } else {
          const invalidDenial = new EmbedBuilder()
            .setTitle("Invalid Denial")
            .setColor("Red")
            .setDescription(
              `You are unable to deny this closure, only <@${ticketChannelData.User}> can do so`
            );
          return await interaction.editReply({
            embeds: [invalidDenial],
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error("Error replying to button interaction:", error.message);
      }
    }
  },
};
