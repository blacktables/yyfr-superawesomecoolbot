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
  customId: "claimTicket",
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param { Client } client
   * @param { ButtonInteraction } interaction
   */
  run: async (client, interaction) => {
    const ticketId = interaction.channelId;
    const user = interaction.user;
    const ticketName = interaction.channel.name;
    const guild = interaction.guild;
    const ticketData = await ticket.findOne({ Guild: interaction.guild.id });
    const ticketChannelData = await ticket.findOne({ Channel: ticketId });

    if (user.id === ticketChannelData.User) {
      return await interaction.reply({
        content: "You cannot claim your own ticket",
        ephemeral: true,
      });
    } else if (ticketChannelData.ClaimedUser === "") {
      await ticket.findOneAndUpdate(
        {
          Channel: ticketId,
          Guild: interaction.guild.id,
          ClaimedUser: "",
        },
        {
          ClaimedUser: user.id,
        }
      );

      console.log(ticketChannelData.ClaimedUser);
      console.log(
        `${ticketName}, with the id ${ticketId} has been claimed by ${user.username}. ${user.id}`
      );

      const embed = new EmbedBuilder()
        .setTitle("Ticket Claimed")
        .setColor(0x00baff)
        .setAuthor({ name: guild.name })
        .setDescription(`This ticket will be handled by <@${user.id}>`)
        .setFooter({ text: `Tickets | ${interaction.client.user.username}` });

      await interaction.reply({ embeds: [embed] });

      const channel = interaction.channel;

      for (const roleID of ticketData.Perms) {
        await channel.permissionOverwrites.edit(roleID, {
          SendMessages: true,
          ViewChannel: true,
        });
        await channel.permissionOverwrites.edit(interaction.user, {
          SendMessages: true,
          ViewChannel: true,
        });
      }
    } else if (
      interaction.isButton() &&
      interaction.customId == "ticketTranscript"
    ) {
    } else if (ticketChannelData.ClaimedUser === user.id) {
      return await interaction.reply({
        content:
          "You have already claimed this ticket! Run `/unclaim` to unclaim this ticket",
        ephemeral: true,
      });
    } else {
      return await interaction.reply({
        content: `This ticket has already been claimed by <@${ticketChannelData.ClaimedUser}> You can claim this ticket once they have unclaimed it`,
        ephemeral: true,
      });
    }
  },
};
