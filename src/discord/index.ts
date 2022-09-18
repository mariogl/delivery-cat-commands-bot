import "../loadEnvironment.js";
import discord from "discord.js";
import chalk from "chalk";
import processChatCommand from "./interactions/command.js";

const { Client, GatewayIntentBits } = discord;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(chalk.green("Bot ready and waiting for commands..."));
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    processChatCommand(interaction);
  }
});
