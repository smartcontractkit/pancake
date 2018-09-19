pragma solidity ^0.4.24;

import "chainlink/solidity/contracts/Chainlinked.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Pancake is Chainlinked, Ownable {
  bytes32 internal specId;
  address internal destinationWallet;

  // Save the SpecID to execute and the destinationWallet where funds should end up
  constructor(
      address _link,
      address _oracle,
      bytes32 _specId,
      address _destinationWallet)
    public Ownable() {
    setLinkToken(_link);
    setOracle(_oracle);
    specId = _specId;
    destinationWallet = _destinationWallet;
  }

  // The global fallback function, falled on receipt of ETH at this contract's
  // address
  function() public payable {
    // Transfer to incoming funds to the destination wallet
    destinationWallet.transfer(msg.value);

    //destinationWallet.transfer(this.balance());

    // Trigger the job run
    ChainlinkLib.Run memory run = newRun(specId, this, "fulfill(bytes32)");
    chainlinkRequest(run, LINK(1));
  }

  // No-op, needed for `newRun`
  function fulfill(bytes32 _requestId)
    public
    checkChainlinkFulfillment(_requestId) {
  }
}
