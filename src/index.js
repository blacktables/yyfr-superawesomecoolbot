const { Client, Collection, GatewayIntentBits, Events } = require(`discord.js`);
const eventHandler = require("./handlers/eventHandler");
const fs = require("fs");
const { Partials } = require("discord.js");
require("dotenv/config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Partials.User, Partials.Reaction, Partials.Message],
});

client.commands = new Collection();

eventHandler(client);

client.login(process.env.TOKEN);
