const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Gets information about this server'),
    run: async (client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply({
                content: "You can only run this command inside a server",
                ephemeral: true,
            });
            return;
        }


        const { guild } = interaction;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL() 
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const textChannels = guild.channels.cache.filter((c) => c.type === 0).toJSON().length;
        const voiceChannels = guild.channels.cache.filter((c) => c.type === 2).toJSON().length;
        const categoryChannels = guild.channels.cache.filter((c) => c.type === 4).toJSON().length;
        const id = guild.id;

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setThumbnail(icon)
          .setAuthor({ name: name, iconURL: icon })
          .setFooter({ text: `Server ID: ${id}` })
          .setTimestamp()
          .addFields({ name: "Name", value: `${name}`, inline: false })
          .addFields({ name: "Server Owner", value: `<@${ownerId}>`, inline: true})
          .addFields({ name: "Date Created", value: `<t:${parseInt(createdTimestamp / 1000)}:R>`, inline: true })
          .addFields({ name: "Server Members", value: `${memberCount}`, inline: true})
          .addFields({ name: "Roles", value: `${roles}`, inline: true})
          .addFields({ name: "Emojis", value: `${emojis}`, inline: true})
          .addFields({ name: "Server Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true})
          .addFields({ name: "Channels", value: `**${textChannels}** Text | **${voiceChannels}** Voice | **${categoryChannels}** Categories`, inline: false})

          return await interaction.reply({ embeds: [embed] });
    }
}