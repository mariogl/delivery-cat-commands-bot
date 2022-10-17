import chalk from "chalk";
import http from "http";
import connectDB from "./db/index.js";
import "./discord/index.js";
import "./loadEnvironment.js";

(async () => {
  http
    .createServer((req, res) => {
      res.write("Hi");
      res.end();
    })
    .listen(process.env.PORT || 8080, () =>
      console.log(chalk.green("Server up"))
    );

  await connectDB(process.env.MONGODB_CONNECTION).catch((error) => {
    console.log(chalk.red(`Error on starting database: ${error.message}`));
    throw new Error();
  });

  console.log(chalk.blue("Connected to database"));
})();
