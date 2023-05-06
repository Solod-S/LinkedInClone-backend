const mongoose = require("mongoose");
const chalk = require("chalk");

const app = require("./app");

const { DB_HOST, PORT, BASE_URL } = process.env;
const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
    console.log(successMsg(`Database connect success, ${BASE_URL}`));
  })
  .catch((error) => {
    // console.log(error.message);
    console.log(errorMsg(error.message));
    process.exit(1);
  });
