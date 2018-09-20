const request = require("request-promise").defaults({jar: true});
const fs = require("fs");
const path = require("path");

const Oracle = artifacts.require("./Oracle.sol");
const LinkToken = artifacts.require("./LinkToken.sol");
const Pancake = artifacts.require("./Pancake.sol");

abort = (message) => {
  return (error) => {
    console.error(message);
    console.error(error);
    process.exit(1);
  };
};

module.exports = function(deployer) {
  deployer.then(async () => {
    const sessionsUrl = "http://localhost:6688/sessions";
    const specsUrl = "http://localhost:6688/v2/specs";

    const credentials = {
      email: process.env.CHAINLINK_USERNAME || "notreal@fakeemail.ch",
      password: process.env.CHAINLINK_PASSWORD || "twochains"
    };

    const jobSpec = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../job/Pancake.json"), "utf8")
    );

    const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
    if (!WALLET_ADDRESS) {
      abort("You must specify a WALLET_ADDRESS");
    }

    await request.post(sessionsUrl, {json: credentials});
    let body = await request.post(specsUrl, {json: jobSpec});
    let specID = body.data.id;
    console.log("  JobID:", specID);
    let Contract = await deployer.deploy(
      Pancake,
      LinkToken.address,
      Oracle.address,
      specID,
      WALLET_ADDRESS);

    const amount = web3.toWei("1", "ether");
    await LinkToken.at(LinkToken.address).transfer(Pancake.address, amount);
  });
};
