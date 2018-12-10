const helpers = require("./support/helpers.js");

const Oracle = artifacts.require("./Oracle.sol");
const LinkToken = artifacts.require("./LinkToken.sol");

module.exports = function(deployer) {
  let Contract = deployer.deploy(Oracle, LinkToken.address);
  helpers.updateState({Oracle: Contract.address});
};
