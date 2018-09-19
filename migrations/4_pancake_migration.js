const Pancake = artifacts.require("./Pancake.sol");
const Oracle = artifacts.require("./Oracle.sol");
const LinkToken = artifacts.require("./LinkToken.sol");
const request = require("request-promise").defaults({jar: true});
const fs = require("fs");


module.exports = async function(deployer) {
  const sessionsUrl = "http://localhost:6688/sessions";
  const specsUrl = "http://localhost:6688/v2/specs";

  const credentials = {
    email: process.env.CHAINLINK_USERNAME,
    password: process.env.CHAINLINK_PASSWORD
  };

  let jobSpec;
  fs.readFile("../job/Pancake.json", "utf8", function(err, contents) {
    jobSpec = contents;
  });

  await request.post(sessionsUrl, {json: credentials});
  let body = await request.post(specsUrl, {json: jobSpec});
  let specID = body.data.id;
  await deployer.deploy(Pancake, LinkToken.address, Oracle.address, specID, process.env.WALLET_ADDRESS);
};
