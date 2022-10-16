import "../loadEnvironment.js";
import { REST, SlashCommandBuilder, Routes } from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("entrega")
    .setDescription("Realizar una entrega")
    .addStringOption((option) =>
      option
        .setName("repo-front")
        .setDescription("Repo del front")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("prueba")
    .setDescription("Realizar una prueba")
    .addStringOption((option) =>
      option
        .setName("repo-front")
        .setDescription("Repo del front")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("pruebita")
    .setDescription("Realizar una prueba pero más pequeñita")
    .addStringOption((option) =>
      option
        .setName("repo-front")
        .setDescription("Repo del front")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log(`Successfully registered application commands.`))
  .catch(console.error);
