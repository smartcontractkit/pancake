const helpers = require("./support/helpers.js");

const LinkToken = artifacts.require("./LinkToken.sol");

module.exports = function(deployer) {
  let Contract = deployer.deploy(LinkToken);
  helpers.updateState({LinkToken: Contract.address});
};
