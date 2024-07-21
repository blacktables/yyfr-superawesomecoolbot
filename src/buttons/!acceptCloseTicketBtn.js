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
  customId: "acceptCloseTicket",
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
    if (interaction.user.id !== ticketChannelData.User) {
      console.log("Invalid Closure");

      try {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.replied) {
          console.warn("Interaction already replied.");
        } else {
          const invalidClosure = new EmbedBuilder()
            .setTitle("Invalid Closure")
            .setColor("Red")
            .setDescription(
              `You are unable to accept this ticket closure, only <@${ticketChannelData.User}> can do so`
            );
          return await interaction.editReply({
            embeds: [invalidClosure],
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error("Error replying to button interaction:", error.message);
      }
    }
  },
};
