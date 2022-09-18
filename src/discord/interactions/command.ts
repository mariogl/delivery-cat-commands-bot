import chalk from "chalk";
import discord from "discord.js";
import Challenge from "../../db/models/Challenge.js";
import {
  checkProd,
  checkRepo,
  getExpectedRepoPrefix,
  normalizeNickname,
} from "../utils.js";

const processChatCommand = async (
  interaction: discord.ChatInputCommandInteraction<discord.CacheType>
) => {
  const { commandName, options, guild, channelId } = interaction;

  let {
    nickname,
    // eslint-disable-next-line prefer-const
    user: { username },
  } = await guild.members.fetch(interaction.user);
  nickname = normalizeNickname(nickname || username);

  console.log(chalk.blue(`Received command: ${commandName} from ${nickname}`));

  try {
    const channel = guild.channels.cache.get(channelId);
    const category = guild.channels.cache.get(channel.parentId);

    const deliveryData = {
      category,
      channel,
      nickname,
    };

    const challengeName = getExpectedRepoPrefix(
      category.name,
      channel.name
    ).replace(`${process.env.BOOTCAMP}-`, "");

    console.log(chalk.yellow(challengeName));

    const frontRepo = options.getString("front-repo");
    const frontProd = options.getString("front-prod");
    const backRepo = options.getString("back-repo");
    const backProd = options.getString("back-prod");

    if ((!frontRepo && frontProd) || (frontRepo && !frontProd)) {
      throw new Error(
        "Tienes que entregar las URL del repo y de producción del front"
      );
    }

    if ((!backRepo && backProd) || (backRepo && !backProd)) {
      throw new Error(
        "Tienes que entregar las URL del repo y de producción del back"
      );
    }

    if (frontRepo) {
      console.log(chalk.blue("\nChecking front repo..."));
      await checkRepo("front", frontRepo, deliveryData);
      console.log(chalk.blue("\nChecking front prod..."));
      await checkProd("front", frontProd);
    }

    if (backRepo) {
      console.log(chalk.blue("\nChecking back repo..."));
      await checkRepo("back", backRepo, deliveryData);
      console.log(chalk.blue("\nChecking back prod..."));
      await checkProd("back", backProd);
    }

    let replyContent = `${nickname} - ${challengeName}\n`;
    if (frontRepo) {
      replyContent += `Front - repo: ${frontRepo}`;
      replyContent += `\nFront - prod: ${frontProd}`;
    } else if (backRepo) {
      replyContent += `Back - repo: ${backRepo}`;
      replyContent += `Back - prod: ${backProd}`;
    }

    await interaction.reply({
      content: replyContent,
      flags: 4,
    });

    await Challenge.find({ week: 1, number: "2" });
  } catch (error) {
    console.log(chalk.red(error.message));

    await interaction.reply({
      content: error.message,
      ephemeral: true,
    });
  }
};

export default processChatCommand;
