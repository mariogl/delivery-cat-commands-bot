import chalk from "chalk";
import discord from "discord.js";
import "../loadEnvironment.js";
import "./deploy-commands.js";
import processChatCommand from "./interactions/command.js";

const { Client, GatewayIntentBits } = discord;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(chalk.green("Bot ready and waiting for commands..."));
  console.log(chalk.yellow("Bot installed on servers:"));
  client.guilds.cache.forEach((guild) => {
    console.log(chalk.yellow(`${guild.name} (${guild.id})`));
  });
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    processChatCommand(interaction);
  }
});
