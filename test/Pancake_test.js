"use strict";

require("./support/helpers.js");

let Pancake = artifacts.require("Pancake.sol");
let Oracle = artifacts.require("Oracle.sol");
let LinkToken = artifacts.require("LinkToken.sol");

contract("Pancake", () => {
  let linkContract, oracleContract, pancake;
  const jobId = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

  beforeEach(async function () {
    linkContract = await LinkToken.new();
    oracleContract = await Oracle.new(linkContract.address, {from: node});
    pancake = await Pancake.new(
      linkContract.address,
      oracleContract.address,
      jobId,
      owner,
      {from: owner}
    );
  });

  describe("fallback", () => {
    context("Without LINK", () => {
      it("Reverts", async function () {
        await assertActionThrows(async () => {
          await web3.eth.sendTransaction({
            from: owner,
            to: pancake.address,
            value: web3.toWei("1", "ether")
          });
        });
      });
    });
    context("With LINK", () => {
      beforeEach(async () => {
        await linkContract.transfer(pancake.address, web3.toWei("1", "ether"));
      });

      it("Creates a log on the oracle contract", async function () {
        await web3.eth.sendTransaction({
          from: owner,
          to: pancake.address,
          value: web3.toWei("1", "ether"),
          gas: 3000000
        });
        let event = await getLatestEvent(oracleContract);
        assert.equal(event.event, "RunRequest");
      });
    });
  });

  describe("fulfill", () => {
    let response = "Chainlink";
    let internalId;

    beforeEach(async () => {
      await linkContract.transfer(pancake.address, web3.toWei("1", "ether"));
      await web3.eth.sendTransaction({
        from: owner,
        to: pancake.address,
        value: web3.toWei("1", "ether"),
        gas: 3000000
      });
      let event = await getLatestEvent(oracleContract);
      internalId = event.args.internalId;
    });

    it("Only accepts answers from the oracle contract", async function () {
      await assertActionThrows(async () => {
        await pancake.fulfill(internalId, response, {from: stranger});
      });
    });

    it("Stores the given result", async function () {
      await oracleContract.fulfillData(internalId, response, {from: node});
    });
  });
});
