const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");

const app = require("./app");

const { DB_HOST, PORT, BASE_HTTPS_URL } = process.env;
const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

mongoose.set("strictQuery", true);

const privateKeyPath = path.resolve(__dirname, "certificates/key.pem");
const certificatePath = path.resolve(__dirname, "certificates/cert.pem");

const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const certificate = fs.readFileSync(certificatePath, "utf8");
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

mongoose
  .connect(DB_HOST)
  .then(() => {
    httpsServer.listen(PORT);
    console.log(successMsg(`Database connect success, ${BASE_HTTPS_URL}`));
  })
  .catch((error) => {
    // console.log(error.message);
    console.log(errorMsg(error.message));
    process.exit(1);
  });
