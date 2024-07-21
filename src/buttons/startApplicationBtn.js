const {
  EmbedBuilder,
  MessageCollector,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const application = require("../schemas/applicationsSchema");

let collector;
let answerCollected = false;
let lastQuestionAnswered = false;
let startTime = Date.now();

module.exports = {
  customId: "startApplicationBtn",
  lastQuestionAnswered: lastQuestionAnswered,
  startTime: startTime,
  userPermissions: [],
  botPermissions: [],
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    
    await interaction.deferReply({ ephemeral: true });

    try {
      const member = interaction.user;
      const dmChannel = await member.createDM();
      const message = await dmChannel.messages.fetch(interaction.message.id);

      const existingApplicationBefore = await application.findOne({
        User: member.id,
        Status: "submitted",
      });
      const runningApplication = await application.findOne({
        User: member.id,
        Status: "pending",
      });

      if (existingApplicationBefore || runningApplication) {
        const existingEmbed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Existing Application")
          .setDescription(
            "You already have an ongoing application that has not been checked, or you have an application that you haven't finished"
          )
          .setTimestamp();

        await message.edit({ embeds: [existingEmbed], components: [] });
        await interaction.editReply({
          content: `You already have a pending application, try again later`,
          ephemeral: true,
        });
        return;
      }

      const newApplication = new application({
        GuildID: interaction.guildId,
        User: member.id,
        Answers: [],
        Status: "pending",
      });

      await newApplication.save();

      // Initial message to start the application
      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.username,
          iconURL: member.displayAvatarURL(),
        })
        .setColor("Green")
        .setTitle(`Application Started`)
        .setDescription(
          `Application successfully started\n\nYou will have 10 minutes to answer each question otherwise the application will automatically expire. You can only send 1 message per question. Any answers above 1000 characters will be cut`
        )
        .setFooter({
          text: `Applications | ${interaction.client.user.username}`,
        })
        .setTimestamp();

      await message.edit({ embeds: [embed], components: [] });

      const cancel = new ButtonBuilder()
        .setCustomId("cancelApplicationBtn")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger);

      const cancelRow = new ActionRowBuilder().addComponents(cancel);

      let currentQuestionNumber = 1;

      const sendNextQuestion = async () => {
        if (lastQuestionAnswered) {
          currentQuestionNumber = 15;
          console.log("The last question has been answered");
          return;
        }
        const existingApplicationFromBefore = await application.findOne({
          User: member.id,
          Status: "pending",
        });

        if (existingApplicationFromBefore) {
          currentQuestionNumber =
            existingApplicationFromBefore.Answers.length + 1;
        } else {
          currentQuestionNumber = 1;
        }

        if (currentQuestionNumber === 14) {
          const iUnderstandSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("iUnderstandSelectMenu")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Yes, I understand")
                .setValue("iUnderstand")
                .setDescription("You understand the prompt messaged above")
            );

          const iUnderstandRow = new ActionRowBuilder().addComponents(
            iUnderstandSelectMenu
          );
          const lastQuestionEmbed = new EmbedBuilder()
            .setAuthor({
              name: member.username,
              iconURL: member.displayAvatarURL(),
            })
            .setColor("Green")
            .setTitle(`(${currentQuestionNumber}/14) Staff Application`)
            .setDescription(
              'Do not ask Staff/Management to view your application or else, it’ll result in an instant denial.'
            )
            .setFooter({
              text: `Applications | ${interaction.client.user.username}`,
            })
            .setTimestamp();

          await dmChannel.send({
            embeds: [lastQuestionEmbed],
            components: [iUnderstandRow, cancelRow],
          });

          return;
        }

        const nextQuestionContent = getNextQuestionContent(
          currentQuestionNumber
        );
        
        const nextQuestionEmbed = new EmbedBuilder()
          .setAuthor({
            name: member.username,
            iconURL: member.displayAvatarURL(),
          })
          .setColor("Green")
          .setTitle(`(${currentQuestionNumber}/14) Staff Application`)
          .setDescription(`**Question:** ${nextQuestionContent}`)
          .setFooter({
            text: `Applications | ${interaction.client.user.username}`,
          })
          .setTimestamp();

        await dmChannel.send({
          embeds: [nextQuestionEmbed],
          components: [cancelRow],
        });

        createMessageCollector();

        console.log(
          `Sent question ${currentQuestionNumber}: ${nextQuestionContent}`
        );
      };

      const createMessageCollector = () => {
        if (!collector || collector.ended) {
          const collectorFilter = (m) => m.author.id === member.id;
          collector = new MessageCollector(dmChannel, {
            filter: collectorFilter,
            time: 600_000, // 10 minutes
            max: 1, // Only collect one message per question
          });

          collector.on("collect", async (message) => {
            if (!answerCollected) {
              console.log(
                `Collected message from ${member.tag}: ${message.content}`
              );

              try {
                // Update the existing application with the collected answer
                await application.findOneAndUpdate(
                  { User: member.id, Status: "pending" },
                  { $push: { Answers: message.content } },
                  { new: true }
                );

                currentQuestionNumber++; // Increment the current question number

                sendNextQuestion(); // Send the next question

                return collector;
              } catch (error) {
                console.error(
                  "Error updating application with collected message:",
                  error
                );
              }
            }
          });

          collector.on("end", async (collected, reason) => {
            if (reason === "time") {
              console.log("No messages collected before timeout.");
              try {
                // Update the application status to expired if it's still pending
                await application.findOneAndUpdate(
                  { User: member.id, Status: "pending" },
                  { Status: "expired" }
                );

                const timeoutEmbed = new EmbedBuilder()
                  .setColor("Red")
                  .setTitle("Application Expired")
                  .setDescription(
                    "Your application has expired due to inactivity. Please start a new application if you wish to apply."
                  );

                await dmChannel.send({ embeds: [timeoutEmbed] });
              } catch (error) {
                console.error("Error updating application status:", error);
              }
            }
            console.log(`Message collector ended: ${reason}`);
          });
        }

        return collector;
      };

      sendNextQuestion();

      await interaction.editReply({
        content: `Application started`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: `An error occurred`,
        ephemeral: true,
      });
    }
  },

  collector: collector,
};

function getNextQuestionContent(questionNumber) {
  switch (questionNumber) {
    case 1:
      return "What is your Minecraft username?";
    case 2:
      return "How old are you?";
    case 3:
      return "What is your timezone?";
    case 4:
      return "Do you play on cracked, java premium, or bedrock?";
    case 5:
      return "Do you have a working microphone?";
    case 6:
      return "Do you have a working recording software? If so, which one?";
    case 7:
      return "Do you have any recent punishments on MineFlake or another network? If so, what for?";
    case 8:
      return "Do you have any current staff who would vouch or devouch your application?";
    case 9:
      return "What is your past staffing experience? Please only include servers with 500+ members in their discord. Include the server name, playerbase count, position, gamemodes, when you were with that team, and for how long.";
    case 10:
      return "Have you ever been demoted on any networks? If so, why, which ones, and when?";
    case 11:
      return "Why do you want to be staff on MineFlake?";
    case 12:
      return "What makes you different from other applicants?";
    case 13:
      return "Is there anything else we should know?";
    case 14:
      return "Do you understand that if you make a ticket or ask staff to check your application you would be instantly denied?";
    default:
      return null;
  }
}
