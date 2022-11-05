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
      console.log(chalk.green("Found previous delivery of the same challenge"));
    }

    const frontRepo = options.getString("front-repo");
    const frontProd = options.getString("front-prod");
    const backRepo = options.getString("back-repo");
    const backProd = options.getString("back-prod");
    const partner = options.getUser("partner");
    const partner2 = options.getUser("partner2");

    if (!frontRepo && !backRepo) {
      throw new Error("Entrega incompleta 😫");
    }

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

    if (partner) {
      let {
        nickname: partnerNickname,
        // eslint-disable-next-line prefer-const
        user: { username: partnerUsername },
      } = await guild.members.fetch(partner);

      partnerNickname = normalizeNickname(partnerNickname || partnerUsername);

      console.log(chalk.blue("\nReceived partner:"));
      console.log(partnerNickname);

      deliveryData.nickname += `-${partnerNickname}`;
    }

    if (partner2) {
      let {
        nickname: partnerNickname,
        // eslint-disable-next-line prefer-const
        user: { username: partnerUsername },
      } = await guild.members.fetch(partner2);

      partnerNickname = normalizeNickname(partnerNickname || partnerUsername);

      console.log(chalk.blue("\nReceived partner 2:"));
      console.log(partnerNickname);

      deliveryData.nickname += `-${partnerNickname}`;
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

    let replyContent = `${deliveryData.nickname} - ${challengeName}\n`;
    if (frontRepo) {
      replyContent += `\nFront - repo: ${frontRepo}`;
      replyContent += `\nFront - prod: ${frontProd}`;
    }
    if (backRepo) {
      replyContent += `\nBack - repo: ${backRepo}`;
      replyContent += `\nBack - prod: ${backProd}`;
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

    const projectExists = await Project.findOne({
      name: `${nickname} - ${challengeName}`,
    });

    if (!projectExists) {
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
    } else {
      await Project.findByIdAndUpdate(projectExists.id, {
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
    }

    if (sameDeliveryMessage) {
      sameDeliveryMessage.edit(replyContent);
      await interaction.reply({
        content: `${user}, he actualizado tu entrega anterior con los nuevos datos 👌`,
        ephemeral: true,
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
