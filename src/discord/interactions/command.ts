import chalk from "chalk";
import discord from "discord.js";
import Challenge from "../../db/models/Challenge.js";
import Project from "../../db/models/Project.js";
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
    user,
    // eslint-disable-next-line prefer-const
    user: { username },
  } = await guild.members.fetch(interaction.user);
  nickname = normalizeNickname(nickname || username);

  console.log(chalk.blue(`Received command: ${commandName} from ${nickname}`));

  try {
    const channel = guild.channels.cache.get(channelId);
    const category = guild.channels.cache.get(channel.parentId);

    const messages = await (
      channel as discord.BaseGuildTextChannel
    ).messages.fetch();

    const deliveryData = {
      category,
      channel,
      nickname,
    };

    const challengeName = getExpectedRepoPrefix(
      category.name,
      channel.name
    ).replace(`${process.env.BOOTCAMP}-`, "");

    console.log(chalk.yellow(`>>>>> ${challengeName} <<<<<`));

    const sameDeliveryMessage = messages.find((message) =>
      message.content.toLowerCase().includes(`${nickname} - ${challengeName}`)
    );

    if (sameDeliveryMessage) {
      await sameDeliveryMessage.delete();
      await Project.deleteOne({ name: `${nickname} - ${challengeName}` });
      console.log(
        chalk.green("Deleted previous delivery of the same challenge")
      );
      await interaction.reply({
        content: `${user}, he borrado tu entrega anterior, se sustituirá por ésta`,
        ephemeral: true,
      });
    }

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

    let challengeDB = await Challenge.findOne({
      name: challengeName,
    });

    if (!challengeDB) {
      challengeDB = await Challenge.create({
        name: challengeName,
        week: challengeName[1],
        number: challengeName.split("ch")[1],
      });
    }

    await Project.create({
      challenge: challengeDB.id,
      name: `${nickname} - ${challengeName}`,
      repo: {
        front: frontRepo,
        back: backRepo,
      },
      prod: {
        front: frontProd,
        back: backProd,
      },
      student: nickname,
      trello: "",
      sonarKey: {
        front: "",
        back: "",
      },
    });

    if (sameDeliveryMessage) {
      await interaction.followUp({
        content: replyContent,
        flags: 4,
      });
    } else {
      await interaction.reply({
        content: replyContent,
        flags: 4,
      });
    }
  } catch (error) {
    console.log(chalk.red(error.message));

    await interaction.reply({
      content: error.message,
      ephemeral: true,
    });
  }
};

export default processChatCommand;
