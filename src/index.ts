import chalk from "chalk";
import "./loadEnvironment.js";
import "./discord";
import connectDB from "./db/index.js";

(async () => {
  await connectDB(process.env.MONGODB_CONNECTION).catch((error) => {
    console.log(
      chalk.red(`Error al iniciar la base de datos: ${error.message}`)
    );
    throw new Error();
  });
  console.log(chalk.blue("Base de datos iniciada"));
})();
