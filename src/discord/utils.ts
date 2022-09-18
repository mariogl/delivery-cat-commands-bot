import discord from "discord.js";
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { Side } from "../types/index.js";
import { getRandomYield } from "../utils/index.js";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export const normalizeNickname = (nickname: string): string =>
  nickname
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replaceAll(" ", "-")
    .toLowerCase();

export const getExpectedRepoPrefix = (
  categoryName: string,
  channelName: string
) => {
  let nWeek = categoryName.split(" ")[1];
  if (nWeek === "projects") {
    nWeek = "9";
  }
  const nChallenge = channelName.split("-")[1];

  return `${process.env.BOOTCAMP}-w${nWeek}ch${
    nChallenge === "weekend" ? "we" : nChallenge
  }`;
};

export const checkRepoPrefix = (
  expectedRepoPrefix: string,
  nickname: string,
  repoName: string
) => {
  if (
    !repoName.toLowerCase().startsWith(expectedRepoPrefix.toLowerCase()) ||
    !repoName.toLowerCase().includes(nickname.toLowerCase())
  ) {
    const error = new Error(
      `Nombre de repo mal formado. El nombre del repo debería empezar por ${expectedRepoPrefix.toLowerCase()}-${nickname.toLowerCase()} 🥱`
    );
    throw error;
  }
};

export const extractInfoRepo = (repo: string) => {
  const repoPath = repo.split("https://github.com/")[1];
  const parts = repoPath.split("/");
  const owner = parts[0];
  const repoName = parts.slice(1).join("").replace(".git", "");

  return {
    owner,
    repoName,
  };
};

export const checkProd = async (side: Side, prod: string) => {
  if (!prod) {
    console.log(chalk.blue(` ${side} prod is empty`));
    return;
  }

  const response = await fetch(prod);
  if (!response.ok) {
    throw new Error(
      `🚫 ${getRandomYield()} Error en producción ${side}: la URL devuelve 404 😶‍🌫️`
    );
  }

  console.log(chalk.blue(` URL prod: ${prod}`));
};

export const checkRepo = async (
  side: Side,
  repo: string,
  {
    category,
    channel,
    nickname,
  }: {
    category: discord.GuildBasedChannel;
    channel: discord.GuildBasedChannel;
    nickname: string;
  }
) => {
  if (!repo) {
    console.log(chalk.blue(` ${side} repo is empty`));
    return;
  }

  console.log(chalk.blue(` Repo: ${repo}`));

  try {
    const { owner, repoName } = extractInfoRepo(repo);

    const expectedRepoPrefix = getExpectedRepoPrefix(
      category.name,
      channel.name
    );
    checkRepoPrefix(expectedRepoPrefix, nickname, repoName);

    await octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo: repoName,
      per_page: 1,
    });
  } catch (error) {
    if (error.message.includes("empty")) {
      error.message = "Ese repo está vacío 😭";
    } else if (error.message.toLowerCase() === "not found") {
      error.message = "Parece que ese repo no existe 🤔";
    }

    throw new Error(
      `🚫 ${getRandomYield()} Error en el repo ${side}: ${error.message}`
    );
  }
};
