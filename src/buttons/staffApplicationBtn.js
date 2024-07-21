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
const application = require("../schemas/applicationsSchema");

module.exports = {
  customId: "staffApplication",
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param { Client } client
   * @param { ButtonInteraction } interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    let applicationData = await application.findOne({
      GuildID: interaction.guild.id,
    });

    if (!applicationData) {
      return await interaction.editReply({
        content: `The application system has not been set-up yet`,
        ephemeral: true,
      });
    }

    try {
      const member = interaction.user;

      const start = new ButtonBuilder()
        .setCustomId("startApplicationBtn")
        .setLabel("Start")
        .setStyle(ButtonStyle.Success);

      const cancel = new ButtonBuilder()
        .setCustomId("cancelStartApplicationBtn")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger);

      const dmApplicationRow = new ActionRowBuilder().addComponents(
        start,
        cancel
      );

      const dmEmbed = new EmbedBuilder()
        .setAuthor({
          name: member.username,
          iconURL: member.displayAvatarURL(),
        })
        .setColor(0x00baff)
        .setTitle(`New Staff application`)
        .addFields({
          name: `Staff Requirements`,
          value: `- The age requirement is **14+**\n- You must have a functioning microphone\n- Must be able to review and handle situations that include explicit language, behavior, videos, images or any difficult scenario\n- Must enjoy answering questions and assisting the community, being patient and understanding\n- Applicants must have no more than 3 punishments within 60 days prior to this form\n- Must be able to download and use recording software. (Recommended: OBS / Mdeal)\n- If you haven't received a response within 2 weeks, then this may indicate the denial of your application`,
        })
        .setFooter({
          text: `Applications | ${interaction.client.user.username}`,
        });

      member.send({
        content: `** **`,
        embeds: [dmEmbed],
        components: [dmApplicationRow],
        fetchReply: true,
      });

      const dmChannel = await member.createDM();

      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.username,
          iconURL: member.displayAvatarURL(),
        })
        .setColor(0x00baff)
        .setTitle(`Application Sent in DMs`)
        .setDescription(
          `The application has successfully started in the [DM's](https://discord.com/channels/@me/${dmChannel.id}) with this bot!\n\n`
        )
        .setFooter({
          text: `Applications | ${interaction.client.user.username}`,
        });

      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: `An error occured`,
        ephemeral: true,
      });
    }
  },
};
