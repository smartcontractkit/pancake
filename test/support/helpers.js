BigNumber = require("bignumber.js");
moment = require("moment");
abi = require("ethereumjs-abi");

(() => {
  eth = web3.eth;

  before(async () => {
    accounts = await eth.accounts;
    owner = accounts[0];
    stranger = accounts[1];
    node = accounts[2];
  });

  Eth = (method, params) => {
    params = params || [];

    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: method,
        params: params || [],
        id: new Date().getTime()
      }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.result);
        }
      }, () => {}, () => {});
    });
  };

  emptyAddress = "0x0000000000000000000000000000000000000000";
  emptyBytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
  maxUint256 = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

  sealBlock = async () => {
    return Eth("evm_mine");
  };

  sendTransaction = async params => {
    return await eth.sendTransaction(params);
  };

  getBalance = async account => {
    return bigNum(await eth.getBalance(account));
  };

  bigNum = number => {
    return new BigNumber(number);
  };

  toWei = number => {
    return bigNum(web3.toWei(number));
  };

  tokens = number => {
    return bigNum(number * 10**18);
  };

  intToHex = number => {
    return "0x" + bigNum(number).toString(16);
  };

  intToHexNoPrefix = number => {
    return bigNum(number).toString(16);
  };

  hexToInt = string => {
    return web3.toBigNumber(string);
  };

  hexToAddress = string => {
    return "0x" + string.slice(string.length - 40);
  };

  unixTime = time => {
    return moment(time).unix();
  };

  seconds = number => {
    return number;
  };

  minutes = number => {
    return number * 60;
  };

  hours = number => {
    return number * minutes(60);
  };

  days = number => {
    return number * hours(24);
  };

  keccak256 = string => {
    return web3.sha3(string);
  };

  logTopic = string => {
    let hash = keccak256(string);
    return "0x" + hash.slice(26);
  };

  getLatestBlock = async () => {
    return await eth.getBlock("latest", false);
  };

  getLatestTimestamp = async () => {
    let latestBlock = await getLatestBlock();
    return web3.toDecimal(latestBlock.timestamp);
  };

  fastForwardTo = async target => {
    let now = await getLatestTimestamp();
    assert.isAbove(target, now, "Cannot fast forward to the past");
    let difference = target - now;
    await Eth("evm_increaseTime", [difference]);
    await sealBlock();
  };

  getEvents = contract => {
    return new Promise((resolve, reject) => {
      contract.allEvents().get((error, events) => {
        if (error) {
          reject(error);
        } else {
          resolve(events);
        }
      });
    });
  };

  eventsOfType = (events, type) => {
    let filteredEvents = [];
    for (event of events) {
      if (event.event === type) filteredEvents.push(event);
    }
    return filteredEvents;
  };

  getEventsOfType = async (contract, type) => {
    return eventsOfType(await getEvents(contract), type);
  };

  getLatestEvent = async contract => {
    let events = await getEvents(contract);
    return events[events.length - 1];
  };

  assertActionThrows = action => {
    return Promise.resolve().then(action)
      .catch(error => {
        assert(error, "Expected an error to be raised");
        assert(error.message, "Expected an error to be raised");
        return error.message;
      })
      .then(errorMessage => {
        assert(errorMessage, "Expected an error to be raised");
        invalidOpcode = errorMessage.includes("invalid opcode");
        reverted = errorMessage.includes("VM Exception while processing transaction: revert");
        assert.isTrue(invalidOpcode || reverted, "expected error message to include 'invalid JUMP' or 'revert'");
        // see https://github.com/ethereumjs/testrpc/issues/39
        // for why the "invalid JUMP" is the throw related error when using TestRPC
      });
  };

  encodeUint256 = int => {
    let zeros = "0000000000000000000000000000000000000000000000000000000000000000";
    let payload = int.toString(16);
    return (zeros + payload).slice(payload.length);
  };

  encodeInt256 = int => {
    if (int >= 0) {
      return encodeUint256(int);
    } else {
      let effs = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      let payload = maxUint256.plus(1).minus(Math.abs(int)).toString(16);
      return (effs + payload).slice(payload.length);
    }
  };

  encodeAddress = address => {
    return "000000000000000000000000" + address.slice(2);
  };

  encodeBytes = bytes => {
    let padded = bytes.padEnd(64, 0);
    let length = encodeUint256(bytes.length / 2);
    return length + padded;
  };

  checkPublicABI = (contract, expectedPublic) => {
    let actualPublic = [];
    for (method of contract.abi) {
      if (method.type == "function") actualPublic.push(method.name);
    }

    for (method of actualPublic) {
      let index = expectedPublic.indexOf(method);
      assert.isAtLeast(index, 0, (`#${method} is NOT expected to be public`));
    }

    for (method of expectedPublic) {
      let index = actualPublic.indexOf(method);
      assert.isAtLeast(index, 0, (`#${method} is expected to be public`));
    }
  };

  functionSelector = signature => {
    return "0x" + web3.sha3(signature).slice(2).slice(0, 8);
  };

  functionSelectorNoPrefix = signature => {
    return web3.sha3(signature).slice(2).slice(0, 8);
  };

  rPad = string => {
    let wordLen = parseInt((string.length + 31) / 32) * 32;
    for (let i = string.length; i < wordLen; i++) {
      string = string + "\x00";
    }
    return string;
  };

  lPad = string => {
    let wordLen = parseInt((string.length + 31) / 32) * 32;
    for (let i = string.length; i < wordLen; i++) {
      string = "\x00" + string;
    }
    return string;
  };

  lPadHex = string => {
    let wordLen = parseInt((string.length + 63) / 64) * 64;
    for (let i = string.length; i < wordLen; i++) {
      string = "0" + string;
    }
    return string;
  };

  toHex = arg => {
    if (arg instanceof Buffer) {
      return arg.toString("hex");
    } else {
      return Buffer.from(arg, "ascii").toString("hex");
    }
  };

  requestDataBytes = (specId, to, fHash, runId, data) => {
    let types = ["address", "uint256", "uint256", "bytes32", "address", "bytes4", "bytes32", "bytes"];
    let values = [0, 0, 1, specId, to, fHash, runId, data];
    let encoded = abi.rawEncode(types, values);
    let funcSelector = functionSelector("requestData(address,uint256,uint256,bytes32,address,bytes4,bytes32,bytes)");
    return funcSelector + encoded.toString("hex");
  };

  requestDataFrom = (oc, link, amount, args) => link.transferAndCall(oc.address, amount, args);

})();
