pragma solidity ^0.4.24;

import "chainlink/solidity/contracts/Chainlinked.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Pancake is Chainlinked, Ownable {
  bytes32 internal specId;

  constructor(address _link, address _oracle, bytes32 _specId) public Ownable() {
    setLinkToken(_link);
    setOracle(_oracle);
    specId = _specId;
  }

  function() public payable {
    ChainlinkLib.Run memory run = newRun(specId, this, "fulfill(bytes32)");
    chainlinkRequest(run, LINK(1));
  }

  function fulfill(bytes32 _requestId)
    public
    checkChainlinkFulfillment(_requestId) {
  }
}
