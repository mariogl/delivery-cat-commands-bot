import "../loadEnvironment.js";
import { REST, SlashCommandBuilder, Routes } from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("entrega")
    .setDescription("Realizar una entrega")
    .addStringOption((option) =>
      option.setName("repo-front").setDescription("Repo del front")
    )
    .addStringOption((option) =>
      option.setName("prod-front").setDescription("URL de producción del front")
    )
    .addStringOption((option) =>
      option.setName("repo-back").setDescription("Repo del back")
    )
    .addStringOption((option) =>
      option.setName("prod-back").setDescription("URL de producción del back")
    )
    .addUserOption((option) =>
      option.setName("partner").setDescription("Compañera/o de equipo")
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log(`Successfully registered application commands.`))
  .catch(console.error);
