#!/usr/bin/env node

const helpers = require("../migrations/support/helpers.js");

const Pancake = artifacts.require("./Pancake.sol");

//const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

(async () => {
  let state = helpers.updateState({});
  let PancakeContract = Pancake.at(state.Pancake);

  await web3.eth.sendTransaction({
    from: "0x9ca9d2d5e04012c9ed24c0e513c9bfaa4a2dd77f",
    to: PancakeContract.address,
    value: web3.toWei("1", "ether")
  });
})();
